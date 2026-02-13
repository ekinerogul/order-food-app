const router = require("express").Router();
const { userService } = require("../services");
const { sendSuccess, sendError } = require("../lib/response-helper");
const { authUser } = require("../lib/auth");
const mongoose = require("mongoose");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

router.get("/", async (req, res, next) => {
  try {
    const users = await userService.findBy();
    return sendSuccess(res, users);
  } catch (e) {
    next(e);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const { email, password, name, age } = req.body;

    if (!email || !password || !name || !age) {
      return sendError(
        res,
        400,
        "Email, password, name, and age are required fields.",
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendError(res, 400, "Please enter a valid email address.");
    }

    if (password.length < 6) {
      return sendError(
        res,
        400,
        "The password must be at least 6 characters long.",
      );
    }

    if (name.length < 2) {
      return sendError(
        res,
        400,
        "The name must be at least 2 characters long.",
      );
    }

    const ageNum = Number(age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 120) {
      return sendError(res, 400, "Please enter a valid age (18+).");
    }

    const user = await userService.register(email, password, name, ageNum);

    return sendSuccess(res, user, "User created successfully", 201);
  } catch (e) {
    if (e.message === "EMAIL_EXISTS")
      return sendError(res, 409, "This email address is already registered.");
    if (e.name === "ValidationError")
      return sendError(res, 400, "Invalid data format.");
    next(e);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return sendError(res, 400, "Email and password are required.");

    const user = await userService.login(email, password);
    return sendSuccess(res, user, "Login successful");
  } catch (e) {
    if (e.message === "USER_NOT_FOUND")
      return sendError(res, 404, "User not found.");
    if (e.message === "INVALID_PASSWORD")
      return sendError(res, 401, "Incorrect password.");
    next(e);
  }
});

router.get("/me", authUser, async (req, res, next) => {
  try {
    const user = await userService.find(req.user.id);
    if (!user) return sendError(res, 404, "User not found.");

    return sendSuccess(res, user);
  } catch (e) {
    next(e);
  }
});

router.patch("/me", authUser, async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) return sendError(res, 400, "Name field is required.");
    if (name.length < 2) return sendError(res, 400, "Name too short.");

    await userService.update(req.user.id, { name });
    return sendSuccess(res, null, "User updated.");
  } catch (e) {
    next(e);
  }
});

router.patch("/me/password", authUser, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return sendError(res, 400, "Current and new password are required.");
    }

    if (newPassword.length < 6) {
      return sendError(res, 400, "New password must be at least 6 characters.");
    }

    const user = await userService.updatePassword(
      req.user.id,
      currentPassword,
      newPassword,
    );

    return sendSuccess(res, null, "Password updated successfully.");
  } catch (e) {
    if (e.message === "INVALID_CURRENT_PASSWORD") {
      return sendError(res, 401, "Current password is incorrect.");
    }
    next(e);
  }
});

router.patch("/me/email", authUser, async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) return sendError(res, 400, "Email is required.");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendError(res, 400, "Please enter a valid email address.");
    }

    const user = await userService.updateEmail(req.user.id, email);
    return sendSuccess(res, user, "Email updated successfully.");
  } catch (e) {
    if (e.message === "USER_NOT_FOUND")
      return sendError(res, 404, "User not found.");
    if (e.message === "EMAIL_EXISTS")
      return sendError(res, 409, "This email address is already registered.");
    next(e);
  }
});

router.delete("/me", authUser, async (req, res, next) => {
  try {
    await userService.removeBy("_id", req.user.id);
    return sendSuccess(res, null, "User deleted.");
  } catch (e) {
    next(e);
  }
});

router.post("/me/addresses", authUser, async (req, res, next) => {
  try {
    const address = req.body;

    if (!address.street || !address.city)
      return sendError(res, 400, "Street and city are mandatory.");
    if (address.street.length < 5)
      return sendError(res, 400, "Street address too short.");
    if (address.city.length < 2)
      return sendError(res, 400, "City name too short.");

    const user = await userService.addAddress(req.user.id, address);
    return sendSuccess(res, user, "Address added.");
  } catch (e) {
    if (e.message === "USER_NOT_FOUND")
      return sendError(res, 404, "User not found.");
    next(e);
  }
});

router.patch("/me/addresses/:addressId", authUser, async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const updateData = req.body;

    if (!isValidId(addressId))
      return sendError(res, 400, "Invalid address ID.");

    if (updateData.street !== undefined && updateData.street.length < 5) {
      return sendError(res, 400, "Street address too short.");
    }

    if (updateData.city !== undefined && updateData.city.length < 2) {
      return sendError(res, 400, "City name too short.");
    }

    const user = await userService.updateAddress(
      req.user.id,
      addressId,
      updateData,
    );
    return sendSuccess(res, user, "Address updated successfully.");
  } catch (e) {
    if (e.message === "USER_NOT_FOUND")
      return sendError(res, 404, "User not found.");
    if (e.message === "ADDRESS_NOT_FOUND")
      return sendError(res, 404, "Address not found.");
    next(e);
  }
});

router.delete("/me/addresses/:addressId", authUser, async (req, res, next) => {
  try {
    const { addressId } = req.params;

    if (!isValidId(addressId))
      return sendError(res, 400, "Invalid address ID.");

    await userService.removeAddress(req.user.id, addressId);
    return sendSuccess(res, null, "Address deleted successfully.");
  } catch (e) {
    if (e.message === "USER_NOT_FOUND")
      return sendError(res, 404, "User not found.");
    next(e);
  }
});

module.exports = router;

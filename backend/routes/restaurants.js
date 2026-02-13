const { restaurantService } = require("../services");
const router = require("express").Router();
const { sendSuccess, sendError } = require("../lib/response-helper");
const { authRestaurant } = require("../lib/auth");
const mongoose = require("mongoose");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

router.post("/register", async (req, res, next) => {
  try {
    const { email, password, name, ownerName, address } = req.body;

    if (!email || !password || !name || !ownerName || !address) {
      return sendError(
        res,
        400,
        "Email, password, name, ownerName, and address are required.",
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
        "The restaurant name must be at least 2 characters long.",
      );
    }

    if (ownerName.length < 2) {
      return sendError(
        res,
        400,
        "The owner name must be at least 2 characters long.",
      );
    }

    if (!address.street || !address.city) {
      return sendError(res, 400, "Street and city are required.");
    }

    if (address.street.length < 5) {
      return sendError(
        res,
        400,
        "The street address must be at least 5 characters long.",
      );
    }

    if (address.city.length < 2) {
      return sendError(
        res,
        400,
        "The city name must be at least 2 characters long.",
      );
    }

    const restaurant = await restaurantService.register(
      email,
      password,
      name,
      ownerName,
      address,
    );

    return sendSuccess(res, restaurant, "Restaurant created successfully", 201);
  } catch (e) {
    if (e.message === "EMAIL_EXISTS") {
      return sendError(res, 409, "This email address is already registered.");
    }

    if (e.name === "ValidationError") {
      return sendError(res, 400, "Invalid data format.");
    }

    console.error("Register restaurant error:", e);
    next(e);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, "Email and password are required.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendError(res, 400, "Please enter a valid email address.");
    }

    const restaurant = await restaurantService.login(email, password);

    return sendSuccess(res, restaurant, "Login successful");
  } catch (e) {
    if (e.message === "RESTAURANT_NOT_FOUND") {
      return sendError(res, 404, "Restaurant not found.");
    }

    if (e.message === "INVALID_PASSWORD") {
      return sendError(res, 401, "Incorrect password.");
    }

    console.error("Login restaurant error:", e);
    next(e);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const restaurants = await restaurantService.load();
    return sendSuccess(res, restaurants);
  } catch (e) {
    next(e);
  }
});

router.get("/search", async (req, res, next) => {
  try {
    const { name, food } = req.query;

    if (!name && !food) {
      return sendError(
        res,
        400,
        "At least one search parameter (name or food) is required.",
      );
    }

    let restaurants;

    if (name && food) {
      const byName = await restaurantService.findByName(name);
      const byFood = await restaurantService.findByFoodName(food);

      const idSet = new Set();
      restaurants = [];

      [...byName, ...byFood].forEach((r) => {
        const id = r._id.toString();
        if (!idSet.has(id)) {
          idSet.add(id);
          restaurants.push(r);
        }
      });
    } else if (name) {
      restaurants = await restaurantService.findByName(name);
    } else {
      restaurants = await restaurantService.findByFoodName(food);
    }

    return sendSuccess(res, restaurants);
  } catch (e) {
    console.error("Search restaurants error:", e);
    next(e);
  }
});

router.get("/:restaurantId", async (req, res, next) => {
  try {
    const { restaurantId } = req.params;

    if (!isValidId(restaurantId)) {
      return sendError(res, 400, "Invalid restaurant ID.");
    }

    const restaurant = await restaurantService.find(restaurantId);

    if (!restaurant) {
      return sendError(res, 404, "Restaurant not found.");
    }

    return sendSuccess(res, restaurant);
  } catch (e) {
    console.error("Get restaurant error:", e);
    next(e);
  }
});

router.patch("/me", authRestaurant, async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return sendError(res, 400, "Name field is required.");
    }

    if (name.length < 2) {
      return sendError(
        res,
        400,
        "The name must be at least 2 characters long.",
      );
    }

    await restaurantService.update(req.restaurant.id, { name });

    return sendSuccess(res, null, "Restaurant updated.");
  } catch (e) {
    console.error("Update restaurant error:", e);
    next(e);
  }
});

router.patch("/me/email", authRestaurant, async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendError(res, 400, "Email is required.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendError(res, 400, "Please enter a valid email address.");
    }

    const restaurant = await restaurantService.updateEmail(
      req.restaurant.id,
      email,
    );
    return sendSuccess(res, restaurant, "Email updated successfully.");
  } catch (e) {
    if (e.message === "RESTAURANT_NOT_FOUND") {
      return sendError(res, 404, "Restaurant not found.");
    }
    if (e.message === "EMAIL_EXISTS") {
      return sendError(res, 409, "This email address is already registered.");
    }

    console.error("Update restaurant email error:", e);
    next(e);
  }
});

router.patch("/me/address", authRestaurant, async (req, res, next) => {
  try {
    const { street, city, zipCode } = req.body;

    if (!street || !city) {
      return sendError(res, 400, "Street and city are required.");
    }

    if (street.length < 5) {
      return sendError(
        res,
        400,
        "The street address must be at least 5 characters long.",
      );
    }

    if (city.length < 2) {
      return sendError(
        res,
        400,
        "The city name must be at least 2 characters long.",
      );
    }

    const restaurant = await restaurantService.updateAddress(
      req.restaurant.id,
      { street, city, zipCode },
    );

    return sendSuccess(res, restaurant, "Restaurant address updated.");
  } catch (e) {
    if (e.message === "RESTAURANT_NOT_FOUND") {
      return sendError(res, 404, "Restaurant not found.");
    }

    console.error("Update restaurant address error:", e);
    next(e);
  }
});

router.post("/me/menu", authRestaurant, async (req, res, next) => {
  try {
    const { name, price, category } = req.body;

    if (!name) {
      return sendError(res, 400, "Food name is required.");
    }

    if (name.length < 2) {
      return sendError(
        res,
        400,
        "The food name must be at least 2 characters long.",
      );
    }

    if (price === undefined || price === null) {
      return sendError(res, 400, "Price is required.");
    }

    const priceNum = Number(price);
    if (isNaN(priceNum)) {
      return sendError(res, 400, "Price must be a number.");
    }
    if (priceNum < 10) {
      return sendError(res, 400, "The price must be at least 10.");
    }

    if (category && category.length < 2) {
      return sendError(
        res,
        400,
        "The category must have at least 2 characters.",
      );
    }

    const restaurant = await restaurantService.addFood(
      req.restaurant.id,
      name,
      priceNum,
      category,
    );

    return sendSuccess(res, restaurant, "Food added to menu.");
  } catch (e) {
    if (e.message === "RESTAURANT_NOT_FOUND") {
      return sendError(res, 404, "Restaurant not found.");
    }

    console.error("Add food error:", e);
    next(e);
  }
});

router.patch("/me/menu/:foodId", authRestaurant, async (req, res, next) => {
  try {
    const { foodId } = req.params;
    const { name, price, category } = req.body;

    if (!isValidId(foodId)) {
      return sendError(res, 400, "Invalid food ID.");
    }

    if (!name && price === undefined && !category) {
      return sendError(
        res,
        400,
        "At least one field (name, price, or category) is required.",
      );
    }

    if (name && name.length < 2) {
      return sendError(
        res,
        400,
        "The food name must be at least 2 characters long.",
      );
    }

    if (price !== undefined) {
      const priceNum = Number(price);
      if (isNaN(priceNum)) {
        return sendError(res, 400, "Price must be a number.");
      }
      if (priceNum < 10) {
        return sendError(res, 400, "The price must be at least 10.");
      }
    }

    if (category && category.length < 2) {
      return sendError(
        res,
        400,
        "The category must have at least 2 characters.",
      );
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (price !== undefined) updateData.price = Number(price);
    if (category) updateData.category = category;

    const restaurant = await restaurantService.updateFood(
      req.restaurant.id,
      foodId,
      updateData,
    );

    return sendSuccess(res, restaurant, "Food updated.");
  } catch (e) {
    if (e.message === "RESTAURANT_NOT_FOUND") {
      return sendError(res, 404, "Restaurant not found.");
    }

    if (e.message === "FOOD_NOT_FOUND") {
      return sendError(res, 404, "Food item not found in menu.");
    }

    console.error("Update food error:", e);
    next(e);
  }
});

router.delete("/me/menu/:foodId", authRestaurant, async (req, res, next) => {
  try {
    const { foodId } = req.params;

    if (!isValidId(foodId)) {
      return sendError(res, 400, "Invalid food ID.");
    }

    const restaurant = await restaurantService.removeFood(
      req.restaurant.id,
      foodId,
    );

    return sendSuccess(res, restaurant, "Food removed from menu.");
  } catch (e) {
    if (e.message === "RESTAURANT_NOT_FOUND") {
      return sendError(res, 404, "Restaurant not found.");
    }

    if (e.message === "FOOD_NOT_FOUND") {
      return sendError(res, 404, "Food item not found in menu.");
    }

    console.error("Remove food error:", e);
    next(e);
  }
});

router.delete("/me", authRestaurant, async (req, res, next) => {
  try {
    await restaurantService.removeBy("_id", req.restaurant.id);
    return sendSuccess(res, null, "Restaurant deleted.");
  } catch (e) {
    console.error("Delete restaurant error:", e);
    next(e);
  }
});

module.exports = router;

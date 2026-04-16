const { orderService } = require("../services");
const router = require("express").Router();
const { sendSuccess, sendError } = require("../lib/response-helper");
const { authUser, authRestaurant } = require("../lib/auth");
const mongoose = require("mongoose");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

router.post("/", authUser, async (req, res, next) => {
  try {
    const { restaurantId, items, addressId } = req.body;

    if (!restaurantId || !items || !addressId) {
      return sendError(res, 400, "Missing required fields.");
    }

    if (!Array.isArray(items) || items.length === 0) {
      return sendError(res, 400, "Items must be a non-empty array.");
    }

    for (const item of items) {
      if (
        !item.foodName ||
        item.price === undefined ||
        item.price === null ||
        item.quantity < 1
      ) {
        return sendError(res, 400, "Invalid item details.");
      }
    }

    const order = await orderService.order(
      restaurantId,
      req.user.id,
      items,
      addressId,
    );

    return sendSuccess(res, order, "Order created successfully", 201);
  } catch (e) {
    if (e.message === "USER_NOT_FOUND")
      return sendError(res, 404, "User not found.");
    if (e.message === "RESTAURANT_NOT_FOUND")
      return sendError(res, 404, "Restaurant not found.");
    if (e.message === "ADDRESS_NOT_FOUND_FOR_USER")
      return sendError(res, 400, "Address does not belong to this user.");
    if (e.message === "FOOD_NOT_FOUND_IN_MENU")
      return sendError(
        res,
        400,
        "One or more items are not on the restaurant menu.",
      );
    if (e.message === "ORDER_CREATION_FAILED")
      return sendError(res, 500, "Order creation failed. Please try again.");

    console.error("Create order error:", e);
    next(e);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const orders = await orderService.load();
    return sendSuccess(res, orders);
  } catch (e) {
    next(e);
  }
});

router.get("/search", async (req, res, next) => {
  try {
    const { foodName, city, status } = req.query;

    const query = {};

    if (foodName) {
      query.items = {
        $elemMatch: {
          foodName: foodName,
        },
      };
    }

    if (city) {
      query.address = {};
      query.address.city = new RegExp(city, "i");
    }

    if (status) {
      const validStatuses = [
        "pending",
        "confirmed",
        "preparing",
        "delivered",
        "cancelled",
      ];
      if (!validStatuses.includes(status)) {
        return sendError(
          res,
          400,
          "Invalid status. Must be one of: pending, confirmed, preparing, delivered, cancelled.",
        );
      }
      query.status = status;
    }

    const orders = await orderService.query(query);
    return sendSuccess(res, orders);
  } catch (e) {
    console.error("Search orders error:", e);
    next(e);
  }
});

router.get("/restaurant/me", authRestaurant, async (req, res, next) => {
  try {
    const orders = await orderService.findByRestaurantId(req.restaurant.id);
    return sendSuccess(res, orders);
  } catch (e) {
    console.error("Get restaurant orders error:", e);
    next(e);
  }
});

router.get("/:orderId", async (req, res, next) => {
  try {
    const { orderId } = req.params;

    if (!isValidId(orderId)) {
      return sendError(res, 400, "Invalid order ID.");
    }

    const order = await orderService.find(orderId);

    if (!order) {
      return sendError(res, 404, "Order not found.");
    }

    return sendSuccess(res, order);
  } catch (e) {
    console.error("Get order error:", e);
    next(e);
  }
});

router.patch("/:orderId/status", authRestaurant, async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!isValidId(orderId)) {
      return sendError(res, 400, "Invalid order ID.");
    }

    if (!status) {
      return sendError(res, 400, "Status is required.");
    }

    const validStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return sendError(
        res,
        400,
        "Invalid status. Must be one of: pending, confirmed, preparing, delivered, cancelled.",
      );
    }

    const order = await orderService.updateStatus(orderId, status);

    return sendSuccess(res, order, "Order status updated.");
  } catch (e) {
    if (e.message === "ORDER_NOT_FOUND") {
      return sendError(res, 404, "Order not found.");
    }

    console.error("Update order status error:", e);
    next(e);
  }
});

module.exports = router;

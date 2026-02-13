const BaseService = require("./base-service");
const Order = require("../models/order");
const User = require("../models/user");
const restaurantService = require("./restaurant-service");
const userService = require("./user-service");

class OrderService extends BaseService {
  async findByUserId(userId) {
    return this.findBy("user", userId);
  }

  async findByRestaurantId(restaurantId) {
    return this.findBy("restaurant", restaurantId);
  }

  async updateStatus(orderId, status) {
    const order = await this.findOrFail(orderId, "ORDER_NOT_FOUND");
    order.status = status;
    await order.save();
    return order;
  }

  async order(restaurantId, userId, items, addressId) {
    const user = await userService.find(userId);
    if (!user) throw new Error("USER_NOT_FOUND");

    const restaurant = await restaurantService.find(restaurantId);
    if (!restaurant) throw new Error("RESTAURANT_NOT_FOUND");

    if (!Array.isArray(user.addresses)) {
      throw new Error("ADDRESS_NOT_FOUND_FOR_USER");
    }

    const selectedAddress = user.addresses.find(
      (addr) => addr._id.toString() === addressId,
    );
    if (!selectedAddress) throw new Error("ADDRESS_NOT_FOUND_FOR_USER");

    const verifiedItems = items.map((item) => {
      const menuItem = restaurant.menu.find((m) => m.name === item.foodName);
      if (!menuItem) throw new Error("FOOD_NOT_FOUND_IN_MENU");

      return {
        foodName: item.foodName,
        price: menuItem.price,
        quantity: item.quantity,
      };
    });

    let totalPrice = 0;
    verifiedItems.forEach((item) => {
      totalPrice += item.price * item.quantity;
    });

    const order = await this.insert({
      user: userId,
      restaurant: restaurantId,
      items: verifiedItems,
      totalPrice,
      address: {
        addressId: selectedAddress._id,
        city: selectedAddress.city,
        street: selectedAddress.street,
        details: selectedAddress.details || "",
      },
      status: "pending",
    });

    try {
      await User.updateOne({ _id: userId }, { $push: { orders: order._id } });
    } catch (e) {
      await this.removeBy("_id", order._id);
      throw new Error("ORDER_CREATION_FAILED");
    }

    return order;
  }
}

module.exports = new OrderService(Order);

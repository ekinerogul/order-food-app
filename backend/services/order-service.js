const BaseService = require("./base-service");
const Order = require("../models/order");
const restaurantService = require("./restaurant-service");
const userService = require("./user-service");

class OrderService extends BaseService {
  async findByUserId(userId) {
    return this.findBy("user", userId);
  }

  async findByRestaurantId(restaurantId) {
    return this.findBy("restaurant", restaurantId);
  }

  async order(restaurantId, userId, items, address) {
    console.log("Order called with:", { restaurantId, userId, items, address });

    const user = await userService.find(userId);
    console.log("User found:", user);

    const restaurant = await restaurantService.find(restaurantId);
    console.log("Restaurant found:", restaurant);

    let totalPrice = 0;
    items.forEach((item) => {
      totalPrice += item.price * item.quantity;
    });

    console.log("Total price:", totalPrice);

    const order = await this.insert({
      user,
      restaurant,
      items,
      totalPrice,
      address,
      status: "pending",
    });

    console.log("Order created:", order);

    user.orders.push(order);
    await user.save();

    return order;
  }
}

module.exports = new OrderService(Order);

const BaseService = require("./base-service");
const Restaurant = require("../models/restaurant");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../lib/auth");

class RestaurantService extends BaseService {
  async findByName(name) {
    return this.model.find({ name: new RegExp(name, "i") });
  }

  async findByFoodName(foodName) {
    return this.model.find({ "menu.name": new RegExp(foodName, "i") });
  }

  async register(email, password, name, ownerName, address) {
    const existingRestaurant = await this.findBy("email", email);

    if (existingRestaurant.length > 0) {
      throw new Error("EMAIL_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const restaurant = await this.insert({
      email,
      password: hashedPassword,
      name,
      ownerName,
      address,
      menu: [],
    });

    const token = generateToken({ id: restaurant._id, role: "restaurant" });

    return {
      token,
      id: restaurant._id,
      email: restaurant.email,
      name: restaurant.name,
      ownerName: restaurant.ownerName,
      address: restaurant.address,
      workingHours: restaurant.workingHours,
      menu: restaurant.menu,
    };
  }

  async login(email, password) {
    const restaurants = await this.findBy("email", email);
    const restaurant = restaurants[0];

    if (!restaurant) {
      throw new Error("RESTAURANT_NOT_FOUND");
    }

    const isMatch = await bcrypt.compare(password, restaurant.password);
    if (!isMatch) {
      throw new Error("INVALID_PASSWORD");
    }

    const token = generateToken({ id: restaurant._id, role: "restaurant" });

    return {
      token,
      id: restaurant._id,
      email: restaurant.email,
      name: restaurant.name,
      ownerName: restaurant.ownerName,
      address: restaurant.address,
      workingHours: restaurant.workingHours,
      menu: restaurant.menu,
    };
  }

  async updateEmail(restaurantId, newEmail) {
    const restaurant = await this.findOrFail(
      restaurantId,
      "RESTAURANT_NOT_FOUND",
    );

    const existingRestaurant = await this.findBy("email", newEmail);
    if (
      existingRestaurant.length > 0 &&
      existingRestaurant[0]._id.toString() !== restaurantId
    ) {
      throw new Error("EMAIL_EXISTS");
    }

    restaurant.email = newEmail;
    await restaurant.save();

    return {
      id: restaurant._id,
      email: restaurant.email,
      name: restaurant.name,
      ownerName: restaurant.ownerName,
      address: restaurant.address,
      workingHours: restaurant.workingHours,
      menu: restaurant.menu,
    };
  }

  async updateAddress(restaurantId, address) {
    const restaurant = await this.findOrFail(
      restaurantId,
      "RESTAURANT_NOT_FOUND",
    );

    restaurant.address = address;
    await restaurant.save();
    return restaurant;
  }

  async addFood(restaurantId, foodName, price, category) {
    const restaurant = await this.findOrFail(
      restaurantId,
      "RESTAURANT_NOT_FOUND",
    );

    restaurant.menu.push({
      name: foodName,
      price,
      category: category || "General",
    });

    await restaurant.save();
    return restaurant;
  }

  async updateFood(restaurantId, foodId, updateData) {
    const restaurant = await this.findOrFail(
      restaurantId,
      "RESTAURANT_NOT_FOUND",
    );

    const food = restaurant.menu.id(foodId);
    if (!food) throw new Error("FOOD_NOT_FOUND");

    if (updateData.name) food.name = updateData.name;
    if (updateData.price) food.price = updateData.price;
    if (updateData.category) food.category = updateData.category;

    await restaurant.save();
    return restaurant;
  }

  async removeFood(restaurantId, foodId) {
    const restaurant = await this.findOrFail(
      restaurantId,
      "RESTAURANT_NOT_FOUND",
    );

    const food = restaurant.menu.id(foodId);
    if (!food) throw new Error("FOOD_NOT_FOUND");

    restaurant.menu.pull(foodId);
    await restaurant.save();
    return restaurant;
  }
}

module.exports = new RestaurantService(Restaurant);

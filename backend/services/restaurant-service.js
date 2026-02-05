const BaseService = require("./base-service");
const Restaurant = require("../models/restaurant");

class RestaurantService extends BaseService {
  async findByRestaurantName(name) {
    return this.findBy("name", name);
  }

  async findByFoodName(foodName) {
    return this.findBy("menu.food.name", foodName);
  }

  async addFood(restaurantId, foodName, price, category) {
    const restaurant = await this.find(restaurantId);

    restaurant.menu.push({
      food: {
        name: foodName,
        price: price || 10,
        category: category || "General",
      },
    });

    await restaurant.save();
    return restaurant;
  }

  async register(email, password, name, ownerName, address) {
    const existingRestaurant = await this.findBy("email", email);
    if (existingRestaurant.length > 0) {
      throw new Error("Email already exists");
    }

    const restaurant = await this.insert({
      email,
      password,
      name,
      ownerName,
      address,
      menu: [],
    });

    return restaurant;
  }

  async login(email, password) {
    const restaurants = await this.findBy("email", email);
    const restaurant = restaurants[0];

    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    if (restaurant.password !== password) {
      throw new Error("Wrong password");
    }

    return restaurant;
  }
}

module.exports = new RestaurantService(Restaurant);

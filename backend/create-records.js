const User = require("./models/user");
const Restaurant = require("./models/restaurant");
const userService = require("./service/user-service");
const restaurantService = require("./service/restaurant-service");
const orderService = require("./services/order-service");

const printOrderHistory = require("./lib/print-order-history");

const user1 = User.create({ name: "User1", age: 25 });
const user2 = User.create({ name: "User2", age: 28 });
const restaurant1 = Restaurant.create({ name: "Restaurant1", menu: [] });
const restaurant2 = Restaurant.create({ name: "Restaurant2", menu: [] });

restaurant1.addFood("Food1");
restaurant1.addFood("Food2");
restaurant2.addFood("Food3");
restaurant2.addFood("Food4");

user1.order(restaurant1, "Food1", "Ankara");
user1.order(restaurant1, "Food2", "Antalya");
user2.order(restaurant2, "Food3", "Balikesir");
user2.order(restaurant2, "Food4", "Mersin");

async function main() {
  try {
    await userService.save([user1, user2]);

    await restaurantService.save([restaurant1, restaurant2]);

    const user3 = User.create({ name: "User3", age: 23 });

    await userService.insert(user3);
    const users = await userService.load();
    users.forEach(printOrderHistory);
  } catch (e) {
    return console.log(e);
  }
}

main();

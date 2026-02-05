const { userService, restaurantService } = require("./service");
const printOrderHistory = require("./lib/print-order-history");

async function main() {
  const restaurant2 = await restaurantService.findBy("name", "Restaurant2");
  const user1 = await userService.findByName("User1");

  user1.order(restaurant2, "Food4", "Cunda");
  userService.update(user1);
  printOrderHistory(user1);

  console.log(await userService.findBy("food", "Malatya"));
}

main();

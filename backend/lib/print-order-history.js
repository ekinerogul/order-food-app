const colors = require("colors");

function printOrder(order) {
  console.log(
    `${colors.magenta(order.user.name)} ordered ${colors.magenta(
      order.food
    )} from ${colors.magenta(order.restaurant.name)} to ${colors.magenta(
      order.address
    )}`
  );
}

function printOrderHistory(user) {
  if (user.orders.length === 0) {
    return console.log(`${colors.magenta(user.name)} has no orders yet.`);
  }

  user.orders.forEach(printOrder);
}

module.exports = printOrderHistory;

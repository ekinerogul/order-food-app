const printOrderHistory = require("../print-order-history");

test("prints user orders when a user has a order", () => {
  const user = {
    name: "Ekin",
    orders: [
      {
        user: { name: "Ekin" },
        restaurant: { name: "Restaurant1" },
        food: "Food1",
        address: "Ankara",
      },
    ],
  };

  const consoleSpy = jest.spyOn(console, "log");

  printOrderHistory(user);

  expect(consoleSpy).toHaveBeenCalledWith(
    "Ekin ordered Food1 from Restaurant1 to Ankara"
  );

  consoleSpy.mockRestore();
});

test("prints warning message when a user has no orders", () => {
  const user = {
    name: "Ekin",
    orders: [],
  };

  const consoleSpy = jest.spyOn(console, "log");

  printOrderHistory(user);

  expect(consoleSpy).toHaveBeenCalledWith("Ekin has no orders yet.");

  consoleSpy.mockRestore();
});

const orderService = require("../order-service");

test("findByUserId calls findBy with user id", async () => {
  const findBySpy = jest.spyOn(orderService, "findBy").mockResolvedValue([]);

  const userId = "user-id-123";

  const result = await orderService.findByUserId(userId);

  expect(findBySpy).toHaveBeenCalledWith("user", userId);
  expect(result).toEqual([]);

  findBySpy.mockRestore();
});

test("findByRestaurantId calls findBy with restaurant id", async () => {
  const findBySpy = jest.spyOn(orderService, "findBy").mockResolvedValue([]);

  const restaurantId = "restaurant-id-456";

  const result = await orderService.findByRestaurantId(restaurantId);

  expect(findBySpy).toHaveBeenCalledWith("restaurant", restaurantId);
  expect(result).toEqual([]);

  findBySpy.mockRestore();
});

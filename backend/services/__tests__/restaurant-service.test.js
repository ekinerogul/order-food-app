const restaurantService = require("../restaurant-service");

test("findByRestaurantName calls findBy with name", async () => {
  const findBySpy = jest
    .spyOn(restaurantService, "findBy")
    .mockResolvedValue([]);

  const restaurantName = "restaurantName";

  const result = await restaurantService.findByRestaurantName(restaurantName);

  expect(findBySpy).toHaveBeenCalledWith("name", restaurantName);
  expect(result).toEqual([]);

  findBySpy.mockRestore();
});

test("findByFoodName calls findBy with name", async () => {
  const findBySpy = jest
    .spyOn(restaurantService, "findBy")
    .mockResolvedValue([]);

  const foodName = "foodName";

  const result = await restaurantService.findByFoodName(foodName);

  expect(findBySpy).toHaveBeenCalledWith("menu.food.name", foodName);
  expect(result).toEqual([]);

  findBySpy.mockRestore();
});

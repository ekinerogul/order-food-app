const userService = require("../user-service");

test("findByName calls findBy with name", async () => {
  const findBySpy = jest.spyOn(userService, "findBy").mockResolvedValue([]);

  const userName = "userName";

  const result = await userService.findByName(userName);

  expect(findBySpy).toHaveBeenCalledWith("name", userName);
  expect(result).toEqual([]);

  findBySpy.mockRestore();
});

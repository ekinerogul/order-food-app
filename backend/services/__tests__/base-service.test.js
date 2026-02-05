const BaseService = require("../base-service");

test("save calls model.insert and returns its result", async () => {
  const user = {
    name: "Test user7",
    age: 24,
  };

  const fakeModel = {
    insert: jest.fn(),
  };

  fakeModel.insert.mockResolvedValue(user);

  const service = new BaseService(fakeModel);

  const result = await service.save(user);

  expect(fakeModel.insert).toHaveBeenCalledWith(user);
  expect(result).toEqual(user);
});

test("findBy calls model.find with dynamic property and returns result", async () => {
  const users = [
    { name: "Test user1", age: 24 },
    { name: "Test user2", age: 28 },
  ];

  const fakeModel = {
    find: jest.fn(),
  };

  fakeModel.find.mockResolvedValue(users);

  const service = new BaseService(fakeModel);

  const result = await service.findBy("name", "Test user1");

  expect(fakeModel.find).toHaveBeenCalledWith({ name: "Test user1" });
  expect(result).toEqual(users);
});

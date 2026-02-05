const app = require("../..");
const request = require("supertest")(app);

test("creates a new user", async () => {
  const userToCreate = {
    name: "Test user",
    age: 25,
  };

  const response = await request.post("/users").send(userToCreate).expect(200);

  const userCreated = response.body;

  expect(userCreated).toMatchObject(userToCreate);
  expect(userCreated.orders).toEqual([]);
});

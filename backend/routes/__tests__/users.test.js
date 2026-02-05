const app = require("../../..");
const request = require("supertest")(app);
const userService = require("../../services/user-service");

test("GET /users returns users page", async () => {
  await request.get("/users").expect(200);
});

test("POST /users creates a new user", async () => {
  const userToCreate = {
    name: "Test user1",
    age: 25,
  };

  const response = await request.post("/users").send(userToCreate).expect(200);

  const userCreated = response.body;

  expect(userCreated).toMatchObject(userToCreate);
  expect(userCreated.orders).toEqual([]);
});

test("POST /users calls next when service throws error", async () => {
  jest
    .spyOn(userService, "insert")
    .mockRejectedValue(new Error("insert failed"));

  await request.post("/users").send({ name: "Fail User", age: 30 }).expect(500);

  userService.insert.mockRestore();
});

test("DELETE /users/:id deletes user", async () => {
  const userToCreate = {
    name: "Test user 2",
    age: 26,
  };

  const userResponse = await request
    .post("/users")
    .send(userToCreate)
    .expect(200);

  const userId = userResponse.body._id;

  await request.delete(`/users/${userId}`).expect(200);
});

test("GET /find by young users", async () => {
  const youngUser = {
    name: "Young User",
    age: 18,
  };

  await request.post("/users").send(youngUser).expect(200);

  await request.get("/users/young-users").expect(200);
});

test("GET /users/:id returns user page", async () => {
  const userToCreate = {
    name: "Test User 3",
    age: 23,
  };

  const createResponse = await request
    .post("/users")
    .send(userToCreate)
    .expect(200);

  const userId = createResponse.body._id;

  await request.get(`/users/${userId}`).expect(200);
});

test("GET /users/:id returns 404 when user not found", async () => {
  await request.get("/users/696aa2c9d0f54988cef108b6").expect(404);
});

test("PATCH /users/:id updates user name", async () => {
  const userToCreate = {
    name: "Test user 5",
    age: 27,
  };

  const userResponse = await request
    .post("/users")
    .send(userToCreate)
    .expect(200);

  const userId = userResponse.body._id;

  await request
    .patch(`/users/${userId}`)
    .send({ name: "Updated user name" })
    .expect(200);
});

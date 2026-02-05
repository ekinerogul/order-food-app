const app = require("../..");
const request = require("supertest")(app);

test("GET /restaurants returns restaurants page", async () => {
  await request.get("/restaurants").expect(200);
});

test("DELETE /restaurants/:id deletes restaurant", async () => {
  const restaurantToCreate = {
    name: "Test restaurant 1",
    menu: [{ food: { name: "Food10" } }],
  };

  const restaurantResponse = await request
    .post("/restaurants")
    .send(restaurantToCreate)
    .expect(200);

  const restaurantId = restaurantResponse.body._id;

  await request.delete(`/restaurants/${restaurantId}`).expect(200);
});

test("GET /restaurants/:id returns restaurant page", async () => {
  const restaurantToCreate = {
    name: "Test Restaurant 2",
    menu: [],
  };

  const createResponse = await request
    .post("/restaurants")
    .send(restaurantToCreate)
    .expect(200);

  const restaurantId = createResponse.body._id;

  await request.get(`/restaurants/${restaurantId}`).expect(200);
});

test("GET /restaurants/:id returns 404 when restaurant not found", async () => {
  await request.get("/restaurants/696aa2c9d0f54988cef108b6").expect(404);
});

test("PATCH /restaurants/:id updates restaurant name", async () => {
  const restaurantToCreate = {
    name: "Test restaurant 3",
    menu: [{ food: { name: "Food11" } }],
  };

  const restaurantResponse = await request
    .post("/restaurants")
    .send(restaurantToCreate)
    .expect(200);

  const restaurantId = restaurantResponse.body._id;

  await request
    .patch(`/restaurants/${restaurantId}`)
    .send({ name: "Updated restaurant name" })
    .expect(200);
});

test("PATCH /restaurants/:id addFood to menu", async () => {
  const restaurantToCreate = {
    name: "Test restaurant 4",
    menu: [{ food: { name: "Food12" } }],
  };

  const restaurantResponse = await request
    .post("/restaurants")
    .send(restaurantToCreate)
    .expect(200);

  const restaurantId = restaurantResponse.body._id;

  await request
    .patch(`/restaurants/${restaurantId}/menu`)
    .send({ name: "Food13" })
    .expect(200);
});

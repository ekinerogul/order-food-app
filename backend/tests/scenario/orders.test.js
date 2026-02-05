const app = require("../..");
const request = require("supertest")(app);

test("creates a new order", async () => {
  const userToCreate = {
    name: "Test user",
    age: 25,
  };

  const restaurantToCreate = {
    name: "Test restaurant",
    menu: [{ food: { name: "Food0" } }],
  };

  const food = "Food0";
  const address = "Ayvalik";

  const userResponse = await request
    .post("/users")
    .send(userToCreate)
    .expect(200);

  const restaurantResponse = await request
    .post("/restaurants")
    .send(restaurantToCreate)
    .expect(200);

  const orderResponse = await request
    .post(`/users/${userResponse.body._id}/orders`)
    .send({
      restaurantId: restaurantResponse.body._id,
      food,
      address,
    })
    .expect(200);

  const orderCreated = orderResponse.body;

  console.log("order", orderCreated);

  expect(orderCreated).toMatchObject({
    restaurant: restaurantResponse.body,
    user: userResponse.body,
    food,
    address,
  });
});

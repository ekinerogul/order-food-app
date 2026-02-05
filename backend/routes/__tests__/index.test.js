const app = require("../..");
const request = require("supertest")(app);

test("GET / renders index page", async () => {
  await request.get("/").expect(200);
});

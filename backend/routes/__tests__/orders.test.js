const app = require("../..");
const request = require("supertest")(app);

test("GET /orders returns orders page", async () => {
  await request.get("/orders").expect(200);
});

test("search orders by food only", async () => {
  await request.get("/orders/search?food=Food1").expect(200);
});

test("search orders by address only", async () => {
  await request.get("/orders/search?address=Ankara").expect(200);
});

import request from "supertest";
import { app } from "../src/index";

const TEST_TOKEN = process.env.INTERNAL_TEST_JWT || "super_secret_test_token";
const authHeader = { Authorization: `Bearer ${TEST_TOKEN}` };

describe("Item Suffix Display", () => {
  let itemId: number;
  const unique = Date.now();

  beforeAll(async () => {
    const res = await request(app).post("/api/items").set(authHeader).send({
      name: `Mystic Wand_${unique}`,
      description: "A wand for testing.",
      bonusStrength: 0,
      bonusAgility: 0,
      bonusIntelligence: 5,
      bonusFaith: 0
    });
    itemId = res.body.id;
  });

  it("should return item with correct suffix in displayName", async () => {
    const res = await request(app).get(`/api/items/${itemId}`).set(authHeader);
    expect(res.statusCode).toBe(200);
    expect(res.body.displayName).toMatch(/of Intelligence/);
    expect(res.body.name).toMatch(/Mystic Wand/);
  });

  it("should return 404 for missing item", async () => {
    const res = await request(app).get(`/api/items/999999`).set(authHeader);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });
});
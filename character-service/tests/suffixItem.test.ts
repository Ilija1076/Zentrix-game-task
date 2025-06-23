import request from "supertest";
import { app } from "../src/index";

describe("Item Suffix Display", () => {
  let itemId: number;

  beforeAll(async () => {
    const res = await request(app).post("/api/items").send({
      name: "Mystic Wand",
      description: "A wand for testing.",
      bonusStrength: 0,
      bonusAgility: 0,
      bonusIntelligence: 5,
      bonusFaith: 0
    });
    itemId = res.body.id;
  });

  it("should return item with correct suffix in displayName", async () => {
    const res = await request(app).get(`/api/items/${itemId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.displayName).toMatch(/of Intelligence/);
    expect(res.body.name).toBe("Mystic Wand");
  });

  it("should return 404 for missing item", async () => {
    const res = await request(app).get(`/api/items/999999`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });
});
import request from "supertest";
import { app } from "../src/index";

const TEST_TOKEN = process.env.INTERNAL_TEST_JWT || "super_secret_test_token";
const authHeader = { Authorization: `Bearer ${TEST_TOKEN}` };

describe("Grant Item to Character", () => {
  let characterId: number;
  let itemId: number;
  const unique = Date.now();

  beforeAll(async () => {
    const charRes = await request(app)
      .post("/api/character")
      .set(authHeader)
      .send({
        name: `ItemReceiver_${unique}`,
        classId: 1,
        health: 100,
        mana: 50,
        baseStrength: 5,
        baseAgility: 5,
        baseIntelligence: 5,
        baseFaith: 5
      });
    characterId = charRes.body.id;

    const itemRes = await request(app)
      .post("/api/items")
      .set(authHeader)
      .send({
        name: `Sword of Jest_${unique}`,
        description: "A sword for testing.",
        bonusStrength: 5,
        bonusAgility: 0,
        bonusIntelligence: 0,
        bonusFaith: 0
      });
    itemId = itemRes.body.id;
  });

  it("should grant an item to a character", async () => {
    const res = await request(app)
      .post(`/api/items/grant`)
      .set(authHeader)
      .send({ characterId, itemId });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/granted/i);
  });

  it("should not grant the same item twice", async () => {
    const res = await request(app)
      .post(`/api/items/grant`)
      .set(authHeader)
      .send({ characterId, itemId });
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toMatch(/already has/i);
  });
});
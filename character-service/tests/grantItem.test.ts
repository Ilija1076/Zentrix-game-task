import request from "supertest";
import { app } from "../src/index";

describe("Grant Item to Character", () => {
  let characterId: number;
  let itemId: number;

  beforeAll(async () => {
    const charRes = await request(app).post("/api/character").send({
      name: "ItemReceiver",
      classId: 1,
      health: 100,
      mana: 20,
      baseStrength: 1,
      baseAgility: 1,
      baseIntelligence: 1,
      baseFaith: 1
    });
    characterId = charRes.body.id;

    const itemRes = await request(app).post("/api/items").send({
      name: "Cool Sword",
      description: "A fine blade.",
      bonusStrength: 10,
      bonusAgility: 0,
      bonusIntelligence: 0,
      bonusFaith: 0
    });
    itemId = itemRes.body.id;
  });

  it("should grant an item to character", async () => {
    const res = await request(app)
      .post("/api/items/grant")
      .send({ characterId, itemId });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/granted/i);

    const charRes = await request(app)
      .get(`/api/character/${characterId}`);
    expect(charRes.body.items.some((i: any) => i.id === itemId)).toBe(true);
  });

  it("should fail if item does not exist", async () => {
    const res = await request(app)
      .post("/api/items/grant")
      .send({ characterId, itemId: 999999 });
    expect(res.statusCode).toBe(404);
  });

  it("should fail if character does not exist", async () => {
    const res = await request(app)
      .post("/api/items/grant")
      .send({ characterId: 999999, itemId });
    expect(res.statusCode).toBe(404);
  });
});
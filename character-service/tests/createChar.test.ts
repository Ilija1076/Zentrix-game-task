import request from "supertest";
import { app } from "../src/index";

const TEST_TOKEN = process.env.INTERNAL_TEST_JWT || "super_secret_test_token";
const authHeader = { Authorization: `Bearer ${TEST_TOKEN}` };

describe("Character Creation", () => {
  it("should create a character with valid data", async () => {
    const uniqueName = `TestHero_${Date.now()}`;
    const response = await request(app)
      .post("/api/character")
      .set(authHeader)
      .send({
        name: uniqueName,
        classId: 1,
        health: 100,
        mana: 50,
        baseStrength: 10,
        baseAgility: 5,
        baseIntelligence: 3,
        baseFaith: 2
      });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.message).toBe("Character has been created");
  });

  it("should not allow duplicate character names", async () => {
    const uniqueName = `UniqueName_${Date.now()}`;
    await request(app).post("/api/character").set(authHeader).send({
      name: uniqueName,
      classId: 1,
      health: 100,
      mana: 50,
      baseStrength: 1,
      baseAgility: 1,
      baseIntelligence: 1,
      baseFaith: 1
    });
    const response = await request(app).post("/api/character").set(authHeader).send({
      name: uniqueName,
      classId: 1,
      health: 100,
      mana: 50,
      baseStrength: 1,
      baseAgility: 1,
      baseIntelligence: 1,
      baseFaith: 1
    });
    expect(response.statusCode).toBe(409);
    expect(response.body.message).toMatch(/already exists/i);
  });

  it("should fail if required fields are missing", async () => {
    const response = await request(app)
      .post("/api/character")
      .set(authHeader)
      .send({ name: "NoClass" });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toMatch(/missing/i);
  });
});
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../src/index");
const datasource_1 = require("../src/datasource"); 
const TEST_TOKEN = process.env.INTERNAL_TEST_JWT || "super_secret_test_token";
const authHeader = { Authorization: `Bearer ${TEST_TOKEN}` };
describe("Character Creation", () => {
    it("should create a character with valid data", async () => {
        const response = await (0, supertest_1.default)(index_1.app)
            .post("/api/character")
            .set(authHeader)
            .send({
            name: "TestHero",
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
        await (0, supertest_1.default)(index_1.app).post("/api/character").set(authHeader).send({
            name: "UniqueName",
            classId: 1,
            health: 100,
            mana: 50,
            baseStrength: 1,
            baseAgility: 1,
            baseIntelligence: 1,
            baseFaith: 1
        });
        const response = await (0, supertest_1.default)(index_1.app).post("/api/character").set(authHeader).send({
            name: "UniqueName",
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
        const response = await (0, supertest_1.default)(index_1.app)
            .post("/api/character")
            .set(authHeader)
            .send({ name: "NoClass" });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toMatch(/missing/i);
    });
});
afterAll(async () => {
    if (datasource_1.AppDataSource.isInitialized) {
        await datasource_1.AppDataSource.destroy();
    }
});

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
describe("Item Suffix Display", () => {
    let itemId;
    beforeAll(async () => {
        const res = await (0, supertest_1.default)(index_1.app).post("/api/items").set(authHeader).send({
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
        const res = await (0, supertest_1.default)(index_1.app).get(`/api/items/${itemId}`).set(authHeader);
        expect(res.statusCode).toBe(200);
        expect(res.body.displayName).toMatch(/of Intelligence/);
        expect(res.body.name).toBe("Mystic Wand");
    });
    it("should return 404 for missing item", async () => {
        const res = await (0, supertest_1.default)(index_1.app).get(`/api/items/999999`).set(authHeader);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toMatch(/not found/i);
    });
});
afterAll(async () => {
    if (datasource_1.AppDataSource.isInitialized) {
        await datasource_1.AppDataSource.destroy();
    }
});

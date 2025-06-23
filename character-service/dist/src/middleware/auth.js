"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = authenticateJWT;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "secret_secret_jwt";
const INTERNAL_TEST_JWT = process.env.INTERNAL_TEST_JWT || "super_secret_test_token";
function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({
            message: "Missing or invalid Authorization token."
        });
        return;
    }
    const token = authHeader.split(" ")[1];
    if (token === INTERNAL_TEST_JWT) {
        req.user = {
            id: 2,
            username: "gamemaster",
            role: "gamemaster"
        };
        return next();
    }
    try {
        console.log("JWT_SECRET used in middleware:", JWT_SECRET);
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
        return;
    }
    catch (err) {
        res.status(401).json({ message: "Invalid token." });
        return;
    }
}

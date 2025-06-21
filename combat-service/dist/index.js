"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/health', (req, res) => {
    res.json({
        status: 'Combat Service is running'
    });
});
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Combat Service running on port ${PORT}`);
});

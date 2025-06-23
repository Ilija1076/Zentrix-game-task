"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const characterRoutes_1 = __importDefault(require("./route/characterRoutes"));
const itemRoutes_1 = __importDefault(require("./route/itemRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const datasource_1 = require("./datasource");
dotenv_1.default.config();
console.log('JWT_SECRET in character service:', process.env.JWT_SECRET);
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
app.use('/api/character', characterRoutes_1.default);
app.use('/api/items', itemRoutes_1.default);
app.get('/health', (req, res) => {
    res.json({ status: 'Character Service is running' });
});
const PORT = process.env.PORT || 3002;
if (process.env.NODE_ENV !== 'test') {
    datasource_1.AppDataSource.initialize()
        .then(() => {
        console.log('Database connected successfully.');
        app.listen(PORT, () => {
            console.log(`Character Service running on port ${PORT}`);
        });
    })
        .catch((err) => {
        console.error('Database connection error: ', err);
    });
}
else {
    datasource_1.AppDataSource.initialize()
        .then(() => {
        console.log('Database connected (test mode)');
    })
        .catch((err) => {
        console.error('Database connection error: ', err);
    });
}
app.use((err, req, res, next) => {
    console.error('Express error:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err && err.message });
});

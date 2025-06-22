import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./datasource";
import combatRoutes from "./route/combatRoute";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ status: "Combat Service is running" });
});

app.use("/api", combatRoutes);

const PORT = process.env.PORT || 3003;

AppDataSource.initialize().then(() => {
    console.log("Database connected successfully.");
    app.listen(PORT, () => {
        console.log(`Combat Service running on port ${PORT}`);
    });
}).catch((err) => {
    console.error("Database connection error: ", err);
});

export { app };
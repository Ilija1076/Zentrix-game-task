import { DataSource } from "typeorm";
import { Duel } from "./entity/Duel"; 
import * as dotenv from "dotenv";
dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Duel], 
    migrations: ["src/migrations/*.ts"],
    synchronize: false,
    logging: true
});
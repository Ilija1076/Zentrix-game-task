import { DataSource } from "typeorm";
import { Character } from "./entity/Character";
import { Class } from "./entity/Class";
import { Item } from "./entity/Item";
import * as dotenv from "dotenv";
dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Character, Class, Item],
    migrations: ["src/migrations/*.ts"],
    synchronize: false,
    logging: true
});
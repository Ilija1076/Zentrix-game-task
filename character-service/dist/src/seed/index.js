"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datasource_1 = require("../datasource");
const classSeeder_1 = require("./classSeeder");
const characterSeeder_1 = require("./characterSeeder");
const itemSeeder_1 = require("./itemSeeder");
async function runSeeders() {
    await datasource_1.AppDataSource.initialize();
    await (0, classSeeder_1.seedClass)(datasource_1.AppDataSource);
    await (0, itemSeeder_1.seedItem)(datasource_1.AppDataSource);
    await (0, characterSeeder_1.seedCharacter)(datasource_1.AppDataSource);
    console.log("Database fully seeded.");
    process.exit(0);
}
runSeeders().catch((err) => {
    console.log(err);
    process.exit(1);
});

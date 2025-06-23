"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedCharacter = seedCharacter;
const Character_1 = require("../entity/Character");
const Class_1 = require("../entity/Class");
async function seedCharacter(dataSource) {
    const repo = dataSource.getRepository(Character_1.Character);
    const classRepo = dataSource.getRepository(Class_1.Class);
    const warriorClass = await classRepo.findOneBy({ name: "Warrior" });
    if (!warriorClass)
        return;
    const exists = await repo.findOneBy({ name: "SampleWarrior" });
    if (!exists) {
        await repo.save({
            name: "SampleWarrior",
            health: 100,
            mana: 20,
            baseStrength: 10,
            baseAgility: 5,
            baseIntelligence: 2,
            baseFaith: 1,
            createdBy: 1,
            class: warriorClass,
        });
    }
}

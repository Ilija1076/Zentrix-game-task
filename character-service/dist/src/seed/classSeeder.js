"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedClass = seedClass;
const Class_1 = require("../entity/Class");
async function seedClass(datasource) {
    const repo = datasource.getRepository(Class_1.Class);
    const classes = [
        { name: "Warrior", description: "Strong melee fighter." },
        { name: "Rogue", description: "Stealthy and agile." },
        { name: "Mage", description: "Master of elements and user of magic." },
        { name: "Priest", description: "Healer and protector." },
        { name: "Ranger", description: "Expert archer and survivalist." },
        { name: "Druid", description: "Nature's guardian and shapeshifter." },
        { name: "Necromancer", description: "Ruler of the undead." }
    ];
    for (const c of classes) {
        const exists = await repo.findOneBy({ name: c.name });
        if (!exists) {
            await repo.save(c);
        }
    }
}

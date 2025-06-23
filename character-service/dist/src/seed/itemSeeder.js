"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedItem = seedItem;
const Item_1 = require("../entity/Item");
async function seedItem(dataSource) {
    const repo = dataSource.getRepository(Item_1.Item);
    const items = [
        { name: "Iron Sword", description: "A sturdy sword.", bonusStrength: 5, bonusAgility: 0, bonusIntelligence: 0, bonusFaith: 0 },
        { name: "Leather Boots", description: "Quick on your feet.", bonusStrength: 0, bonusAgility: 3, bonusIntelligence: 0, bonusFaith: 0 },
        { name: "Apprentice Staff", description: "Channel your magic.", bonusStrength: 0, bonusAgility: 0, bonusIntelligence: 4, bonusFaith: 0 },
        { name: "Holy Symbol", description: "Focus for prayers.", bonusStrength: 0, bonusAgility: 0, bonusIntelligence: 0, bonusFaith: 5 },
        { name: "Shadow Dagger", description: "Preferred weapon of rogues and assassins.", bonusStrength: 2, bonusAgility: 5, bonusIntelligence: 0, bonusFaith: 0 },
        { name: "Necro Tome", description: "A tome of forbidden spells.", bonusStrength: 0, bonusAgility: 0, bonusIntelligence: 5, bonusFaith: -2 },
        { name: "Healing Potion", description: "Restores health.", bonusStrength: 0, bonusAgility: 0, bonusIntelligence: 0, bonusFaith: 2 },
        { name: "Berserker Axe", description: "Axe that increases rage.", bonusStrength: 6, bonusAgility: 1, bonusIntelligence: 0, bonusFaith: 0 },
        { name: "Druidic Cloak", description: "Cloak woven from enchanted leaves.", bonusStrength: 0, bonusAgility: 2, bonusIntelligence: 2, bonusFaith: 2 },
        { name: "Ranger's Bow", description: "Bow for long-range attacks.", bonusStrength: 1, bonusAgility: 5, bonusIntelligence: 0, bonusFaith: 0 }
    ];
    for (const i of items) {
        const exists = await repo.findOneBy({ name: i.name });
        if (!exists) {
            await repo.save(i);
        }
    }
}

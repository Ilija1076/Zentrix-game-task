"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllItems = getAllItems;
exports.createItem = createItem;
exports.getItemByIdWithSuffix = getItemByIdWithSuffix;
exports.grantItemToCharacter = grantItemToCharacter;
exports.giftItem = giftItem;
const datasource_1 = require("../datasource");
const Item_1 = require("../entity/Item");
const Character_1 = require("../entity/Character");
const characterController_1 = require("./characterController");
async function getAllItems(req, res) {
    const items = await datasource_1.AppDataSource.getRepository(Item_1.Item).find();
    res.json(items);
}
async function createItem(req, res) {
    const repo = datasource_1.AppDataSource.getRepository(Item_1.Item);
    const item = repo.create(req.body);
    await repo.save(item);
    res.status(201).json(item);
}
async function getItemByIdWithSuffix(req, res) {
    const itemRepository = datasource_1.AppDataSource.getRepository(Item_1.Item);
    const item = await itemRepository.findOneBy({ id: Number(req.params.id) });
    if (!item) {
        res.status(404).json({ message: "Item not found" });
        return;
    }
    const bonusStats = [
        { key: "bonusStrength", label: "of Strength" },
        { key: "bonusAgility", label: "of Agility" },
        { key: "bonusIntelligence", label: "of Intelligence" },
        { key: "bonusFaith", label: "of Faith" },
    ];
    let highest = bonusStats[0];
    for (const stat of bonusStats) {
        if ((item[stat.key] || 0) > (item[highest.key] || 0)) {
            highest = stat;
        }
    }
    let displayName = item.name;
    if (item[highest.key] && item[highest.key] > 0) {
        displayName += ` ${highest.label}`;
    }
    res.json({
        ...item,
        displayName: displayName
    });
}
async function grantItemToCharacter(req, res) {
    const { characterId, itemId } = req.body;
    const charRepo = datasource_1.AppDataSource.getRepository(Character_1.Character);
    const itemRepo = datasource_1.AppDataSource.getRepository(Item_1.Item);
    const character = await charRepo.findOne({
        where: { id: characterId },
        relations: ["items"]
    });
    if (!character) {
        res.status(404).json({
            message: "Character not found."
        });
        return;
    }
    const item = await itemRepo.findOneBy({ id: itemId });
    if (!item) {
        res.status(404).json({
            message: "Item not found."
        });
        return;
    }
    character.items.push(item);
    await charRepo.save(character);
    await (0, characterController_1.invalidateCharacterCache)(character.id);
    res.json({ message: "Item granted to the character" });
}
async function giftItem(req, res) {
    const { fromCharacterId, toCharacterId, itemId, random } = req.body;
    const charRepo = datasource_1.AppDataSource.getRepository(Character_1.Character);
    const fromChar = await charRepo.findOne({
        where: { id: fromCharacterId },
        relations: ["items"]
    });
    const toChar = await charRepo.findOne({
        where: { id: toCharacterId },
        relations: ["items"]
    });
    if (!fromChar || !toChar) {
        res.status(404).json({
            message: "Character not found"
        });
        return;
    }
    let itemToGiftId = itemId;
    if (random) {
        if (!fromChar.items || fromChar.items.length === 0) {
            res.status(400).json({ message: "No items to gift" });
            return;
        }
        const randomIdx = Math.floor(Math.random() * fromChar.items.length);
        itemToGiftId = fromChar.items[randomIdx].id;
    }
    const itemIdx = fromChar.items.findIndex(i => i.id == itemToGiftId);
    if (itemIdx === -1) {
        res.status(400).json({ message: "Item not owned by fromCharacter" });
        return;
    }
    const [item] = fromChar.items.splice(itemIdx, 1);
    toChar.items.push(item);
    await charRepo.save([fromChar, toChar]);
    await (0, characterController_1.invalidateCharacterCache)(fromChar.id);
    await (0, characterController_1.invalidateCharacterCache)(toChar.id);
    res.json({ message: "Item gifted between characters" });
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCharacters = getAllCharacters;
exports.getCharacterById = getCharacterById;
exports.invalidateCharacterCache = invalidateCharacterCache;
exports.createCharacter = createCharacter;
const datasource_1 = require("../datasource");
const Character_1 = require("../entity/Character");
const Class_1 = require("../entity/Class");
const redisConf_1 = __importDefault(require("../redisConf"));
const CACHE_TTL = 300;
async function getAllCharacters(req, res) {
    const repo = datasource_1.AppDataSource.getRepository(Character_1.Character);
    const characters = await repo.find();
    const result = characters.map(c => ({
        id: c.id,
        name: c.name,
        class: c.class
    }));
    res.json(result);
}
async function getCharacterById(req, res) {
    const { id } = req.params;
    const charId = parseInt(id);
    const cacheKey = `character:${charId}`;
    const cached = await redisConf_1.default.get(cacheKey);
    if (cached) {
        res.json(JSON.parse(cached));
        return;
    }
    const repo = datasource_1.AppDataSource.getRepository(Character_1.Character);
    const character = await repo.findOne({
        where: { id: charId },
        relations: { items: true, class: true },
    });
    if (!character) {
        res.status(404).json({
            message: "Character not found."
        });
        return;
    }
    if (req.user?.role !== "gamemaster" && character.createdBy !== req.user?.id) {
        res.status(403).json({
            message: "Forbidden access."
        });
        return;
    }
    const stats = {
        strength: (character.baseStrength ?? 0) + (character.items?.reduce((sum, i) => sum + (i.bonusStrength ?? 0), 0) ?? 0),
        agility: (character.baseAgility ?? 0) + (character.items?.reduce((sum, i) => sum + (i.bonusAgility ?? 0), 0) ?? 0),
        intelligence: (character.baseIntelligence ?? 0) + (character.items?.reduce((sum, i) => sum + (i.bonusIntelligence ?? 0), 0) ?? 0),
        faith: (character.baseFaith ?? 0) + (character.items?.reduce((sum, i) => sum + (i.bonusFaith ?? 0), 0) ?? 0),
    };
    const result = {
        ...character,
        stats
    };
    await redisConf_1.default.set(cacheKey, JSON.stringify(result), "EX", CACHE_TTL);
    res.json(result);
}
async function invalidateCharacterCache(charId) {
    const cacheKey = `character:${charId}`;
    await redisConf_1.default.del(cacheKey);
}
async function createCharacter(req, res) {
    const { name, classId, health, mana, baseStrength, baseAgility, baseIntelligence, baseFaith } = req.body;
    if (!name || !classId || !health || !mana) {
        res.status(400).json({
            message: "Missing required fields."
        });
        return;
    }
    const charRepo = datasource_1.AppDataSource.getRepository(Character_1.Character);
    const exists = await charRepo.findOneBy({ name });
    if (exists) {
        res.status(409).json({
            message: "Character name already exists."
        });
        return;
    }
    const classRepo = datasource_1.AppDataSource.getRepository(Class_1.Class);
    const charClass = await classRepo.findOneBy({ id: classId });
    if (!charClass) {
        res.status(400).json({ message: "Invalid classId" });
        return;
    }
    const character = charRepo.create({
        name,
        class: charClass,
        health,
        mana,
        baseStrength,
        baseAgility,
        baseIntelligence,
        baseFaith,
        createdBy: req.user.id,
    });
    await charRepo.save(character);
    await invalidateCharacterCache(character.id);
    res.status(201).json({
        message: "Character has been created", id: character.id
    });
}

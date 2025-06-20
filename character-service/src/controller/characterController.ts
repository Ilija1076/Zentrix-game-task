import { Request, Response } from "express";
import { AppDataSource } from "../datasource";
import { Character } from "../entity/Character";
import { Class } from "../entity/Class";

export async function getAllCharacters(req: Request, res: Response): Promise<void> {
    const repo = AppDataSource.getRepository(Character);
    const characters = await repo.find();
    const result = characters.map(c => ({
        id: c.id,
        name: c.name,
        class: c.class
    }));
    res.json(result);
}

export async function getCharacterById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const repo = AppDataSource.getRepository(Character);

    const character = await repo.findOne({
        where: { id: parseInt(id) },
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
    res.json(character);
}

export async function createCharacter(req: Request, res: Response): Promise<void> {
    const { name, classId, health, mana, baseStrength, baseAgility, baseIntelligence, baseFaith } = req.body;
    if (!name || !classId || !health || !mana) {
        res.status(400).json({
            message: "Missing required fields."
        });
        return;
    }
    const charRepo = AppDataSource.getRepository(Character);
    const exists = await charRepo.findOneBy({ name });
    if (exists) {
        res.status(409).json({
            message: "Character name already exists."
        });
        return;
    }
    const classRepo = AppDataSource.getRepository(Class);
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
        createdBy: req.user!.id,
    });

    await charRepo.save(character);

    res.status(201).json({
        message: "Character has been created", id: character.id
    });
}
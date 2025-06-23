import { Request, Response } from "express";
import { AppDataSource } from "../datasource";
import { Item } from "../entity/Item";
import { Character } from "../entity/Character";
import { invalidateCharacterCache } from "./characterController";

export async function getAllItems(req: Request, res: Response) {
    const items = await AppDataSource.getRepository(Item).find();
    res.json(items);
}

export async function createItem(req: Request, res: Response) {
    const repo = AppDataSource.getRepository(Item);
    const item = repo.create(req.body);
    await repo.save(item);
    res.status(201).json(item);
}

export async function getItemByIdWithSuffix(req: Request, res: Response) {
    const itemRepository = AppDataSource.getRepository(Item);
    const item = await itemRepository.findOneBy({ id: Number(req.params.id) });
    if (!item) {
        res.status(404).json({ message: "Item not found" });
        return;
    }
    type StatKey = "bonusStrength" | "bonusAgility" | "bonusIntelligence" | "bonusFaith";
    const bonusStats: { key: StatKey; label: string }[] = [
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

export async function grantItemToCharacter(req: Request, res: Response) {
    const { characterId, itemId } = req.body;
    const charRepo = AppDataSource.getRepository(Character);
    const itemRepo = AppDataSource.getRepository(Item);

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

    if (character.items.some(i => i.id === itemId)) {
        res.status(409).json({ message: "Character already has this item" });
        return;
    }

    character.items.push(item);
    await charRepo.save(character);
    await invalidateCharacterCache(character.id);
    res.json({ message: "Item granted to the character" });
}

export async function giftItem(req: Request, res: Response) {
    const { fromCharacterId, toCharacterId, itemId, random } = req.body;
    const charRepo = AppDataSource.getRepository(Character);

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
    await invalidateCharacterCache(fromChar.id);
    await invalidateCharacterCache(toChar.id);
    res.json({ message: "Item gifted between characters" });
}
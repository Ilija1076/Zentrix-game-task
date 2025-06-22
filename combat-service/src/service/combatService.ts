import { AppDataSource } from "../datasource";
import { Duel } from "../entity/Duel";
import axios from "axios";

const CHARACTER_SERVICE_URL = process.env.CHARACTER_SERVICE_URL || "http://character-service:3002";

async function fetchCharacter(characterId: number, jwt: string) {
    try {
        const resp = await axios.get(
            `${CHARACTER_SERVICE_URL}/api/character/${characterId}`,
            { headers: { Authorization: `Bearer ${jwt}` } }
        );
        return resp.data;
    } catch (err) {
        return null;
    }
}

async function transferRandomItem(fromCharacterId: number, toCharacterId: number, jwt: string) {
    try {
        await axios.post(
            `${CHARACTER_SERVICE_URL}/api/items/gift`,
            { fromCharacterId, toCharacterId, random: true },
            { headers: { Authorization: `Bearer ${jwt}` } }
        );
    } catch (err) {
    }
}

export async function startDuel(
    challengerId: number,
    opponentId: number,
    userId: number,
    jwt: string
) {
    const challenger = await fetchCharacter(challengerId, jwt);
    if (!challenger) throw { status: 404, message: "Challenger character not found." };
    if (challenger.createdBy !== userId) throw { status: 403, message: "You do not own this character." };
    const opponent = await fetchCharacter(opponentId, jwt);
    if (!opponent) throw { status: 404, message: "Opponent character not found." };

    const duelRepo = AppDataSource.getRepository(Duel);
    const duel = duelRepo.create({
        characterAId: challengerId,
        characterBId: opponentId,
        characterAHealth: challenger.health,
        characterBHealth: opponent.health,
        characterAMana: challenger.mana,
        characterBMana: opponent.mana,
        currentTurnCharId: challengerId,
        isDraw: false,
        winnerId: null,
        endTime: null,
    });
    await duelRepo.save(duel);
    return duel;
}

export async function performAction(
    duelId: number,
    userId: number,
    action: "attack" | "cast" | "heal",
    jwt: string
) {
    const duelRepo = AppDataSource.getRepository(Duel);
    const duel = await duelRepo.findOneBy({ id: duelId });
    if (!duel) throw { status: 404, message: "Duel not found." };

    const charA = await fetchCharacter(duel.characterAId, jwt);
    const charB = await fetchCharacter(duel.characterBId, jwt);
    if (!charA || !charB) throw { status: 404, message: "One or both characters not found." };

    let actorId: number | undefined;
    if (charA.createdBy === userId) actorId = duel.characterAId;
    else if (charB.createdBy === userId) actorId = duel.characterBId;

    if (actorId === undefined) {
        throw { status: 403, message: "You do not control a participant in this duel." };
    }

    if (duel.currentTurnCharId !== actorId) {
        throw { status: 403, message: "Not your turn." };
    }

    const actorChar = actorId === duel.characterAId ? charA : charB;
    const oppChar = actorId === duel.characterAId ? charB : charA;

    let log = "";
    if (action === "attack") {
        const dmg = (actorChar.stats?.strength ?? actorChar.baseStrength ?? 0) +
            (actorChar.stats?.agility ?? actorChar.baseAgility ?? 0);
        if (actorId === duel.characterAId)
            duel.characterBHealth = Math.max(0, duel.characterBHealth - dmg);
        else
            duel.characterAHealth = Math.max(0, duel.characterAHealth - dmg);
        log = `${actorChar.name} attacks for ${dmg} damage.`;
    } else if (action === "cast") {
        const dmg = 2 * ((actorChar.stats?.intelligence ?? actorChar.baseIntelligence ?? 0));
        if (actorId === duel.characterAId)
            duel.characterBHealth = Math.max(0, duel.characterBHealth - dmg);
        else
            duel.characterAHealth = Math.max(0, duel.characterAHealth - dmg);
        log = `${actorChar.name} casts for ${dmg} damage.`;
    } else if (action === "heal") {
        const heal = (actorChar.stats?.faith ?? actorChar.baseFaith ?? 0);
        if (actorId === duel.characterAId)
            duel.characterAHealth += heal;
        else
            duel.characterBHealth += heal;
        log = `${actorChar.name} heals for ${heal}.`;
    }

    if (duel.characterAHealth <= 0 || duel.characterBHealth <= 0) {
        duel.endTime = new Date();
        if (duel.characterAHealth <= 0 && duel.characterBHealth <= 0) {
            duel.isDraw = true;
            log += " It's a draw!";
        } else {
            duel.isDraw = false;
            duel.winnerId = duel.characterAHealth > 0 ? duel.characterAId : duel.characterBId;
            log += ` ${actorChar.name} wins!`;
            const loserId = duel.characterAHealth > 0 ? duel.characterBId : duel.characterAId;
            const winnerId = duel.characterAHealth > 0 ? duel.characterAId : duel.characterBId;
            await transferRandomItem(loserId, winnerId, jwt);
        }
    } else {
        duel.currentTurnCharId = actorId === duel.characterAId ? duel.characterBId : duel.characterAId;
    }

    await duelRepo.save(duel);
    return { duel, log };
}
import { Request, Response } from "express";
import * as combatService from "../service/combatService";

export async function challenge(req: Request, res: Response) {
    const { challengerId, opponentId } = req.body;
    const userId = req.user?.id;
    const jwt = req.headers.authorization?.split(" ")[1];

    if (!challengerId || !opponentId) {
        res.status(400).json({ message: "Missing character IDs." });
        return;
    }

    try {
        const duel = await combatService.startDuel(challengerId, opponentId, userId!, jwt!);
        res.status(201).json({ duelId: duel.id, message: "Duel started." });
    } catch (e: any) {
        res.status(e.status || 400).json({ message: e.message || "Failed to start duel." });
    }
}

async function actionHandler(req: Request, res: Response, action: "attack" | "cast" | "heal") {
    const duelId = Number(req.params.duel_id);
    const userId = req.user?.id;
    const jwt = req.headers.authorization?.split(" ")[1];

    if (!duelId) {
        res.status(400).json({ message: "Missing duel ID." });
        return;
    }

    try {
        const result = await combatService.performAction(duelId, userId!, action, jwt!);
        res.json(result);
    } catch (e: any) {
        res.status(e.status || 400).json({ message: e.message || "Failed to perform action." });
    }
}

export async function attack(req: Request, res: Response) {
    await actionHandler(req, res, "attack");
}
export async function cast(req: Request, res: Response) {
    await actionHandler(req, res, "cast");
}
export async function heal(req: Request, res: Response) {
    await actionHandler(req, res, "heal");
}
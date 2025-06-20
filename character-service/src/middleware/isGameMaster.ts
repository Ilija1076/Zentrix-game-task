import { Request, Response, NextFunction } from "express";

export function isGameMaster(req: Request, res: Response, next: NextFunction): void {
    if (req.user?.role === "gamemaster") {
        next();
        return;
    }
    res.status(403).json({
        message: "You have to be a game master to access."
    });
    return;
}
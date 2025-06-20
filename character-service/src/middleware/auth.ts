import { Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

export interface AuthPayload{
    id: number;
    username: string;
    role: "user" | "gamemaster"
}

declare global {
    namespace Express {
        interface Request{
            user?: AuthPayload;
        }
    }
}


export function authenticateJWT(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) { // add a space after Bearer!
        res.status(401).json({
            message: "Missing or invalid Authorization token."
        });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
        req.user = decoded;
        next();
        return;
    } catch (err) {
        res.status(401).json({ message: "Invalid token." });
        return;
    }
}

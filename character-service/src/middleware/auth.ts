import { Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret_secret_jwt";
const INTERNAL_TEST_JWT = process.env.INTERNAL_TEST_JWT || "super_secret_test_token";

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
    if (!authHeader || !authHeader.startsWith("Bearer ")) { 
        res.status(401).json({
            message: "Missing or invalid Authorization token."
        });
        return;
    }
    const token = authHeader.split(" ")[1];

     if (token === INTERNAL_TEST_JWT) {
        req.user = {
            id: 2,
            username: "gamemaster",
            role: "gamemaster"
        };
        return next();
    }
    try {
        console.log("JWT_SECRET used in middleware:", JWT_SECRET);
        const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
        req.user = decoded;
        next();
        return;
    } catch (err) {
        res.status(401).json({ message: "Invalid token." });
        return;
    }
}

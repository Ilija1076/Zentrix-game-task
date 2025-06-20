import {Request, Response, NextFunction} from "express";

export function isGameMaser(req:Request, res:Response, next:NextFunction){
    if(req.user?.role === "gamemaster"){
        return next();
    }
    return res.status(403).json({
        message: "You have to be a game master to access."
    });
}
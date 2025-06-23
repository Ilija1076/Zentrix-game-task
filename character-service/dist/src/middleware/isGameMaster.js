"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGameMaster = isGameMaster;
function isGameMaster(req, res, next) {
    if (req.user?.role === "gamemaster") {
        next();
        return;
    }
    res.status(403).json({
        message: "You have to be a game master to access."
    });
    return;
}

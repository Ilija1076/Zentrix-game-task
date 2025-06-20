import { Router } from "express";
import { authenticateJWT } from "../middleware/auth";
import { isGameMaster } from "../middleware/isGameMaster";
import * as itemController from "../controller/itemController";


const router = Router();

router.get("/", authenticateJWT, isGameMaster, itemController.getAllItems);
router.post("/", authenticateJWT, isGameMaster, itemController.createItem);
router.get("/:id", authenticateJWT, itemController.getItemByIdWithSuffix);
router.post("/grant", authenticateJWT, isGameMaster, itemController.grantItemToCharacter);
router.post("/gift", authenticateJWT, itemController.giftItem);

export default router;
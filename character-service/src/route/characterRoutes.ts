import {Router} from "express";
import { authenticateJWT } from "../middleware/auth";
import { isGameMaster } from "../middleware/isGameMaster";
import * as characterController from "../controller/characterController";

const router = Router();

router.get("/", authenticateJWT, isGameMaster, characterController.getAllCharacters);
router.get("/:id", authenticateJWT, characterController.getCharacterById);
router.post("/", authenticateJWT, characterController.createCharacter);

export default router;
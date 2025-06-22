import { Router } from "express";
import { authenticateJWT } from "../middleware/auth";
import * as combatController from "../controller/combatController";

const router = Router();

router.use(authenticateJWT);

router.post("/challenge", combatController.challenge);
router.post("/:duel_id/attack", combatController.attack);
router.post("/:duel_id/cast", combatController.cast);
router.post("/:duel_id/heal", combatController.heal);

export default router;
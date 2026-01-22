import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getMytests, submitTest } from "../controllers/test-result.controller.js";

const router = Router()

router.route("/submit").post(verifyJWT,submitTest)
router.route("/getMyTests").post(verifyJWT,getMytests)

export default router
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createQuestion,
  getQuestion,
} from "../controllers/question.controller.js";

const router = Router();

router.route("/").get(verifyJWT, getQuestion).post(verifyJWT, createQuestion);

export default router;

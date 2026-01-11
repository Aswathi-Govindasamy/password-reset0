// src/routes/auth.routes.js
import express from "express";
import {
  forgotPassword,
  verifyToken,
  resetPassword,
} from "../controllers/auth.controller.js";
import { register } from "../controllers/auth.controller.js";
import { login } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/forgot-password", forgotPassword);
router.get("/reset-password/:token", verifyToken);
router.post("/reset-password/:token", resetPassword);
router.post("/login", login);

// src/routes/auth.routes.js



router.post("/register", register);


export default router;

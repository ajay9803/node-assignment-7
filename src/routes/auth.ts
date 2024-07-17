import express from "express";
import { login, refreshAccessToken } from "../controllers/auth";
import { validateReqBody } from "../middlewares/validator";
import { loginUserSchema } from "../schemas/user";

const router = express();

// login route to generate tokens
router.post("/login", validateReqBody(loginUserSchema), login);

// refresh token route - to regenerate access token
router.post("/refresh-access-token", refreshAccessToken);

export default router;

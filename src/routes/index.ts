import express from "express";

import todoRouter from "./todo";
import userRouter from "./user";
import authRouter from "./auth";

// app - router
const router = express();

router.use("/todos", todoRouter);
router.use("/users", userRouter);
router.use("/auth", authRouter);

export default router;

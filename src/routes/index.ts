import { Router } from "express";

import dishesRouter from "./dishes";
import likesRouter from "./likes";
import sessionsRouter from "./sessions";
import usersRouter from "./users";

const router = Router();

router.use("/dishes", dishesRouter);
router.use("/likes", likesRouter);
router.use("/sessions", sessionsRouter);
router.use("/users", usersRouter);

export default router;

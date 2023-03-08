import { Router } from "express";
import usersRouter from "./users";
import sessionsRouter from "./sessions";

const router = Router();

router.use("/users", usersRouter);
router.use("/sessions", sessionsRouter);

export default router;

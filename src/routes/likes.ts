import { Router } from "express";

import LikesController from "../controllers/LikesController";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";

const router = Router();
const likesController = new LikesController();

router.post("/:dishId", ensureAuthenticated, likesController.create);
router.delete("/:dishId", ensureAuthenticated, likesController.delete);

export default router;

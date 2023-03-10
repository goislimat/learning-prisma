import { Router } from "express";

import upload from "../config/upload";
import DishesController from "../controllers/DishesController";
import ensureAuthenticated from "../middleware/ensureAuthenticated";

const router = Router();
const dishesController = new DishesController();

router.get("/", ensureAuthenticated, dishesController.index);
router.get("/:id", ensureAuthenticated, dishesController.show);
router.post(
  "/",
  ensureAuthenticated,
  upload.single("image"),
  dishesController.create
);

export default router;

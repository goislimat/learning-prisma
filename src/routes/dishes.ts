import { Router } from "express";

import upload from "../config/upload";
import DishesController from "../controllers/DishesController";
import ensureAdmin from "../middlewares/ensureAdmin";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";

const router = Router();
const dishesController = new DishesController();

router.get("/", ensureAuthenticated, dishesController.index);
router.get("/:id", ensureAuthenticated, dishesController.show);
router.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  upload.single("image"),
  dishesController.create
);
router.put(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  upload.single("image"),
  dishesController.update
);

export default router;

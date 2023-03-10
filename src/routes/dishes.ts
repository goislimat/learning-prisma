import { Router } from "express";

import upload from "../config/upload";
import DishesController from "../controllers/DishesController";

const router = Router();
const dishesController = new DishesController();

router.get("/", dishesController.index);
router.post("/", upload.single("image"), dishesController.create);

export default router;

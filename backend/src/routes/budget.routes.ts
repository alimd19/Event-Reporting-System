import { Router } from "express";
import {
  fetchBudget,
  fetchBudgetById,
  editBudget,
} from "../controllers/budget.controllers";

const router = Router();

router.get("/", fetchBudget);

router.get("/:id", fetchBudgetById);

router.patch("/:id", editBudget);

export default router;

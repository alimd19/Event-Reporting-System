import { Router } from "express";
import * as programControllers from "../controllers/programs.controllers";
const router = Router();

router.get("/", programControllers.fetchAllPrograms);

router.get("/:id", programControllers.fetchProgramById);

router.post("/", programControllers.addProgram);

router.patch("/:id", programControllers.editProgramById);

router.delete("/:id", programControllers.deleteProgramById);

export default router;

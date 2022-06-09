import { Router } from "express";
import * as youthMemberControllers from "../controllers/youth-members.controllers";

const router = Router();

router.get("/", youthMemberControllers.fetchAllYouthMembers);

router.get("/:id", youthMemberControllers.fetchYouthMemberById);

router.patch("/:id", youthMemberControllers.editYouthMember);

router.delete("/:id", youthMemberControllers.deleteYouthMember);

export default router;

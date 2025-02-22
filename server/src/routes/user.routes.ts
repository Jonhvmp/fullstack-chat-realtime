import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();

router.get('/', AuthController.getUsers);
router.get('/find/:id', AuthController.getUserById);

export default router;

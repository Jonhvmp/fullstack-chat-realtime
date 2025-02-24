import { Router } from "express";
import { MessageController } from "@/controllers/message.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = Router();

router.post('/', authMiddleware, MessageController.createMessage);
router.get('/:chatId', authMiddleware, MessageController.getMessages);

export default router;

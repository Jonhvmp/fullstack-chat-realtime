import { Router } from "express";
import { ChatController } from "@/controllers/chat.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = Router();

router.post('/', authMiddleware, ChatController.createChat);
router.get('/users/:userId', authMiddleware, ChatController.getUserChats);
router.get('/:chatId', authMiddleware, ChatController.findChat);

export default router;

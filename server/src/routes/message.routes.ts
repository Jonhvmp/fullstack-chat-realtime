import { Router } from "express";
import { MessageController } from "@/controllers/message.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: API de gerenciamento de mensagens
 */

/**
 * @swagger
 * /message:
 *   post:
 *     summary: Cria uma nova mensagem
 *     tags: [Messages]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chat:
 *                 type: string
 *               sender:
 *                 type: string
 *               content:
 *                 type: string
 */
router.post('/', authMiddleware, MessageController.createMessage);

/**
 * @swagger
 * /message/{chatId}:
 *   get:
 *     summary: Busca mensagens de um chat
 *     tags: [Messages]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/:chatId', authMiddleware, MessageController.getMessages);

/**
 * @swagger
 * /message/{chatId}/read:
 *   post:
 *     summary: Marca mensagens como lidas
 *     tags: [Messages]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 */
router.post('/:chatId/read', authMiddleware, MessageController.markAsRead);

/**
 * @swagger
 * /message/{chatId}/unread/{userId}:
 *   get:
 *     summary: Retorna o número de mensagens não lidas
 *     tags: [Messages]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Número de mensagens não lidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: number
 */
router.get('/:chatId/unread/:userId', authMiddleware, MessageController.getUnreadCount);

export default router;

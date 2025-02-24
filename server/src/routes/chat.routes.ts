import { Router } from "express";
import { ChatController } from "@/controllers/chat.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Endpoints para gerenciamento de chats
 */

/**
 * @swagger
 * /chat:
 *   post:
 *     summary: Criar um novo chat
 *     description: Cria uma nova conversa entre dois usuários
 *     tags: [Chat]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstId
 *               - secondId
 *             properties:
 *               firstId:
 *                 type: string
 *                 description: ID do primeiro usuário
 *               secondId:
 *                 type: string
 *                 description: ID do segundo usuário
 *           example:
 *             firstId: "640ac1..."
 *             secondId: "640ac2..."
 *     responses:
 *       201:
 *         description: Chat criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 members:
 *                   type: array
 *                   items:
 *                     type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Erro na criação do chat
 *       401:
 *         description: Não autorizado
 */
router.post('/', authMiddleware, ChatController.createChat);

/**
 * @swagger
 * /chat/users/{userId}:
 *   get:
 *     summary: Buscar chats do usuário
 *     description: Retorna todos os chats em que o usuário participa
 *     tags: [Chat]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Lista de chats do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   members:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Nenhum chat encontrado
 */
router.get('/users/:userId', authMiddleware, ChatController.getUserChats);

/**
 * @swagger
 * /chat/{chatId}:
 *   get:
 *     summary: Buscar chat específico
 *     description: Retorna os detalhes de um chat específico
 *     tags: [Chat]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do chat
 *     responses:
 *       200:
 *         description: Detalhes do chat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 members:
 *                   type: array
 *                   items:
 *                     type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Chat não encontrado
 */
router.get('/:chatId', authMiddleware, ChatController.findChat);

export default router;

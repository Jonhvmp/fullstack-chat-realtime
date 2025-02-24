import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints de usuários
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Retorna todos os usuários
 *     description: Busca e retorna todos os usuários do sistema.
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []  # Se exigir autenticação via cookie
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       roles:
 *                         type: array
 *                         items:
 *                           type: string
 *                       isActive:
 *                         type: boolean
 *             examples:
 *               ExemploSucesso:
 *                 value:
 *                   users:
 *                     - _id: "640ac1..."
 *                       name: "Jonh"
 *                       email: "Jonh@example.com"
 *                       roles: ["user"]
 *                       isActive: true
 *                     - _id: "640ac2..."
 *                       name: "Alex"
 *                       email: "Alex@example.com"
 *                       roles: ["admin"]
 *                       isActive: true
 *       401:
 *         description: Token inválido ou expirado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               Erro401:
 *                 value:
 *                   message: "Token Inválido"
 */
router.get('/', authMiddleware, AuthController.getUsers);

/**
 * @swagger
 * /user/find/{id}:
 *   get:
 *     summary: Retorna um usuário específico pelo ID
 *     description: Busca e retorna um único usuário com base no seu ID.
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []  # Se exigir autenticação via cookie
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário no MongoDB
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: string
 *                     isActive:
 *                       type: boolean
 *             examples:
 *               ExemploSucesso:
 *                 value:
 *                   user:
 *                     _id: "640ac1..."
 *                     name: "Jonh Alex"
 *                     email: "Jonh@example.com"
 *                     roles: ["user"]
 *                     isActive: true
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               Erro404:
 *                 value:
 *                   message: "Usuário não encontrado!"
 *       401:
 *         description: Token inválido ou expirado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               Erro401:
 *                 value:
 *                   message: "Token Inválido"
 */
router.get('/find/:id', authMiddleware, AuthController.getUserById);

router.post('/list', authMiddleware, AuthController.getManyUsers);

export default router;

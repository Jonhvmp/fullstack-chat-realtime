import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import passport from 'passport';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticação
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar um novo usuário
 *     description: Cria um novo usuário no sistema e retorna um token de sessão via cookie.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do usuário
 *               email:
 *                 type: string
 *                 format: email
 *                 description: E-mail do usuário
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Senha do usuário (mín. 6 caracteres)
 *           examples:
 *             ExemploRequisicao:
 *               summary: Exemplo de corpo de requisição
 *               value:
 *                 name: "Jonh Alex"
 *                 email: "Jonh@example.com"
 *                 password: "123456"
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
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
 *               ExemploResposta:
 *                 summary: Exemplo de retorno bem-sucedido
 *                 value:
 *                   user:
 *                     _id: "640ac1..."
 *                     name: "Jonh Alex"
 *                     email: "Jonh@example.com"
 *                     roles: ["user"]
 *                     isActive: true
 *       400:
 *         description: Erro na requisição (e.g., e-mail já cadastrado, senha muito curta)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               ExemploErro:
 *                 value:
 *                   message: "Email já cadastrado! Faça login."
 */
router.post('/register', AuthController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Realizar login
 *     description: Autentica o usuário e retorna um token de sessão via cookie.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *           examples:
 *             ExemploRequisicao:
 *               summary: Exemplo de corpo de requisição
 *               value:
 *                 email: "Jonh@example.com"
 *                 password: "123456"
 *     responses:
 *       200:
 *         description: Login bem-sucedido
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
 *               ExemploResposta:
 *                 value:
 *                   user:
 *                     _id: "640ac1..."
 *                     name: "Jonh Alex"
 *                     email: "Jonh@example.com"
 *                     roles: ["user"]
 *                     isActive: true
 *       401:
 *         description: Credenciais inválidas (e.g., usuário inexistente ou senha incorreta)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               ExemploErro:
 *                 value:
 *                   message: "Credenciais inválidas!"
 */
router.post('/login', AuthController.login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout
 *     description: Limpa o cookie de autenticação do usuário.
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Sucesso ao sair da conta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               ExemploSucesso:
 *                 value:
 *                   message: "Sucesso ao sair da conta."
 *       401:
 *         description: Usuário não autenticado ou token inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               ExemploErro:
 *                 value:
 *                   message: "Autenticação necessária"
 */
router.post('/logout', authMiddleware, AuthController.logout);

/**
 * @swagger
 * /api/auth/github:
 *   get:
 *     summary: Iniciar OAuth com GitHub
 *     description: Redireciona o usuário para a página de login do GitHub.
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redireciona para o login do GitHub
 *         headers:
 *           Location:
 *             description: URL de login do GitHub
 *             schema:
 *               type: string
 */
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

/**
 * @swagger
 * /api/auth/github/callback:
 *   get:
 *     summary: Callback do OAuth com GitHub
 *     description: Recebe o callback do GitHub após a autenticação e gera um token de sessão via cookie.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Login com GitHub bem-sucedido
 *       401:
 *         description: Falha na autenticação
 *       302:
 *         description: Redireciona para o frontend em caso de sucesso ou erro
 */
router.get(
  '/github/callback',
  passport.authenticate('github', { session: false }),
  AuthController.githubCallback
);

/**
 * @swagger
 * /api/auth/validate-token:
 *   get:
 *     summary: Validar token do usuário
 *     description: Verifica se o token de sessão (cookie) ainda é válido.
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Token válido
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
 *                 summary: Exemplo de resposta
 *                 value:
 *                   user:
 *                     _id: "640ac1..."
 *                     name: "Jonh Alex"
 *                     email: "jonh@example.com"
 *                     roles: ["user"]
 *                     isActive: true
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
 *               ExemploErro:
 *                 value:
 *                   message: "Token Inválido"
 */
router.get('/validate-token', authMiddleware, AuthController.validateToken);

export default router;

import express, { Request, Response, NextFunction } from 'express';
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
import { errorMiddleware } from './middlewares/error.middleware';
import { connectDB } from './config/database'
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import './config/passport';
import AuthRoutes from './routes/auth.routes';
import UserRoutes from './routes/user.routes';
import ChatRoutes from './routes/chat.routes';
import MessageRoutes from './routes/message.routes';

const app = express();

const CORS_ALLOW = process.env.CORS_ORIGIN || '';
const URL_DOCS_API = process.env.BASE_URL || '';

// Conexão com o banco de dados - MongoDb
connectDB();

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || '',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(passport.initialize());

// Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Chat RealTime API',
      version: '1.0.0',
      description: 'Documentação da API backend - Jonh Alex',
    },
    servers: [
      {
        url: URL_DOCS_API,
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'auth_token',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rota inicial
app.get('/', (req: Request, res: Response): void => {
  res.json({ message: 'API rodando...' });
});

// Rotas
app.use('/api/auth', AuthRoutes);
app.use('/user', UserRoutes);
app.use('/chat', ChatRoutes);
app.use('/message', MessageRoutes);

// Rota inexistente
app.use((req: Request, res: Response, next: NextFunction): void => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

app.use(errorMiddleware);

export default app;

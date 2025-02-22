import express, { Request, Response, NextFunction } from 'express';
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

const app = express();

// Conexão com o banco de dados - MongoDb
connectDB();

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use(passport.initialize());


// passando tipagem na rota ('/)
app.get('/', (req: Request, res: Response): void => {
  res.json({ message: 'API rodando...' });
});

// Rotas
app.use('/api/auth', AuthRoutes);
app.use('/user', UserRoutes);

// Passando uma mensagem dinâmica para o middleware de erro
app.use((req: Request, res: Response, next: NextFunction): void => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

app.use(errorMiddleware);

export default app;

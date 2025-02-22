import app from './app';
import dotenv from 'dotenv';
import './@Types';

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} é inválida`);
    process.exit(1);
  } else {
    throw err;
  }
});

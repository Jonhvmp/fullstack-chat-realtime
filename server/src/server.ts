import app from './app';
import dotenv from 'dotenv';
import './@Types';
import http from 'http';
import { SocketService } from './services/socket.service';

dotenv.config();

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Inicializar Socket.IO
SocketService.initialize(server);

server.listen(PORT, () => {
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

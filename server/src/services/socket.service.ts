import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { SocketEvents } from '../sockets/events';
import { ConnectionManager } from '../sockets/connection.manager';
import { ChatHandler } from '../sockets/handlers/chat.handler';

export class SocketService {
  private static io: Server;
  private static connectionManager: ConnectionManager = ConnectionManager.getInstance();

  static initialize(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CORS_ORIGIN || '',
        methods: ['GET', 'POST'],
        credentials: true
      },
      pingTimeout: 60000,
      pingInterval: 25000
    });

    this.io.on(SocketEvents.CONNECT, (socket) => {
      console.log('Novo cliente conectado:', socket.id);

      const chatHandler = new ChatHandler(socket);

      socket.on(SocketEvents.SETUP, (userId: string) => {
        this.connectionManager.addConnection(userId, socket.id);
        socket.join(userId);
        socket.emit(SocketEvents.ONLINE);
      });

      socket.on(SocketEvents.JOIN_CHAT, (chatId: string) => {
        socket.join(chatId);
        console.log('Usuário entrou no chat:', chatId);
      });

      socket.on(SocketEvents.TYPING, chatHandler.handleTyping.bind(chatHandler));
      socket.on(SocketEvents.STOP_TYPING, chatHandler.handleStopTyping.bind(chatHandler));
      socket.on(SocketEvents.MESSAGE_READ, chatHandler.handleReadMessage.bind(chatHandler));

      socket.on(SocketEvents.DISCONNECT, () => {
        console.log('Cliente desconectado:', socket.id);
        this.connectionManager.removeConnection(socket.id);
      });
    });
  }

  static emitNewMessage(chatId: string, message: any) {
    this.io.to(chatId).emit(SocketEvents.NEW_MESSAGE, message);
  }

  static emitMessageRead(chatId: string, messageId: string, userId: string) {
    this.io.to(chatId).emit(SocketEvents.MESSAGE_READ, { messageId, userId });
  }

  static emitNotification(userId: string, notification: any) {
    this.io.to(userId).emit(SocketEvents.NOTIFICATION, notification);
  }

  static isUserOnline(userId: string): boolean {
    return this.connectionManager.isUserOnline(userId);
  }

  static getIO(): Server {
    if (!this.io) {
      throw new Error('Socket.io não foi inicializado');
    }
    return this.io;
  }
}

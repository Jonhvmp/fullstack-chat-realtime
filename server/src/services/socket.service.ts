import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';
import { ChatService } from './chat.service';

interface ISendMessageData {
  chatId: string;
  senderId: string;
  content: string;
}

export class SocketService {
  private static io: Server;
  // Mapeia os usuários online: userId => array de socket ids
  private static onlineUsers: { [userId: string]: string[] } = {};

  /**
   * Inicializa o Socket.IO no servidor HTTP
   */
  public static initialize(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: '*', // Ajuste conforme necessário para CORS
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      }
    });

    // Lida com as conexões de clientes
    this.io.on('connection', (socket: Socket) => {
      // console.log(`Novo cliente conectado: ${socket.id}`);

      /**
       * Evento para definir o usuário conectado (ex.: socket.emit('setUser', userId)).
       * O usuário entra em uma "sala" cujo nome é seu próprio userId,
       * para receber eventos diretos, como chatUpdated.
       */
      socket.on('setUser', (userId: string) => {
        socket.data.userId = userId;

        // Usuário entra na sala com nome = userId
        socket.join(userId);

        if (!SocketService.onlineUsers[userId]) {
          SocketService.onlineUsers[userId] = [];
        }
        SocketService.onlineUsers[userId].push(socket.id);

        // console.log(`Usuário ${userId} conectado com socket ${socket.id}`);

        // Emite a lista atualizada de usuários online para todos os clientes
        SocketService.io.emit('onlineUsers', Object.keys(SocketService.onlineUsers));
      });

      /**
       * Evento para entrar em uma sala de chat (ex.: socket.emit('joinChat', chatId)).
       */
      socket.on('joinChat', (chatId: string) => {
        socket.join(chatId);
        // console.log(`Socket ${socket.id} entrou na sala do chat ${chatId}`);
      });

      /**
       * Evento para envio de mensagem (ex.: socket.emit('sendMessage', { chatId, senderId, content })).
       */
      socket.on('sendMessage', async (data: ISendMessageData) => {
        try {
          // Cria a mensagem no banco
          const newMessage = await MessageService.createMessage({
            chat: data.chatId,
            sender: data.senderId,
            content: data.content
          });
          await newMessage.populate('sender', 'name email');

          // Emite o evento de mensagem para a sala do chat (para o ChatBox, etc.)
          this.io.to(data.chatId).emit('messageReceived', newMessage);

          // Emite um evento global (chatUpdated) para cada membro do chat atualizar a sidebar ou notificações
          const chat = await ChatService.findChat(data.chatId);
          if (chat) {
            // chat.members contém os userIds
            chat.members.forEach((memberId: any) => {
              // Envia o evento direto para a sala do userId
              this.io.to(memberId.toString()).emit('chatUpdated', {
                chatId: data.chatId,
                lastMessage: newMessage.content
              });
            });
          }
        } catch (error) {
          console.error('Erro ao enviar mensagem via socket:', error);
        }
      });

      /**
       * Eventos de digitação
       */
      socket.on('typing', ({ chatId, userId }) => {
        // console.log(`[Server] Usuário ${userId} está digitando no chat ${chatId}`);
        socket.to(chatId).emit('userTyping', { userId, chatId });
      });

      socket.on('stopTyping', ({ chatId, userId }) => {
        // console.log(`[Server] Usuário ${userId} parou de digitar no chat ${chatId}`);
        socket.to(chatId).emit('userStoppedTyping', { userId, chatId });
      });

      /**
       * Evento de desconexão.
       * Ao desconectar, remove o socket da lista de usuários online.
       */
      socket.on('disconnect', () => {
        // console.log(`Cliente desconectado: ${socket.id}`);
        const userId = socket.data.userId;

        if (userId && SocketService.onlineUsers[userId]) {
          // Remove o socket desconectado da lista
          SocketService.onlineUsers[userId] = SocketService.onlineUsers[userId].filter(
            (id) => id !== socket.id
          );

          // Se não houver mais conexões para esse usuário, remove-o da lista
          if (SocketService.onlineUsers[userId].length === 0) {
            delete SocketService.onlineUsers[userId];
          }

          // Emite a lista atualizada de usuários online para todos os clientes
          SocketService.io.emit('onlineUsers', Object.keys(SocketService.onlineUsers));
        }
      });
    });
  }

  /**
   * Retorna a instância do io (caso seja necessário emitir eventos em outros lugares, ex.: Controllers).
   */
  public static getIO(): Server {
    return this.io;
  }
}

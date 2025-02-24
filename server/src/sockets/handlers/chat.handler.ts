import { Socket } from 'socket.io';
import { SocketEvents, ChatPayload, MessagePayload, TypingPayload } from '../events';
import { ConnectionManager } from '../connection.manager';

export class ChatHandler {
  private socket: Socket;
  private connectionManager: ConnectionManager;

  constructor(socket: Socket) {
    this.socket = socket;
    this.connectionManager = ConnectionManager.getInstance();
  }

  handleTyping(payload: TypingPayload) {
    if (!payload.chatId || !payload.userId) {
      throw new Error('Digite um payload válido');
    }

    this.socket.to(payload.chatId).emit(SocketEvents.TYPING, {
      chatId: payload.chatId,
      userId: payload.userId
    });
  }

  handleStopTyping(payload: TypingPayload) {
    if (!payload.chatId || !payload.userId) {
      throw new Error('Digite um payload válido');
    }

    this.socket.to(payload.chatId).emit(SocketEvents.STOP_TYPING, {
      chatId: payload.chatId,
      userId: payload.userId
    });
  }

  handleReadMessage(payload: MessagePayload) {
    if (!payload.chatId || !payload.userId) {
      throw new Error('Inválido payload de mensagem');
    }

    this.socket.to(payload.chatId).emit(SocketEvents.MESSAGE_READ, payload);
  }

  handleMessage(payload: MessagePayload) {
    if (!payload.chatId || !payload.message || !payload.userId) {
      throw new Error('Inválido payload de mensagem');
    }

    this.socket.to(payload.chatId).emit(SocketEvents.MESSAGE, {
      chatId: payload.chatId,
      message: payload.message,
      userId: payload.userId,
      timestamp: payload.timestamp || new Date().toISOString()
    });
  }

  handleJoinChat(payload: ChatPayload) {
    if (!payload.chatId || !payload.userId) {
      throw new Error('Inválido payload de chat');
    }

    this.socket.join(payload.chatId);
    this.socket.to(payload.chatId).emit(SocketEvents.USER_JOINED_CHAT, {
      chatId: payload.chatId,
      userId: payload.userId
    });
  }

  handleLeaveChat(payload: ChatPayload) {
    if (!payload.chatId || !payload.userId) {
      throw new Error('Inválido payload de chat');
    }

    this.socket.leave(payload.chatId);
    this.socket.to(payload.chatId).emit(SocketEvents.USER_LEFT_CHAT, {
      chatId: payload.chatId,
      userId: payload.userId
    });
  }
}

import { Message } from '../models/message.model';
import mongoose from 'mongoose';
import { SocketService } from './socket.service';

export interface IMessageInput {
  chat: string;
  sender: string;
  content: string;
}

export class MessageService {
  static async createMessage(messageData: IMessageInput) {
    const { chat, sender, content } = messageData;
    if (!chat || !sender || !content) {
      const error = new Error('Os campos chat, sender e content são obrigatórios.');
      (error as any).status = 400;
      throw error;
    }

    const newMessage = new Message(messageData);
    const savedMessage = await newMessage.save();
    await savedMessage.populate('sender', 'name email');

    // Emitir evento de nova mensagem
    SocketService.emitNewMessage(messageData.chat, savedMessage);

    return savedMessage;
  }

  static async getMessagesByChatId(chatId: string) {
    if (!chatId) {
      const error = new Error('O parâmetro chatId é obrigatório.');
      (error as any).status = 400;
      throw error;
    }

    return await Message.find({ chat: chatId })
      .populate('sender', 'name email')
      .sort({ createdAt: 1 });
  }

  static async markMessagesAsRead(chatId: string, userId: string) {
    const result = await Message.updateMany(
      {
        chat: chatId,
        readBy: { $ne: userId }
      },
      {
        $addToSet: { readBy: userId }
      }
    );

    if (result.modifiedCount > 0) {
      SocketService.emitMessageRead(chatId, '', userId);
    }

    return result;
  }

  static async getUnreadCount(chatId: string, userId: string) {
    return await Message.countDocuments({
      chat: chatId,
      sender: { $ne: userId },
      readBy: { $ne: userId }
    });
  }
}

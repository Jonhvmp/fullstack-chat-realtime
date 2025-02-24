import { Message } from '../models/message.model';

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
    return await newMessage.save();
  }

  static async getMessagesByChatId(chatId: string) {
    if (!chatId) {
      const error = new Error('O parâmetro chatId é obrigatório.');
      (error as any).status = 400;
      throw error;
    }

    return await Message.find({ chat: chatId }).sort({ createdAt: 1 });
  }
}

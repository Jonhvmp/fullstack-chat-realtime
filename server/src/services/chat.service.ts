import { Chat } from '../models/chat.model';

export class ChatService {
  static async createChat(firstId: string, secondId: string) {
    // Verifica se já existe um chat com esses 2 membros
    const existingChat = await Chat.findOne({
      $and: [
        { members: { $all: [firstId, secondId] } },
        { members: { $size: 2 } }
      ]
    });

    // Se existir, retorna
    if (existingChat) {
      return existingChat;
    }

    // Se não existir, cria
    const newChat = new Chat({ members: [firstId, secondId] });
    await newChat.save();
    return newChat;
  }

  static async getUserChats(userId: string) {
    if (!userId) {
      throw new Error('O parâmetro userId é obrigatório.');
    }

    const chats = await Chat.find({ members: userId })
       .populate('members', 'name email')
      .sort({ updatedAt: -1 });
    return chats;
  }

  static async findChat(chatId: string) {
    if (!chatId) {
      throw new Error('O parâmetro chatId é obrigatório.');
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      throw new Error('Chat não encontrado.');
    }

    return chat;
  }
}

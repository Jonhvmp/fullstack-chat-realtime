import { Request, Response } from 'express';
import { ChatService } from '../services/chat.service';

export class ChatController {
  static async createChat(req: Request, res: Response) {
    try {
      const { firstId, secondId } = req.body;
      const chat = await ChatService.createChat(firstId, secondId);
      res.status(201).json(chat);
    } catch (error: any) {
      console.error('Erro ao criar o chat:', error);
      res.status(400).json({ message: error.message });
    }
  }

  static async getUserChats(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const chats = await ChatService.getUserChats(userId);
      res.status(200).json(chats);
    } catch (error: any) {
      console.error('Erro ao buscar os chats do usuário:', error);
      res.status(404).json({ message: error.message });
    }
  }

  static async findChat(req: Request, res: Response) {
    try {
      const { chatId } = req.params;
      const chat = await ChatService.findChat(chatId);
      res.status(200).json(chat);
    } catch (error: any) {
      console.error('Erro ao buscar o chat:', error);
      res.status(404).json({ message: error.message });
    }
  }
}

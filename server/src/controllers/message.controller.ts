import { Request, Response } from 'express';
import { MessageService } from '../services/message.service';

export class MessageController {
  static async createMessage(req: Request, res: Response): Promise<void> {
    try {
      const message = await MessageService.createMessage(req.body);
      await message.populate('sender', 'name email');
      res.status(201).json(message);
    } catch (error: any) {
      console.error('Erro ao criar a mensagem:', error);
      res.status(error.status || 500).json({ message: error.message });
    }
  }

  static async getMessages(req: Request, res: Response): Promise<void> {
    try {
      const { chatId } = req.params;
      const messages = await MessageService.getMessagesByChatId(chatId);
      res.status(200).json(messages);
    } catch (error: any) {
      console.error('Erro ao buscar as mensagens:', error);
      res.status(error.status || 500).json({ message: error.message });
    }
  }

  static async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { chatId } = req.params;
      const userId = req.body.userId;
      await MessageService.markMessagesAsRead(chatId, userId);
      res.status(200).json({ message: 'Mensagens marcadas como lidas' });
    } catch (error: any) {
      console.error('Erro ao marcar mensagens como lidas:', error);
      res.status(error.status || 500).json({ message: error.message });
    }
  }

  static async getUnreadCount(req: Request, res: Response): Promise<void> {
    try {
      const { chatId, userId } = req.params;
      const count = await MessageService.getUnreadCount(chatId, userId);
      res.status(200).json({ count });
    } catch (error: any) {
      console.error('Erro ao buscar contagem de mensagens não lidas:', error);
      res.status(error.status || 500).json({ message: error.message });
    }
  }
}

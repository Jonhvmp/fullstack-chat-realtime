import { Request, Response } from 'express';
import { MessageService } from '../services/message.service';

export class MessageController {
  static async createMessage(req: Request, res: Response): Promise<void> {
    try {
      const message = await MessageService.createMessage(req.body);
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
}

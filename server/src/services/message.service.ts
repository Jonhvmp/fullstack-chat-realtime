import { Message } from '../models/message.model';

export class MessageService {
  static async createMessage(data: any) {
    const newMessage = await Message.create({
      chat: data.chat,
      sender: data.sender,
      content: data.content,
      readBy: [data.sender],
    });
    return newMessage;
  }


  static async getMessagesByChatId(chatId: string) {
    return await Message.find({ chat: chatId }).populate('sender', 'name email');
  }

  static async markMessagesAsRead(chatId: string, userId: string) {
    return await Message.updateMany(
      {
        chat: chatId,
        readBy: { $ne: userId }
      },
      {
        $push: { readBy: userId }
      }
    );
  }

  static async getUnreadCount(chatId: string, userId: string) {
    return await Message.countDocuments({
      chat: chatId,
      readBy: { $ne: userId }
    });
  }
}

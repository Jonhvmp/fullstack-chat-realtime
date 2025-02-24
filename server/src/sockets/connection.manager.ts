import { Socket } from 'socket.io';

export class ConnectionManager {
  private static instance: ConnectionManager;
  private userSockets: Map<string, Set<string>> = new Map();
  private socketUser: Map<string, string> = new Map();

  private constructor() {}

  static getInstance(): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager();
    }
    return ConnectionManager.instance;
  }

  addConnection(userId: string, socketId: string) {
    if (!userId || !socketId) {
      throw new Error('UserId e socketId são obrigatórios');
    }

    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    const userSockets = this.userSockets.get(userId);
    if (userSockets) {
      userSockets.add(socketId);
      this.socketUser.set(socketId, userId);
    }
  }

  removeConnection(socketId: string) {
    if (!socketId) return;

    const userId = this.socketUser.get(socketId);
    if (!userId) return;

    const userSockets = this.userSockets.get(userId);
    if (userSockets) {
      userSockets.delete(socketId);
      if (userSockets.size === 0) {
        this.userSockets.delete(userId);
      }
    }
    this.socketUser.delete(socketId);
  }

  isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId) && this.userSockets.get(userId)!.size > 0;
  }

  getUserSockets(userId: string): string[] {
    return Array.from(this.userSockets.get(userId) || []);
  }

  getAllOnlineUsers(): string[] {
    return Array.from(this.userSockets.keys());
  }
}

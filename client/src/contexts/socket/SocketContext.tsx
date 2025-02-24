// src/contexts/socket/SocketContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || '';

interface ISocketContext {
  socket: Socket | null;
}

const SocketContext = createContext<ISocketContext>({ socket: null });

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  userId?: string;
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ userId, children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketIo = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    setSocket(socketIo);

    socketIo.on('connect', () => {
      console.log('Socket conectado:', socketIo.id);
      if (userId) {
        socketIo.emit('setUser', userId);
      }
    });

    return () => {
      socketIo.disconnect();
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

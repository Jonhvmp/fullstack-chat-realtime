// src/contexts/socket/SocketContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
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
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    const socketIo = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
      timeout: 10000
    });

    socketIo.on('connect', () => {
      // console.log('Socket conectado:', socketIo.id);
      reconnectAttempts.current = 0;
      if (userId) {
        socketIo.emit('setUser', userId);
      }
    });

    socketIo.on('connect_error', (error) => {
      console.error('Erro de conexão:', error);
      reconnectAttempts.current++;

      if (reconnectAttempts.current >= maxReconnectAttempts) {
        console.error('Máximo de tentativas de reconexão atingido');
        socketIo.disconnect();
      }
    });

    setSocket(socketIo);

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

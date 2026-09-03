import type { Server as HttpServer } from "http";
import { Server } from "socket.io";

let io: Server | null = null;

export const initializeSocket = (httpServer: HttpServer): Server => {
  if (io) {
    return io;
  }

  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL?.split(",") ?? "*",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized.");
  }

  return io;
};

export const socket = {
  emit(event: string, data?: unknown): void {
    getIO().emit(event, data);
  },

  to(target: string, event: string, data?: unknown): void {
    getIO().to(target).emit(event, data);
  },
};

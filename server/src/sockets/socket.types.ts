import type { Server, Socket } from "socket.io";

export interface SocketUser {
  id: string;
  email?: string;
  role?: string;
}

export interface SocketData {
  user?: SocketUser;
}

export interface ClientToServerEvents {
  "room:join": (room: string) => void;
  "room:leave": (room: string) => void;
  "notification:read": (notificationId: string) => void;
}

export interface ServerToClientEvents {
  connected: (data: { socketId: string; userId?: string }) => void;

  "notification:new": (data: unknown) => void;

  "room:joined": (data: { room: string }) => void;

  "room:left": (data: { room: string }) => void;

  error: (data: { message: string }) => void;
}

export type SocketServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  Record<string, never>,
  SocketData
>;

export type SocketConnection = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  Record<string, never>,
  SocketData
>;

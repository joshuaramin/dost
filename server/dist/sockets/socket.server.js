"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socket = exports.getIO = exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
let io = null;
const initializeSocket = (httpServer) => {
    if (io) {
        return io;
    }
    io = new socket_io_1.Server(httpServer, {
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
exports.initializeSocket = initializeSocket;
const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO has not been initialized.");
    }
    return io;
};
exports.getIO = getIO;
exports.socket = {
    emit(event, data) {
        (0, exports.getIO)().emit(event, data);
    },
    to(target, event, data) {
        (0, exports.getIO)().to(target).emit(event, data);
    },
};

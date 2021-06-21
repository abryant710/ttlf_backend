import * as io from 'socket.io';

let socketio;

export default {
  init: (httpServer) => {
    socketio = new io.Server(httpServer, {
      cors: {
        origin: 'http://localhost:3000/',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });
    return socketio;
  },
  getIO: () => {
    if (!socketio) {
      throw new Error('Socket io not initialised');
    }
    return socketio;
  },
};

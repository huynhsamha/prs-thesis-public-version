const SocketIO = require('socket.io');
const msg = require('../config/socket.message');
const sessionService = require('../services/session.service');

const io = SocketIO(8001).of('/session');

function init() {
  io.on('connection', (socket) => {

    // allow socket listen message join session
    socket.on(msg.joinSession, async (payload) => {
      if (!payload) return;
      const { sessionId } = payload;
      if (!sessionId) return;
      try {
        const session = await sessionService.Instance.queryDBById(sessionId);
        if (!session) return;

        // join socket to room sessionId
        socket.join(sessionId);
        socket.emit(msg.ackJoinSessionSuccess, 'OK');

      } catch (e) {
        console.log(e);
      }
    });

  });
}

function sendData(sessionId, message, data) {
  const sockets = io.in(sessionId).sockets;
  if (!sockets) {
    console.log('Sockets is null');
    return;
  }
  Object.keys(sockets).forEach((sid) => {
    const socket = sockets[sid];
    if (!socket) {
      console.log(`Socket ${sid} is null`);
    } else {
      socket.emit(message, data);
    }
  });
}

module.exports = {
  init,
  sendData,
  msg
};

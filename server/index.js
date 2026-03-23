import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('Socket.IO notification server running');
});

io.on('connection', (socket) => {
  console.log('client connected', socket.id);

  // send a welcome notification
  socket.emit('notification', {
    id: Date.now(),
    title: 'Welcome',
    message: 'Real-time notifications are enabled for this demo.',
    time: new Date().toISOString()
  });

  socket.on('disconnect', () => {
    console.log('client disconnected', socket.id);
  });
});

// Periodically broadcast demo notifications (every 20s)
setInterval(() => {
  const payload = {
    id: Date.now(),
    title: 'Demo Alert',
    message: 'This is a periodic demo notification.',
    time: new Date().toISOString()
  };
  io.emit('notification', payload);
}, 20000);

httpServer.listen(PORT, () => {
  console.log(`Notification server listening on http://localhost:${PORT}`);
});

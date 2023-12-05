require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const app = express();
const http = require('http').Server(app);
const port = process.env.PORT;
const router = require('./route/index');
const User = require('./model/User');
const url = process.env.URI;
const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log('MongoDB Connected...');
  } catch (error) {
    console.log(error.message);
  }
};
connectDB();

app.use(cors());
app.use('/avatar', express.static('public/uploads/avatars'));
app.use('/image', express.static('public/uploads/images'));
app.use(bodyParser.json());
app.use(express.json());
app.use('/api/v1', router);
app.get('/', (req, res) => {
  res.send('Hello World!?');
});

const io = require('socket.io')(http, {
  cors: {
    origin: '*',
  },
});

const onlineUsers = {};
io.on('connection', (socket) => {
  // When a user connects, send their user information to the server
  socket.on('user_connected', (user) => {
    console.log(user);
    if (user) {
      console.log('connected');
      onlineUsers[user._id] = socket.id; // Map user ID to socket ID
      io.emit('update_online_users', onlineUsers);
    }
  });

  socket.on('join_room', (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
    console.log(`User Connected: ${socket.id}`);
  });

  socket.on('send_message', (data) => {
    console.log(data);
    socket.broadcast.emit('receive_alert', data);
    socket.to(data.room).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
    delete onlineUsers[socket.id];
  });
});

http.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

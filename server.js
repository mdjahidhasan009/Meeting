require('dotenv').config();
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const User = require('./models/UserModal');

const PORT = 8000;

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.CORS_ORIGIN
}));

app.use(express.static(path.join('public')));
app.use('/user', require('./routes/user'));

//Database connection
mongoose.connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});
mongoose.connection.on('error', error => {
    console.err('Mongoose Connection Error: ' + error.message);
})
mongoose.connection.once('open', ()=> {
    console.log('Mongodb connected!');
})

app.use((req, res, next) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
})

server.listen(process.env.PORT || PORT, () => {
    console.log('server is running on port ' + PORT)
});


//Socket
const socket = require("socket.io");
const io = socket(server);

const usersInRoom = {}; //all user(socket id) connected to a chatroom
const socketToRoom = {}; //roomId in which a socket id is connected

//verifying token
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.query.token;
        const payload = await jwt.verify(token, process.env.SECRET);
        socket.userId = payload;
        const user = await User.findOne({ _id: socket.userId }).select('-password');
        socket.username = user.username;
        socket.name = user.name;
        next();
    } catch (error) {
        console.log(error);
    }
});

io.on('connection', socket => {
    console.log('Some one joined socketId: ' + socket.id);
    socket.on("joinRoom", roomId=> {
        console.log('Joined roomId: ' + roomId + " socketId: " + socket.id + ' userId: ' + socket.userId);
        if (usersInRoom[roomId]) {
            // const length = usersInRoom[roomId].length;
            // if (length === 4) {
            //     socket.emit("room full");
            //     return;
            // }
            usersInRoom[roomId].push(socket.id);
        } else {
            usersInRoom[roomId] = [socket.id];
        }
        socketToRoom[socket.id] = roomId;
        const usersInThisRoom = usersInRoom[roomId].filter(id => id !== socket.id);
        socket.join(roomId); //for message
        socket.emit("usersInRoom", usersInThisRoom); //send all socket id connected to this room
    });

    //client send this signal to sever and sever will send to other user of peerId(callerId is peer id)
    socket.on("sendingSignal", payload => {
        console.log(payload.callerId);
        io.to(payload.userIdToSendSignal).emit('userJoined', { signal: payload.signal, callerId: payload.callerId });
    });

    //client site receive signal of other peer and it sending its own signal for other member
    socket.on("returningSignal", payload => {
        io.to(payload.callerId).emit('takingReturnedSignal', { signal: payload.signal, id: socket.id });
    });

    //from client send message to send all other connected user of same room
    socket.on('sendMessage', payload => {
        //sending message to all other connected user at same room
        io.to(payload.roomId).emit('receiveMessage', { message: payload.message, name:socket.name, username: socket.username });
    });

    //someone left room
    socket.on('disconnect', () => {
        const roomId = socketToRoom[socket.id];
        let socketsIdConnectedToRoom = usersInRoom[roomId];
        if (socketsIdConnectedToRoom) {
            socketsIdConnectedToRoom = socketsIdConnectedToRoom.filter(id => id !== socket.id);
            usersInRoom[roomId] = socketsIdConnectedToRoom;
        }
        socket.leave(roomId); //for message group(socket)
        socket.broadcast.emit("userLeft", socket.id); //sending socket id to all other connected user of same room without its own
    });
});

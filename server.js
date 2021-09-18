const path = require('path');
const http = require('http');
const express = require('express')
const socketio = require('socket.io');
const formatMessage = require('./public/js/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} =  require('./public/js/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Asigna la carpeta estatica
app.use(express.static(path.join(__dirname,'public')));


//Se ejecuta cuando el cliente se conecta
io.on('connection', socket => {

    socket.on('joinRoom', ({username,room})=> {
    
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        //Mensaje de bienvenida para un nuevo usuario
        socket.emit('message', formatMessage('Bot','Bienvenida'));

        //Se hace un brodcast cuando un usuario se une a un chat
        socket.broadcast.to(user.room).emit('message', formatMessage('Bot',`${user.username} se ha unido al chat`));

        //Envia la información de los usuarios y la sala
         io.to(user.room).emit('roomUsers', {room: user.room,users: getRoomUsers(user.room)});
    });
   
    // Escucha los mensajes del chat
    socket.on('chatMessage', msg => {
        //io.emit('message', formatMessage('USER',msg));
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });
     
    //Cuando un usuario se desconecta
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit('message',formatMessage('Bot', `${user.username} ha dejado el chat`));

             //Envia la información de los usuarios y la sala
            io.to(user.room).emit('roomUsers', {room: user.room,users: getRoomUsers(user.room)});
        }
    });

});
const PORT = process.env.PORT || 3000;
server.listen(PORT, ()=> console.log(`server runnig on port ${PORT}`));

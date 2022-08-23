// Node server which will handle socket io connections
const io = require('socket.io')(8000,{ cors: { origin: '*' } });

const users = {};

//it will listen to every event
io.on('connection', socket => {
    //if any new user joins let other users connected to server node
    socket.on('new-user-joined', name => {
        // console.log("new user", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    //if someone senda a message, broadcast it to other people
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id]});
    });

    // if someone leave chat broadcast to other prople
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})
const socket = io('http://localhost:8000');

//get dom elements in respective js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector(".container")
//audio that will play on reciving messages
var audio = new Audio('DoorBell.mp3')

//function which will append event info to cntainer
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position=='left')
        audio.play();
}

//if forms get submitted sends server to msg
// document.addEventListener('DOMContentLoaded', function () {
 form.addEventListener('submit', (e) => { 
        e.preventDefault();
        const message = messageInput.value;
        append(`you: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = '';
    })
// });

//ask new user for his/her name
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

//if new user joins, recieve the event from server
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
})

//if server sends a message , recieve it
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left')
})

//if user leaves the chat append the info to container
socket.on('left', name => {
    append(`${name} left the chat `, 'left')
})
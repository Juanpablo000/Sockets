const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


window.onload = () => {
  ocultarAllSections()
  validar()
}

function ocultarAllSections() {
  let sections = document.getElementsByTagName('section')
  for (let section of sections)
    section.classList.add('ocultar');
}

function irA(val) {
  if (val >= 0 && val < document.getElementsByTagName('section').length) {
    ocultarAllSections()
    document.getElementsByTagName('section')[val].classList.remove('ocultar')
  }
}


// Obtiene el usuario y la sala de la URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

function validar(){
  if(username!=null)
  {
    irA(1)
  }else{
    irA(0)
  }
}
const socket = io();

//Unirse a una sala
socket.emit('joinRoom', { username, room });

//Obtiene la sala y los usuarios
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Mensaje del server
socket.on('message', (message) => {
  console.log(message);
  mensajeSalida(message);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Envio de mensajes
chatForm.addEventListener('submit', (e) => {
  
  e.preventDefault();
  //Se obtiene el mensaje de texto
  let msg = e.target.elements.msg.value;
  
  //Emite el mensaje a el server
  socket.emit('chatMessage', msg);

   //Limpiar el input de los mensajes
   e.target.elements.msg.value = '';
   e.target.elements.msg.focus();

});

function mensajeSalida(message){
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
   ${message.text}
  </p>`;
  //añadire un nuevo div que se representara en forma de mensaje
  document.querySelector('.chat-messages').appendChild(div);
}

//Añade el nombre de la sala al DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

//Añade el usuario al DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

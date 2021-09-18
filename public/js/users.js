const users = [];

// Usuario se une al chat
function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

// Obtiene el usuario actual
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// Userio deja el chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Se obtine la sala de los usuarios
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

//Se exportan las funciones
module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
};

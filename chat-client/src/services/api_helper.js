import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:3001"
})

//LOGIN
export const loginUser = async (loginData) => {
  try {
    const resp = await api.post('/auth/login', loginData);
    api.defaults.headers.common.authorization = `Bearer ${resp.data.auth_token}`;
    localStorage.setItem('authToken', resp.data.auth_token);
    localStorage.setItem('name', resp.data.name);
    localStorage.setItem('email', resp.data.email);
    localStorage.setItem('id', resp.data.id)
    return {
      auth_token: resp.data.auth_token,
      name: resp.data.name,
      email: resp.data.email,
      id: resp.data.id
    };
  } catch (e) {
    console.log(e.response);
    if (e.response && e.response.status === 401) {
      return { errorMessage: `Email/password is incorrect, or user is already online!` };
    }
  }
}

//REGISTER
export const registerUser = async (registerData) => {
  let email;
  try {
    const resp = await api.post('/signup', registerData);
    console.log(resp)
    api.defaults.headers.common.authorization = `Bearer ${resp.data.auth_token}`;
    localStorage.setItem('authToken', resp.data.auth_token);
    localStorage.setItem('name', resp.data.name);
    localStorage.setItem('id', resp.data.id)
    return {
      auth_token: resp.data.auth_token,
      name: resp.data.name,
      id: resp.data.id
    };
  } catch (e) {
    console.log(e.response);
    if (e.response && e.response.status === 422) {
      return { errorMessage: `Email address already in use. You indicated you are a new customer, but an account already exists with the e-mail ${email}` };
    }
  }

}

//VERIFY USER
export const verifyUser = async () => {
  const token = localStorage.getItem('authToken');
  if (token) {
    api.defaults.headers.common.authorization = `Bearer ${token}`;
  }
}

//GET USERS
export const getAllUsers = async () => {
  try {
    const users = await api.get('/users')
    return users.data;
  } catch (e) {
    console.error(e.message);
  }
}

//GET ONLINE USERS
export const getOnlineUsers = async () => {
  try {
    let users = await api.get('/users')
    users = users.data.filter(user => user.is_online === true);
    return users;
  } catch (e) {
    console.error(e.message);
  }
}

//GET LAST 10 MESSAGES
export const getTenMessages = async () => {
  try {
    let messages = await api.get('/chat_messages')
    return messages.data;
  } catch (e) {
    console.error(e.message)
  }
}

//GET CURRENT USER FRIENDS
export const getFriends = async (currentUserId) => {
  try {
    let friends = await api.get(`/users/${currentUserId}/friends`)
    return friends.data;
  } catch (e) {
    console.error(e.message)
  }
}

//ADD FRIEND TO CURRENT USER
export const addFriend = async (currentUserId, friendId, friendName) => {
  try {
    let friendToAdd = await api.post(`/users/${currentUserId}/friends`, { friend_id: friendId, friend_name: friendName })
    return friendToAdd.data;
  } catch (e) {
    console.error(e.message);
  }
}

//DELETE FRIEND THAT BELONGS TO CURRENT USER
export const removeFriend = async (currentUserId, friendId) => {
  try {
    let friendToDelete = await api.delete(`/users/${currentUserId}/friends/${friendId}`)
    return friendToDelete.data;
  } catch (e) {
    console.error(e.message);
  }
}

//GET ONE USER
export const getOneUser = async (userId) => {
  try {
    let user = await api.get(`/users/${userId}`)
    return user.data;
  } catch (e) {
    console.error(e.message);
  }
}

//UPDATE USERNAME
export const updateUsername = async (currentUserId, updatedName) => {
  try {
    let updateNameSuccess = await api.put(`/users/${currentUserId}`, { name: updatedName })
    return updateNameSuccess.data;
  } catch (e) {
    console.error(e.message);
  }
}
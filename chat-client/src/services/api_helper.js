import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:3001"
})

//LOGIN
export const loginUser = async (loginData) => {
  const resp = await api.post('/auth/login', loginData);
  api.defaults.headers.common.authorization = `Bearer ${resp.data.auth_token}`;
  localStorage.setItem('authToken', resp.data.auth_token);
  localStorage.setItem('name', resp.data.user.name);
  localStorage.setItem('email', resp.data.user.email);
  return resp.data.user;
}

//REGISTER
export const registerUser = async (registerData) => {
  try {
    const resp = await api.post('/signup', registerData);
    api.defaults.headers.common.authorization = `Bearer ${resp.data.auth_token}`;
    localStorage.setItem('authToken', resp.data.auth_token);
    localStorage.setItem('name', resp.data.user.name);
    localStorage.setItem('email', resp.data.user.email);
    return resp.data.user;
  } catch (e) {
    console.log(e.response);
    if (e.response.status === 422) {
      return { errorMessage: "Email is already associated with a user, please login to" }
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
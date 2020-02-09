import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:3001"
})

//LOGIN
export const loginUser = async (loginData) => {
  const resp = await api.post('/auth/login', loginData);
  api.defaults.headers.common.authorization = `Bearer ${resp.data.auth_token}`;
  localStorage.setItem('authToken', resp.data.auth_token);
  localStorage.setItem('name', resp.data.name);
  localStorage.setItem('email', resp.data.email);
  return {
    auth_token: resp.data.auth_token,
    name: resp.data.name,
    email: resp.data.email,
    id: resp.data.id
  };
}

//REGISTER
export const registerUser = async (registerData) => {
  let email;
  try {
    const resp = await api.post('/signup', registerData);
    api.defaults.headers.common.authorization = `Bearer ${resp.data.auth_token}`;
    localStorage.setItem('authToken', resp.data.auth_token);
    localStorage.setItem('name', resp.data.user.name);
    localStorage.setItem('email', resp.data.user.email);
    email = resp.data.user.email;
    return resp.data.user;
  } catch (e) {
    console.log(e.response);
    if (e.response.status === 422) {
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
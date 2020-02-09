import React, { Component } from 'react';
import { registerUser, verifyUser } from './services/api_helper'
import './App.css';

//custom components
import LoginForm from './components/LoginForm'
import Chat from './components/Chat';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentUser: '',
      userList: []
    }
  }

  componentDidMount() {
    verifyUser();
    if (localStorage.getItem('authToken')) {
      const name = localStorage.getItem('name');
      const email = localStorage.getItem('email');
      const id = parseInt(localStorage.getItem('id'));
      const user = { name, email, id };
      user && this.setState({
        currentUser: user
      })
    }
  }

  handleRegister = async (e, registerData) => {
    e.preventDefault();
    const currentUser = await registerUser(registerData);
    if (!currentUser.errorMessage) {
      this.setState({
        currentUser
      })
      this.props.history.push('/todos')
    } else {
      this.setState({
        errorText: currentUser.errorMessage
      })
    }
  }

  handleLogout = () => {
    this.setState({
      currentUser: null
    })
    localStorage.removeItem('authToken');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('id');
  }

  setUser = (currentUser) => {
    this.setState({
      currentUser
    })
  }

  render() {
    // { console.log(this.state.chatLogs) }
    // { console.log(this.state.currentUser) }
    return (
      <div className='App'>
        {this.state.currentUser ?
          <div>
            <h4>Welcome back, {this.state.currentUser.name}</h4>
            <button onClick={this.handleLogout}>Logout</button>
          </div>
          :
          <LoginForm
            setUser={this.setUser}
          />
        }
        <Chat
          currentUser={this.state.currentUser}
        />

      </div>
    );
  }
}

export default App
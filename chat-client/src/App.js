import React, { Component } from 'react';
import './App.css';
//api_helper
import { verifyUser } from './services/api_helper'
//custom components
import Chat from './components/Chat';
import Header from './components/Header';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentUser: null,
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

  setUser = (currentUser) => {
    this.setState({
      currentUser
    })
  }

  render() {
    return (
      <div className='App'>

        <Header
          currentUser={this.state.currentUser}
          setUser={this.setUser}
        />

        {this.state.currentUser &&
          <Chat
            currentUser={this.state.currentUser}
          />
        }

      </div>
    );
  }
}

export default App
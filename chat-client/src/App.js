import React, { Component } from 'react';
import './App.css';
//api_helper
import { verifyUser } from './services/api_helper'
//custom components
import Chat from './components/Chat';
import Header from './components/Header';
import Window from './components/Window';
import FriendList from './components/FriendList'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentUser: null,
      userList: [],
      hasActivelyLoggedOut: false
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

  setHasActivelyLoggedOut = () => {
    this.setState({
      hasActivelyLoggedOut: false
    })
  }

  addToUserList = (user) => {
    this.setState({
      userList: [...this.state.userList, user]
    })
  }

  removeFromUserList = (user) => {
    let newUserList = this.state.userList.filter(name => user !== name)
    this.setState({
      userList: newUserList
    })
  }

  handleLogout = () => {
    console.log("FROM LOGOUT")
    // this.setUser(null);
    this.setState({
      hasActivelyLoggedOut: true
    })
    localStorage.removeItem('authToken');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('id');
  }

  render() {
    return (
      <div className='App'>

        <Header
          currentUser={this.state.currentUser}
          setUser={this.setUser}
          handleLogout={this.handleLogout}
        />

        {this.state.currentUser &&
          <Window
            topBarText="Group Chat"
            onClose={this.handleLogout}
          >
            <Chat
              currentUser={this.state.currentUser}
              handleLogout={this.handleLogout}
              addToUserList={this.addToUserList}
              removeFromUserList={this.removeFromUserList}
              hasActivelyLoggedOut={this.state.hasActivelyLoggedOut}
              setHasActivelyLoggedOut={this.setHasActivelyLoggedOut}
              setUser={this.setUser}
            />
          </Window>
        }
      </div>
    );
  }
}

export default App
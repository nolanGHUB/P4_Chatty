import React, { Component } from 'react';
import './App.css';
//api_helper
import { verifyUser, getAllUsers, getOnlineUsers } from './services/api_helper'
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
      onlineUserList: [],
      hasActivelyLoggedOut: false
    }
  }

  componentDidMount() {
    verifyUser();
    // if (localStorage.getItem('authToken')) {
    //   const name = localStorage.getItem('name');
    //   const email = localStorage.getItem('email');
    //   const id = parseInt(localStorage.getItem('id'));
    //   const user = { name, email, id };
    //   user && this.setState({
    //     currentUser: user
    //   })
    // }
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

  setUserList = async () => {
    const userList = await getAllUsers();
    const onlineUserList = userList.filter(user => user.is_online === true);
    this.setState({
      userList,
      onlineUserList
    })
  }

  setOnlineUserList = async () => {
    // const onlineUserList = this.state.userList.filter(user => user.is_online === true);
    const onlineUserList = await getOnlineUsers()
    this.setState({
      onlineUserList
    })
  }

  addToUserList = (user) => {
    if (this.state.onlineUserList.filter(userx => (userx.name === user.name)).length === 0) {
      this.setState({
        onlineUserList: [...this.state.onlineUserList, user]
      })
    }
  }

  removeFromUserList = (user) => {
    let newUserList = this.state.onlineUserList.filter(name => user.name !== name.name)
    this.setState({
      onlineUserList: newUserList
    })
    console.log(`trying to remove${user}`)
    console.log(this.state.onlineUserList)
  }

  handleLogout = () => {
    console.log("FROM LOGOUT")
    // this.setUser(null); // now handled in Chat component because if you do it here it immediately "closes" the chat component before the socket disconnect can occur.
    this.setState({
      hasActivelyLoggedOut: true
    })
    localStorage.removeItem('authToken');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('id');
  }

  render() {
    // console.log(this.state.onlineUserList)
    return (
      <div className='App'>

        <Header
          currentUser={this.state.currentUser}
          setUser={this.setUser}
          handleLogout={this.handleLogout}
          setUserList={this.setUserList}
        />

        {this.state.currentUser &&
          <div className="main-window">
            <div></div>
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
                onlineUserList={this.onlineUserList}
              />
            </Window>
            <Window
              topBarText={`${this.state.currentUser.name}'s Buddy List`}
              onClose={this.handleLogout}
            >
              <FriendList
                userList={this.state.userList}
                onlineUserList={this.state.onlineUserList}
                setUserList={this.setUserList}
                setOnlineUserList={this.setOnlineUserList}
                currentUser={this.state.currentUser}
              />
            </Window>
          </div>
        }
      </div>
    );
  }
}

export default App
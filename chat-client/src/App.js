import React, { Component } from 'react';
import './App.css';
//api_helper
import { verifyUser, getAllUsers, getFriends, addFriend, removeFriend } from './services/api_helper'
//custom components
import Chat from './components/Chat';
import Header from './components/Header';
import Window from './components/Window';
import FriendList from './components/FriendList'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentUser: null, //user object {id: i, name: "s", email: "s2", is_online: b}
      userList: [], //user objects
      onlineUserList: [], //user objects
      friendList: [], //friend objects {id: i, user_adding_friend_id: "num", friend_id: "num", friend_name: "s"} 
      hasActivelyLoggedOut: false
    }
  }

  componentDidMount() {
    verifyUser();
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
    // console.log(userList);
    const onlineUserList = userList.filter(user => user.is_online === true);
    this.setState({
      userList,
      onlineUserList
    })
  }

  setFriendList = async () => {
    const friendList = await getFriends(this.state.currentUser.id);

    if (friendList) {
      let onlineFriendList = this.state.onlineUserList.filter(user => friendList.some(friend => user.id === parseInt(friend.friend_id)));
      this.setState({
        friendList,
        onlineFriendList
      })
    }
  }

  addToUserList = (user) => {
    // if (this.state.onlineUserList.filter(userx => (userx.id === user.id))) { //if person is already in online user list...
    //   if (this.state.friendList.some(friend => user.id === parseInt(friend.friend_id))) { // if person is in users friend list..
    //     this.setState({
    //       // onlineUserList: [...this.state.onlineUserList, user],
    //       onlineFriendList: [...this.state.onlineFriendList, user] // add user to online friends list
    //     })
    //   } else { // if person is not already on the online list...
    //     this.setState({
    //       onlineUserList: [...this.state.onlineUserList, user] // add that user to the online list..
    //     })
    //   }
    // } OLD SHIT, REPLACED BELOW.


    //not already in onlineUserList
    //Friend?
    //add to both
    //else
    //add to userlist

    //friend?
    //online? lol fuck it.
    // if (!this.state.onlineUserList.some(userx => (userx.id === user.id))) { //user objects, some() returns boolean
    //   if (this.state.friendList.some(friend => user.id === parseInt(friend.friend_id))) { //friend objects
    //     this.setState({
    //       onlineFriendList: [...this.state.onlineFriendList, user],
    //       onlineUserList: [...this.state.onlineUserList, user]
    //     })
    //   } else {
    //     this.setState({
    //       onlineUserList: [...this.state.onlineUserList, user]
    //     })
    //   }
    // }



    //ONLINE FRIEND AND !ONLINEFRIEND - ADD TO FRIEND
    //ONLINE !FRIEND - DO NOTHING
    //!ONLINE FRIEND - ADD TO BOTH
    //!ONLINE !FRIEND - ADD TO ONLINEUSER
    if (user.id !== this.state.currentUser.id) {
      const online = this.state.onlineUserList.some(userx => (userx.id === user.id)); // true/false if in friends list
      const friend = this.state.friendList.some(friend => user.id === parseInt(friend.friend_id)); //true/false if already online
      const onlinefriend = this.state.onlineFriendList.some(onlineFriend => (onlineFriend.id === user.id)); //true/false if friend is already online UGH
      console.log("friend:" + friend + " online:" + online + " onlinefriend:" + onlinefriend)

      if (online && friend && !onlinefriend) {
        console.log("already online but is a friend but friend is not already online, adding to friends.")
        this.setState({
          onlineFriendList: [...this.state.onlineFriendList, user]
        })
      } else if (!online && friend) {
        console.log("not already online but is a friend, adding to both.")
        this.setState({
          onlineFriendList: [...this.state.onlineFriendList, user],
          onlineUserList: [...this.state.onlineUserList, user]
        })
      } else if (!online && !friend) {
        console.log("not already online and not a friend, so adding to people")
        this.setState({
          onlineUserList: [...this.state.onlineUserList, user]
        })
      }
    }

  }

  addToFriendList = async (friendId, friendName) => {
    let addedToDb = await addFriend(this.state.currentUser.id, friendId, friendName); //friend object
    let friendToAdd = this.state.onlineUserList.filter(user => user.id === friendId); //user object
    // console.log("FRIEND ADDED: ---V")
    // console.log(addedToDb);
    // console.log("ADDING THIS TO LOCAL STATES ---V")
    // console.log(friendToAdd);
    this.setState({
      friendList: [...this.state.friendList, addedToDb], //array of friend objects
      onlineFriendList: [...this.state.onlineFriendList, friendToAdd[0]] //array of user objects (that are friends & online)
    })
  }

  removeFromFriendList = async (friendId, friendToRemoveUserId) => {
    await removeFriend(this.state.currentUser.id, friendId);
    let newOnlineFriendList = this.state.onlineFriendList.filter(friend => friend.id !== friendToRemoveUserId); //user objects
    let newFriendList = this.state.friendList.filter(friend => friend.id !== friendId); //new array that's everything except for the one being removed (friend objects)
    // console.log(friendToDelete + " DELETED! ");
    this.setState({
      friendList: newFriendList, //friend objects
      onlineFriendList: newOnlineFriendList //user objects
    })
  }

  removeFromUserList = (user) => {
    let newUserList = this.state.onlineUserList.filter(name => user.id !== name.id)
    // if(this.state.onlineFriendList.some(friend => user.id === friend.id))
    let newFriendList = this.state.onlineFriendList.filter(name => user.id !== name.id)
    this.setState({
      onlineUserList: newUserList, //user objects
      onlineFriendList: newFriendList //user objects
    })
    // console.log(`trying to remove${user}`);
    // console.log(this.state.onlineUserList);
  }

  handleLogout = () => {
    // console.log("FROM LOGOUT");
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
    return (
      <div className='App'>

        <Header
          currentUser={this.state.currentUser}
          setUser={this.setUser}
          handleLogout={this.handleLogout}
          setUserList={this.setUserList}
          setFriendList={this.setFriendList}
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
                userList={this.state.userList}
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
                currentUser={this.state.currentUser}
                onlineFriendList={this.state.onlineFriendList}
                friendList={this.state.friendList}
                addToFriendList={this.addToFriendList}
                removeFromFriendList={this.removeFromFriendList}
              />
            </Window>
          </div>
        }
      </div>
    );
  }
}

export default App
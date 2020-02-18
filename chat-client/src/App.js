import React, { Component } from 'react';
import './App.css';
//api_helper
import { verifyUser, getAllUsers, getFriends, addFriend, removeFriend } from './services/api_helper'
//custom components
import Chat from './components/Chat';
import Header from './components/Header';
import Window from './components/Window';
import FriendList from './components/FriendList'
import MinimizedWindows from './components/MinimizedWindows'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentUser: null, //user object {id: i, name: "s", email: "s2", is_online: b}
      userList: [], //user objects
      onlineUserList: [], //user objects
      friendList: [], //friend objects {id: i, user_adding_friend_id: "num", friend_id: "num", friend_name: "s"} 
      hasActivelyLoggedOut: false, // sends logout function to trigger inside Chat.js (where the socket is)
      onlineFriendList: [], // list of friends of whom are online
      // currentChatWindow: 0,
      chatWindows: [{ index: 0, name: "group" }],
      destination: 0, // to whom youd like to send a PM to - to communicate between chat and friendlist
      clickedPersonId: 0, // id of user that has been highlighted on buddylist
      unreadMessages: [],
      chatBarText: "Group Chat"
    }
  }

  componentDidMount() {
    verifyUser();

    this.doorOpen = new Audio('sounds/dooropen.wav');
    this.doorSlam = new Audio('sounds/doorslam.wav');
    this.doorOpen.volume = 0.4;
    this.doorSlam.volume = 0.4;
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

  setClickedPersonId = (id) => {
    this.setState({
      clickedPersonId: id
    })
  }

  setDestination = (destination) => {
    this.setState({
      destination
    })
  }

  addToUserList = (user) => {

    this.setState({
      userList: [...this.state.userList, user]
    })
  }

  setChatBar = (newText) => {

    this.setState({
      chatBarText: newText
    })
  }

  // setCurrentChatWindow = (windowIndex) => {

  //   this.setState({
  //     currentChatWindow: windowIndex
  //   })
  // }

  addChatWindow = (windowObj) => {

    this.setState({
      chatWindows: [...this.state.chatWindows, windowObj]
    })
  }

  addToUnreadMessages = (id) => {
    this.setState({
      unreadMessages: [...this.state.unreadMessages, id]
    })
  }

  removeFromUnreadMessages = (id) => {
    let tempMessages = this.state.unreadMessages.filter(message => message !== id)

    this.setState({
      unreadMessages: tempMessages
    })
  }

  addToOnlineUserLists = (user) => {
    //ONLINE FRIEND AND !ONLINEFRIEND - ADD TO FRIEND
    //ONLINE !FRIEND - DO NOTHING
    //!ONLINE FRIEND - ADD TO BOTH
    //!ONLINE !FRIEND - ADD TO ONLINEUSER

    //ONLINE FRIEND AND ONLINEFRIEND || ONLINE & !FRIEND are the two situations that are fired during a name-update-announcement. Neither of which do anything, so lets do it up top specifically for this.
    //if ( online && onlineUserList.some(userx => { userx.id === user.id && userx.name !== user.name})) -- this seems too exhaustive.


    let onlinefriend = false;
    if (user.id !== this.state.currentUser.id) {
      const online = this.state.onlineUserList.some(userx => (userx.id === user.id)); // true/false if already online
      const friend = this.state.friendList.some(friend => user.id === parseInt(friend.friend_id)); //true/false if in currentUser's friend list
      if (this.state.onlineFriendList) {
        onlinefriend = this.state.onlineFriendList.some(onlineFriend => (onlineFriend.id === user.id)); //true/false if friend is already online UGH
      }
      // console.log("friend:" + friend + " online:" + online + " onlinefriend:" + onlinefriend)

      if (online && friend && !onlinefriend) {
        // console.log("already online but is a friend but friend is not already online, adding to friends.")
        this.setState({
          onlineFriendList: [...this.state.onlineFriendList, user]
        })
        this.playSound(this.doorOpen);
      } else if (!online && friend) {
        // console.log("not already online but is a friend, adding to both.")
        this.setState({
          onlineFriendList: [...this.state.onlineFriendList, user],
          onlineUserList: [...this.state.onlineUserList, user]
        })
        this.playSound(this.doorOpen);
      } else if (!online && !friend) {
        // console.log("not already online and not a friend, so adding to people")
        this.setState({
          onlineUserList: [...this.state.onlineUserList, user]
        })
        this.playSound(this.doorOpen);
      }
    }

  }

  addToFriendList = async (friendId, friendName) => {
    let addedToDb = await addFriend(this.state.currentUser.id, friendId, friendName); //friend object
    let friendToAdd = this.state.onlineUserList.filter(user => user.id === friendId); //user object

    this.setState({
      friendList: [...this.state.friendList, addedToDb], //array of friend objects
      onlineFriendList: [...this.state.onlineFriendList, friendToAdd[0]] //array of user objects (that are friends & online)
    })
  }

  removeFromFriendList = async (friendId, friendToRemoveUserId) => {
    await removeFriend(this.state.currentUser.id, friendId);
    let newOnlineFriendList = this.state.onlineFriendList.filter(friend => friend.id !== friendToRemoveUserId); //user objects
    let newFriendList = this.state.friendList.filter(friend => friend.id !== friendId); //new array that's everything except for the one being removed (friend objects)

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
    this.playSound(this.doorSlam);
  }

  updateStateListsForNewName = (newName) => {
    const newUser = this.state.currentUser;
    newUser.name = newName;
    this.setState({
      currentUser: newUser
    })
  }

  playSound = (sound) => {
    const audioPromise = sound.play()
    if (audioPromise !== undefined) {
      audioPromise
        .then(_ => {
          // autoplay started
        })
        .catch(err => {
          // catch dom exception
          console.info(err)
        })
    }
  }

  handleLogout = () => {
    // console.log("FROM LOGOUT");
    // this.setUser(null); // now handled in Chat component because if you do it here it immediately "closes" the chat component before the socket disconnect can occur.
    this.setState({
      hasActivelyLoggedOut: true //effectively a sent message from App.js child component: Chat, saying hey, user has logged out!, most of which is handled inside Chat already.
    })
    localStorage.removeItem('authToken');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('id');
  }

  render() {
    // console.log(this.state.currentUser) {auth_token: "", name: "", email: "", id: #}
    // console.log(this.state.userList) {id: #, name: "", email: "", is_online: t/f}
    // console.log(this.state.onlineUserList)
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
            <div className="main-chat">
              <Window
                topBarText={this.state.chatBarText}
                onClose={this.handleLogout}
              >
                <Chat
                  currentUser={this.state.currentUser}
                  handleLogout={this.handleLogout}
                  addToOnlineUserLists={this.addToOnlineUserLists}
                  removeFromUserList={this.removeFromUserList}
                  hasActivelyLoggedOut={this.state.hasActivelyLoggedOut}
                  setHasActivelyLoggedOut={this.setHasActivelyLoggedOut}
                  setUser={this.setUser}
                  onlineUserList={this.state.onlineUserList}
                  userList={this.state.userList}
                  addToUserList={this.addToUserList}
                  playSound={this.playSound}
                  destination={this.state.destination}
                  setDestination={this.setDestination}
                  clickedPersonId={this.state.clickedPersonId}
                  addChatWindow={this.addChatWindow}
                  addToUnreadMessages={this.addToUnreadMessages}
                />
              </Window>
              <MinimizedWindows
                chatWindows={this.state.chatWindows}
                destination={this.state.destination}
                setClickedPersonId={this.setClickedPersonId}
                setDestination={this.setDestination}
                removeFromUnreadMessages={this.removeFromUnreadMessages}
                unreadMessages={this.state.unreadMessages}
                setChatBar={this.setChatBar}
              />
            </div>
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
                updateStateListsForNewName={this.updateStateListsForNewName}
                clickedPersonId={this.state.clickedPersonId}
                setClickedPersonId={this.setClickedPersonId}
                destination={this.state.destination}
                setDestination={this.setDestination}
                setChatBar={this.setChatBar}
              />
            </Window>
          </div>
        }
      </div>
    );
  }
}

export default App
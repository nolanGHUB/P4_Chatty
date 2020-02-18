import React, { Component } from 'react'
//actioncable npm
import Cable from 'actioncable';
//api_helper
import { getTenMessages } from '../services/api_helper'
//custom components
import Modal from './Modal'

class Chat extends Component {
  constructor(props) {
    super(props)

    this.chatField = React.createRef(); //create reference to the chatfield in order to keep it scrolled down

    this.state = {
      messageIndex: { // basically keeps track of all of the current DirectMessages and to whom they are from
        0: 0 //key = which user_id the messages are from ( 0 is group chat ) and the value is the index within chatLogs2 that these messages are stored.
      },
      chatLogs2: [ //where all messages are stored and sorted
        []
      ],
      currentChatMessage: '', //holds currently typed input to-be sent to the channel
      haveIAppeared: false, //keep track of current user's announcement message to prevent it from being repeated. (bugfix)
      modal: false, //opens & closes the error message box
      iconList: ["images/buddyicons/happydance.gif", "images/buddyicons/breakdance.gif", "images/buddyicons/goofaround.gif", "images/buddyicons/lightsaber.gif", "images/buddyicons/mrt.gif", "images/buddyicons/muffinmass.gif", "images/buddyicons/obama.gif", "images/buddyicons/skate.gif", "images/buddyicons/spaz.gif", "images/buddyicons/spoiled.gif", "images/buddyicons/superpower.gif"],
      randomIcon: '', //where the currently chosen animated gif is stored (math.random)
    }
  }

  componentDidMount() {
    this.createSocket(); //open connection to web-socket channel
    this.setRecentMessages();
    this.setIcon();

    this.imrcv = new Audio('sounds/imrcv.wav')
    this.imsend = new Audio('sounds/imsend.wav')
    this.imrcv.volume = 0.4;
    this.imsend.volume = 0.4;
    // this.audio.load();
  }

  componentDidUpdate() {
    this.scrollToBottom();
    if (this.props.hasActivelyLoggedOut === true) {

      this.setState({
        haveIAppeared: false
      })
      this.chats.unsubscribe();
      this.props.setHasActivelyLoggedOut();
      this.props.setUser(null); //close chat component
    }
  }

  setIcon() {
    let randomIcon = this.state.iconList[Math.floor(Math.random() * this.state.iconList.length)]
    this.setState({
      randomIcon
    })
  }

  setRecentMessages = async () => {
    const data = await getTenMessages();
    let tempLogs = this.state.chatLogs2;
    tempLogs[0] = data
    this.setState({
      chatLogs2: tempLogs
    })
  }

  toggleModal = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  setErrorText = (errorText) => {
    //empty function because modal requires it and I don't feel like refactoring it, it gets used properly in Header however here it IS the error text and doesn't need to set anything!
  }

  createSocket = async () => { //create connection to WS
    this.cable = Cable.createConsumer('ws://localhost:3001/cable');
    this.chats = this.cable.subscriptions.create({
      channel: 'ChatChannel'
    }, {
      connected: () => { // fire this when connect
        if (this.state.haveIAppeared === false) {
          this.chats.perform('appear', {
            id: this.props.currentUser.id
          })
          this.setState({
            haveIAppeared: true
          })
        }
      },
      disconnected: () => { //fired when disconnected
        this.setState({
          haveIAppeared: false
        })
      },
      received: async (data) => { //fired upon receiving any json from socket
        if (data.event) {
          if (data.event === 'appear') { //someone logged in -broadcast
            if (!data.destination) {
              data.destination = 0 // send events to chatroom-allchat only.
            }
            let tempLog = this.state.chatLogs2;
            tempLog[parseInt(data.destination)] = [...tempLog[parseInt(data.destination)], data] //inserting message into chatlog[0] which is where groupchat objects are stored
            this.setState({
              chatLogs2: tempLog
            });
            let userObj = this.props.userList.filter(user => user.id === data.id) //We want the userObj NOT the announcement event Obj!
            if (!userObj[0]) { // only true when it's a new user that was not added to the original userList at componentDidMount in app.js
              this.props.addToUserList({ id: data.id, name: data.name, email: "new", is_online: true })
              this.props.addToOnlineUserLists({ id: data.id, name: data.name, email: "new", is_online: true })
            } else {
              this.props.addToOnlineUserLists(userObj[0]); //filter returns array, in this case of 1.
            }

          }
          else if (data.event === 'disappear') { // someone logged out
            if (!data.destination) {
              data.destination = 0 // send events to chatroom-allchat only.
            }
            let tempLog = this.state.chatLogs2;
            tempLog[parseInt(data.destination)] = [...tempLog[parseInt(data.destination)], data]
            this.setState({
              chatLogs2: tempLog
            });
            this.props.removeFromUserList(data); //BAD but works fine for our purposes. (two different object comparison but id = id)
          }
        } else { //Someone said something in a chat and this catches the receiving end of it
          if (parseInt(data.destination) === 0) { // if intended for group append it to group log
            let tempLog = this.state.chatLogs2;
            tempLog[0] = [...tempLog[0], data]
            this.setState({
              chatLogs2: tempLog
            });

            //IF MESSAGE IS FOR YOU, DM. CHECK IF DM WITH THAT PERSON ALREADY EXISTS IF IT DOES APPEND TO THAT CHAT ARRAY, OTHERWISE CREATE A NEW ONE WITH THAT PERSONS NAME AND ID AS INDEX0 OF THAT ARRAY AND THEN APPEND FROM THERE.
          } else if (parseInt(data.destination) === this.props.currentUser.id) { //if for you specifically and not group
            if (this.state.messageIndex[data.user_id]) { //IF RECEIVED MESSAGE FROM THIS PERSON BEFORE, APPEND index
              let index = this.state.messageIndex[data.user_id];
              let tempLog = this.state.chatLogs2;

              if (parseInt(this.props.destination) !== parseInt(data.user_id)) {
                this.props.addToUnreadMessages(parseInt(data.user_id));
              }

              tempLog[index] = [...tempLog[index], data]
              this.setState({
                chatLogs2: tempLog
              })
            } else { //PM WINDOW HAS YET TO BE ESTABLISHED - THIS STARTING WITH THEM
              this.props.addChatWindow({ index: data.user_id, name: data.name })
              let tempMessageIndex = this.state.messageIndex;
              tempMessageIndex[data.user_id] = this.state.chatLogs2.length;

              if (parseInt(this.props.destination) !== parseInt(data.user_id)) {
                this.props.addToUnreadMessages(parseInt(data.user_id));
              }

              let index = this.state.messageIndex[data.user_id];
              let tempLog = this.state.chatLogs2;
              tempLog[index] = [data];
              this.setState({
                chatLogs2: tempLog
              })
            }
          } else if (data.user_id === this.props.currentUser.id) { //if from you specifically for someone else not the group
            if (this.state.messageIndex[parseInt(data.destination)]) { //IF PM HAS BEEN ESTABLISHED WITH THIS PERSON BEFORE
              let index = this.state.messageIndex[parseInt(data.destination)];
              let tempLog = this.state.chatLogs2;

              if (parseInt(this.props.destination) !== parseInt(data.destination)) {
                this.props.addToUnreadMessages(parseInt(data.destination));
              }

              tempLog[index] = [...tempLog[index], data]
              this.setState({
                chatLogs2: tempLog
              })
            } else { //PM HAS YET TO BE ESTABLISHED WITH THIS PERSON - THIS STARTING FROM YOU
              let destinationUserArray = this.props.onlineUserList.filter(onlineUser => parseInt(onlineUser.id) === parseInt(data.destination))
              this.props.addChatWindow({ index: parseInt(data.destination), name: destinationUserArray[0].name })
              let tempMessageIndex = this.state.messageIndex;

              if (parseInt(this.props.destination) !== parseInt(data.destination)) {
                this.props.addToUnreadMessages(parseInt(data.destination));
              }

              tempMessageIndex[parseInt(data.destination)] = this.state.chatLogs2.length;

              let index = this.state.messageIndex[parseInt(data.destination)];
              let tempLog = this.state.chatLogs2;
              tempLog[index] = [data];
              this.setState({
                chatLogs2: tempLog
              })
            }
          }

          if (data.name !== this.props.currentUser.name && (parseInt(data.destination) === 0 || parseInt(data.destination) === this.props.currentUser.id)) { //play audio cue upon receiving any message for you
            this.props.playSound(this.imrcv);
          }
        }
        console.log(this.state.chatLogs2)
        console.log(this.state.messageIndex);
      },
      create: function (chatContent, id, destination) {
        this.perform('create', {
          content: chatContent,
          created_by: id,
          destination: destination
        });
      }
    });
  }

  renderChatLog2 = () => {
    if (this.state.chatLogs2[this.state.messageIndex[this.props.destination]]) {
      return this.state.chatLogs2[this.state.messageIndex[this.props.destination]].map((el, key) => {
        let serverTime = new Date(Date.parse(el.created_at))
        let time = serverTime.getHours() + ":" + serverTime.getMinutes()
        return (
          <div key={key}>
            {el.event ?
              el.event === 'appear' ?
                <li>
                  <i>{el.name} has entered the chat.</i>
                </li>
                :
                (el.event === 'disappear' &&
                  <li>
                    <i>{el.name} has left the chat.</i>
                  </li>
                )
              :
              <li key={`chat_${el.id}`}>
                {el.name === this.props.currentUser.name ?
                  <span className='chat-your-name'>{el.name}</span>
                  :
                  <span className='chat-their-name'>{el.name}</span>
                }
                <span className='chat-created-at'>({time}): </span>
                <span className='chat-message'>{el.content}</span>
              </li>
            }
          </div>
        )
      }
      );
    }
  }

  updateCurrentChatMessage(event) {
    this.setState({
      currentChatMessage: event.target.value
    });
  }

  handleSendEvent(event) {
    event.preventDefault();
    if (this.state.currentChatMessage) {
      this.chats.create(this.state.currentChatMessage, this.props.currentUser.id, this.props.destination);
      this.setState({
        currentChatMessage: ''
      });
      this.props.playSound(this.imsend)
    } else {
      console.log("You have to type a message first!");
      this.setState({
        modal: true
      })
    }
  }

  handleChatInputKeyPress(event) {
    if (event.key === 'Enter') {
      this.handleSendEvent(event);
    }
  }

  scrollToBottom = () => {
    this.chatField.current.scrollTop = this.chatField.current.scrollHeight;
  }

  render() {
    return (
      <div className="chat">
        {this.state.modal &&
          <Modal
            modal={this.state.modal}
            onClose={this.toggleModal}
            topBarText="Error!"
            setErrorText={this.setErrorText}
          >
            <div className="chat-popup-error">
              You have to type a message first!
              <button onClick={this.toggleModal} className="chat-popup-error-button header-button">
                Close
              </button>
            </div>
          </Modal>
        }
        <div className='chat-wrapper'>
          <div className='chat-window' ref={this.chatField}>
            <ul className='chat-log'>
              {/* {this.renderChatLog()} */}
              {this.renderChatLog2()}
            </ul>
          </div>
          <textarea
            onKeyPress={(e) => this.handleChatInputKeyPress(e)}
            value={this.state.currentChatMessage}
            onChange={(e) => this.updateCurrentChatMessage(e)}
            placeholder='Enter your message...'
            className='chat-input' />
          <div className="chat-button-container">
            <img className="chat-avatar-gif" src={this.state.randomIcon} alt="animated avatar gif"></img>
            <button
              onClick={(e) => this.handleSendEvent(e)}
              className='chat-send'>
              Send
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default Chat
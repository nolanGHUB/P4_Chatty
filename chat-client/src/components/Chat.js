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

    this.chatField = React.createRef();


    this.state = {
      chatLogs: [],
      messageIndex: {
        0: 0
      },
      chatLogs2: [
        [
        ]
      ],
      currentChatMessage: '',
      lastAppearEvent: '',
      haveIAppeared: false,
      modal: false,
      iconList: ["images/buddyicons/happydance.gif", "images/buddyicons/breakdance.gif", "images/buddyicons/goofaround.gif", "images/buddyicons/lightsaber.gif", "images/buddyicons/mrt.gif", "images/buddyicons/muffinmass.gif", "images/buddyicons/obama.gif", "images/buddyicons/skate.gif", "images/buddyicons/spaz.gif", "images/buddyicons/spoiled.gif", "images/buddyicons/superpower.gif"],
      randomIcon: '',
      chatWindow: '1',
      chatWindows: ['1']
    }
  }

  componentDidMount() {
    this.createSocket();
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

  createSocket = async () => {
    this.cable = Cable.createConsumer('ws://localhost:3001/cable');
    this.chats = this.cable.subscriptions.create({
      channel: 'ChatChannel'
    }, {
      connected: () => {
        if (this.state.haveIAppeared === false) {
          this.chats.perform('appear', {
            id: this.props.currentUser.id
          })
          this.setState({
            haveIAppeared: true
          })
        }
      },
      disconnected: () => {
        // this.chats.perform('disappear', {
        //   userId: this.props.currentUser.id
        // })
        this.setState({
          haveIAppeared: false
        })
      },
      received: async (data) => {
        if (data.event) {
          if (data.event === 'appear') { //someone logged in
            if (!data.destination) {
              data.destination = 0
            }
            let tempLog = this.state.chatLogs2;
            tempLog[parseInt(data.destination)] = [...tempLog[parseInt(data.destination)], data]
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
              data.destination = 0
            }
            let tempLog = this.state.chatLogs2;
            tempLog[parseInt(data.destination)] = [...tempLog[parseInt(data.destination)], data]
            this.setState({
              chatLogs2: tempLog
            });
            this.props.removeFromUserList(data); //BAD but works fine for our purposes. (two different object comparison but id = id)
          }
        } else { // someone said a message
          // this.setState({ //OLD
          //   chatLogs: [...this.state.chatLogs, data]
          // });
          if (parseInt(data.destination) === 0) { // if intended for group append it to group log
            let tempLog = this.state.chatLogs2;
            tempLog[0] = [...tempLog[0], data]
            this.setState({
              chatLogs2: tempLog
            });

            //IF MESSAGE IS FOR YOU, DM. CHECK IF DM WITH THAT PERSON ALREADY EXISTS IF IT DOES APPEND TO THAT CHAT ARRAY, OTHERWISE CREATE A NEW ONE WITH THAT PERSONS NAME AND ID AS INDEX0 OF THAT ARRAY AND THEN APPEND FROM THERE.
          } else if (data.destination === this.props.currentUser.id) { //if for you specifically and not group
            //set message index from data.user_id
            if (this.state.messageIndex[data.user_id]) { // should really turn this into a helper function
              let index = this.state.messageIndex[data.user_id];
              let tempLog = this.state.chatLogs2;
              tempLog[index] = [...tempLog[index], data]
              this.setState({
                chatLogs2: tempLog
              })
            } else { //its the first message from this person or to this person
              let tempMessageIndex = this.state.messageIndex;
              tempMessageIndex[data.user_id] = this.state.chatLogs2.length;

              let index = this.state.messageIndex[data.user_id];
              let tempLog = this.state.chatLogs2;
              tempLog[index] = [data];
              this.setState({
                chatLogs2: tempLog
              })
            }
          } else if (data.user_id === this.props.currentUser.id) { //if from you specifically for someone else not the group
            //set message index from data.destination
            if (this.state.messageIndex[data.destination]) {
              let index = this.state.messageIndex[data.destination];
              let tempLog = this.state.chatLogs2;
              tempLog[index] = [...tempLog[index], data]
              this.setState({
                chatLogs2: tempLog
              })
            } else {
              let tempMessageIndex = this.state.messageIndex;
              tempMessageIndex[data.destination] = this.state.chatLogs2.length;

              let index = this.state.messageIndex[data.destination];
              let tempLog = this.state.chatLogs2;
              tempLog[index] = [data];
              this.setState({
                chatLogs2: tempLog
              })
            }
          }



          if (data.name !== this.props.currentUser.name) { //play audio cue
            this.props.playSound(this.imrcv);
          }

        }
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
    if (this.state.chatLogs2) {
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

  renderChatLog = () => {
    return this.state.chatLogs.map((el, key) => {
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
    // console.log(this.state.chatLogs2);
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
              {this.renderChatLog2(this.props.clickedPersonId)}
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
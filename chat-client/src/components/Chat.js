import React, { Component } from 'react'
//actioncable npm
import Cable from 'actioncable';
//api_helper
import { getTenMessages } from '../services/api_helper'

class Chat extends Component {
  constructor(props) {
    super(props)

    this.chatField = React.createRef();

    this.state = {
      chatLogs: [],
      currentChatMessage: '',
      lastAppearEvent: '',
      haveIAppeared: false
    }
  }

  componentDidMount() {
    this.createSocket();
    this.setRecentMessages();
  }

  componentDidUpdate() {
    this.scrollToBottom();
    if (this.props.hasActivelyLoggedOut === true) {
      // this.chats.perform('disappear', {
      //   userId: this.props.currentUser.id
      // })
      this.setState({
        haveIAppeared: false
      })
      this.chats.unsubscribe();
      this.props.setHasActivelyLoggedOut();
      this.props.setUser(null); //close chat component
    }
  }

  setRecentMessages = async () => {
    const data = await getTenMessages();
    data.map(user =>
      this.setState({
        chatLogs: [...this.state.chatLogs, user]
      })
    );
  }

  createSocket = () => {
    this.cable = Cable.createConsumer('ws://localhost:3001/cable');
    this.chats = this.cable.subscriptions.create({
      channel: 'ChatChannel'
    }, {
      connected: () => {
        if (this.state.haveIAppeared === false) {
          this.chats.perform('appear', {
            userId: this.props.currentUser.id
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
      received: (data) => {
        if (data.event) {
          if (data.event === 'appear') {
            // console.log(`${data.name} has entered the chat..`)
            this.setState({
              chatLogs: [...this.state.chatLogs, data]
            });
            this.props.addToUserList(data);
          }
          else if (data.event === 'disappear') {
            // console.log(`${data.name} has left the chat..`)
            this.setState({
              chatLogs: [...this.state.chatLogs, data]
            });
            this.props.removeFromUserList(data);
          }
        } else {
          this.setState({
            chatLogs: [...this.state.chatLogs, data]
          });
        }
      },
      create: function (chatContent, userId) {
        this.perform('create', {
          content: chatContent,
          created_by: userId
        });
      }
    });
  }

  updateCurrentChatMessage(event) {
    this.setState({
      currentChatMessage: event.target.value
    });
  }

  // handleAppearEvent = (logEvent) => {
  //   console.log("IM IN HANDLE APPEAR EVENT!")
  //   console.log(logEvent)
  //   let lastmsg = this.state.chatLogs[this.state.chatLogs.length - 2];
  //   console.log("last message: ");
  //   console.log(lastmsg);
  //   if (logEvent.event === 'appear' && lastmsg !== logEvent) {
  //     return (
  //       <li>
  //         <i>{logEvent.name} has entered the chat.</i>
  //       </li>
  //     )
  //   } else if (logEvent.event === 'disappear') {
  //     return (
  //       <li>
  //         <i>{logEvent.name} has left the chat.</i>
  //       </li>
  //     )
  //   }
  // }

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

  handleSendEvent(event) {
    event.preventDefault();
    this.chats.create(this.state.currentChatMessage, this.props.currentUser.id);
    this.setState({
      currentChatMessage: ''
    });
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
        <div className='chat-wrapper'>
          <div className='chat-window' ref={this.chatField}>
            <ul className='chat-log'>
              {this.renderChatLog()}
            </ul>
          </div>
          <textarea
            onKeyPress={(e) => this.handleChatInputKeyPress(e)}
            value={this.state.currentChatMessage}
            onChange={(e) => this.updateCurrentChatMessage(e)}
            placeholder='Enter your message...'
            className='chat-input' />
          <div className="chat-button-container">
            <button
              onClick={(e) => this.handleSendEvent(e)}
              className='send'>
              Send
            </button>
          </div>

        </div>
      </div>
    )
  }
}

export default Chat


// {el.event ?
//   el.event === 'appear' && this.state.lastAppearEvent !== el.name ?
//     <li>
//       <i>{el.name} has entered the chat.</i>
//     </li>
//     :
//     (el.event === 'disappear' &&
//       <li>
//         <i>{el.name} has left the chat.</i>
//       </li>)
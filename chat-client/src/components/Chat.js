import React, { Component } from 'react'
//actioncable npm
import Cable from 'actioncable';

class Chat extends Component {
  constructor(props) {
    super(props)

    this.state = {
      chatLogs: [],
      currentChatMessage: ''
    }
  }

  componentDidMount() {
    this.createSocket();
  }

  componentDidUpdate() {
    if (this.props.hasActivelyLoggedOut === true) {
      this.chats.perform('disappear', {
        userId: this.props.currentUser.id
      })
      // this.cable.disconnect();
      // this.cable.unsubscribe();
      this.chats.unsubscribe();
      // this.cable.unsubscribe({
      //   userId: this.props.currentUser.id
      // });
      console.log("FROM CHAT UPDATE FIRE")
      // this.chats.unsubscribe({
      //   userId: this.props.currentUser.id
      // });
      this.props.setHasActivelyLoggedOut();
      this.props.setUser(null);

    }
  }

  createSocket = () => {
    this.cable = Cable.createConsumer('ws://localhost:3001/cable');
    this.chats = this.cable.subscriptions.create({
      channel: 'ChatChannel'
    }, {
      connected: () => {
        // console.log(`from connected: ${data}`)
        this.chats.perform('appear', {
          userId: this.props.currentUser.id
        })
      },
      disconnected: () => {
        console.log("IM GONE DOG")
        // this.chats.perform('disappear', {
        //   userId: this.props.currentUser.id
        // })

      },
      received: (data) => {
        console.log(data);
        if (data.event) {
          if (data.event === 'appear') {
            console.log(`${data.name} has entered the chat..`)
            this.setState({
              chatLogs: [...this.state.chatLogs, data]
            });
            this.props.addToUserList(data.name);
          }
          else if (data.event === 'disappear') {
            console.log(`${data.name} has left the chat..`)
            this.setState({
              chatLogs: [...this.state.chatLogs, data]
            });
            this.props.removeFromUserList(data.name);
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

  renderChatLog() {
    return this.state.chatLogs.map((el, key) =>
      <div key={key}>
        {el.event ?
          el.event === 'appear' ?
            <li>
              <i>{el.name} has entered the chat.</i>
            </li>
            :
            <li>
              <i>{el.name} has left the chat.</i>
            </li>
          :
          <li key={`chat_${el.id}`}>
            {el.name === this.props.currentUser.name ?
              <span className='chat-your-name'>{el.name}</span>
              :
              <span className='chat-their-name'>{el.name}</span>
            }
            <span className='chat-created-at'>({el.created_at}): </span>
            <span className='chat-message'>{el.content}</span>
          </li>
        }
      </div>
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

  render() {
    console.log(this.props.hasActivelyLoggedOut)
    return (
      <div className="chat">
        <div className='chat-wrapper'>
          <div className='chat-window'>
            <ul className='chat-log'>
              {this.renderChatLog()}
            </ul>
          </div>
          <input
            onKeyPress={(e) => this.handleChatInputKeyPress(e)}
            value={this.state.currentChatMessage}
            onChange={(e) => this.updateCurrentChatMessage(e)}
            type='text'
            placeholder='Enter your message...'
            className='chat-input' />
          <button
            onClick={(e) => this.handleSendEvent(e)}
            className='send'>
            Send
          </button>
        </div>
      </div>
    )
  }
}

export default Chat
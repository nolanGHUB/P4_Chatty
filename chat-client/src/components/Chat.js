import React, { Component } from 'react'

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

  createSocket() {
    let cable = Cable.createConsumer('ws://localhost:3001/cable');
    this.chats = cable.subscriptions.create({
      channel: 'ChatChannel'
    }, {
      connected: () => { },
      received: (data) => {
        this.setState({
          chatLogs: [...this.state.chatLogs, data]
        });
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
    return this.state.chatLogs.map((el) =>
      <li key={`chat_${el.id}`}>
        <span className='chat-name'>{el.name}</span>
        <span className='chat-message'>{el.content}</span>
        <span className='chat-created-at'>{el.created_at}</span>
      </li>
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
    return (
      <div>
        <div className='stage'>
          <h1>Chat</h1>
          <div className='chat-logs'>
            <ul className='chat-logs'>
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
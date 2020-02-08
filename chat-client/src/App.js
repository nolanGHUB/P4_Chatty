import React, { Component } from 'react';
import { registerUser, verifyUser } from './services/api_helper'
import './App.css';
import Cable from 'actioncable';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentChatMessage: '',
      chatLogs: [],
      email: 'nolan@gmail.com',
      password: 'qwert'
    }
  }

  componentDidMount() {
    // verifyUser();
    this.createSocket();
    // if (localStorage.getItem('authToken')) {
    //   const name = localStorage.getItem('name');
    //   const email = localStorage.getItem('email');
    //   const user = { name, email };
    //   user && this.setState({
    //     currentUser: user
    //   })
    // }
  }

  handleRegister = async (e, registerData) => {
    e.preventDefault();
    const currentUser = await registerUser(registerData);
    if (!currentUser.errorMessage) {
      this.setState({
        currentUser
      })
      this.props.history.push('/todos')
    } else {
      this.setState({
        errorText: currentUser.errorMessage
      })
    }
  }

  updateCurrentChatMessage(event) {
    this.setState({
      currentChatMessage: event.target.value
    });
  }

  createSocket() {
    let cable = Cable.createConsumer('ws://localhost:3001/cable');
    this.chats = cable.subscriptions.create({
      channel: 'ChatChannel'
    }, {
      connected: () => { },
      received: (data) => {
        let chatLogs = this.state.chatLogs;
        chatLogs.push(data);
        this.setState({ chatLogs });
      },
      create: function (chatContent) {
        this.perform('create', {
          content: chatContent
        });
      }
    });
  }

  renderChatLog() {
    return this.state.chatLogs.map((el) => {
      return (
        <li key={`chat_${el.id}`}>
          <span className='chat-message'>{el.content}</span>
          <span className='chat-created-at'>{el.created_at}</span>
        </li>
      );
    });
  }

  handleSendEvent(event) {
    event.preventDefault();
    this.chats.create(this.state.currentChatMessage);
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
      <div className='App'>
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
    );
  }
}

export default App
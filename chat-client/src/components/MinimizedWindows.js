import React, { Component } from 'react'

export default class MinimizedWindows extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  handleWindowClick = (index, name) => {
    this.props.setDestination(index);
    this.props.setChatBar(name);
    //remove from unreadMessages
    this.props.removeFromUnreadMessages(index);
  }

  handleClassName = (windowId) => {

    let exists = null;

    if (this.props.unreadMessages) {
      exists = this.props.unreadMessages.find(id => id === windowId);
    }

    if (exists && this.props.destination !== exists) {
      return "minimizedwindows-blinkywindow";
    } else {
      return "minimizedwindows-window"
    }
  }

  render() {
    return (
      <div className="minimizedwindows-component">
        {this.props.chatWindows.map(window =>
          <div onClick={() => this.handleWindowClick(window.index, window.name)} className={this.handleClassName(window.index)} key={window.index}>
            {window.name}
          </div>
        )}
      </div>
    )
  }
}
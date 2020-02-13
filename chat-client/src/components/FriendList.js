import React, { Component } from 'react'

export default class FriendList extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  // componentDidMount() {
  //   this.props.setUserList();
  //   this.props.userList && this.props.setOnlineUserList();
  // }

  render() {
    return (
      <div className="friendlist-component">
        <div className="friendlist-tag-wrapper">
          <div className="friendlist-onlinetag">
            Online
        </div>
          <div className="friendlist-offlinetag">
            Offline
        </div>
        </div>

        <div className="friendlist">
          <div className="friendlist-buddy-title">Buddies Online:</div>
          {this.props.onlineUserList.length > 0 && this.props.onlineUserList.map(user =>
            <div className="friendlist-name" key={`onlineUser_${user.user_id}`}>
              {this.props.currentUser.name !== user.name && user.name}
            </div>
          )}
        </div>
      </div>
    )
  }
}
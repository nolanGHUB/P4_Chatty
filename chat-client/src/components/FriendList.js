import React, { Component } from 'react'
//custom components
import Modal from './Modal'

export default class FriendList extends Component {
  constructor(props) {
    super(props)

    this.buddy = React.createRef();
    this.people = React.createRef();

    this.state = {
      onlineText: "People",
      modal: false,
      topBarText: "Add Buddy",
      clickedPersonId: '',
      clickedPersonName: ''
    }
  }

  handlePeopleClick() {
    this.people.current.classList.add('friendlist-tag-people-on');
    this.people.current.classList.remove('friendlist-tag-people-off');
    this.buddy.current.classList.add("friendlist-tag-buddies-off");
    this.buddy.current.classList.remove("friendlist-tag-buddies-on");

    this.setState({
      onlineText: "People",
      topBarText: "Add Buddy"
    })
  }

  handleBuddyClick() {
    this.buddy.current.classList.add("friendlist-tag-buddies-on");
    this.buddy.current.classList.remove("friendlist-tag-buddies-off");
    this.people.current.classList.add('friendlist-tag-people-off');
    this.people.current.classList.remove('friendlist-tag-people-on');

    this.setState({
      onlineText: "Buddies",
      topBarText: "Remove Buddy"
    })
  }

  setErrorText = (errorText) => {
    // non functional function I dont want this to do anything but modal needs it for other uses in other components...
  }

  handleClickedBuddy = (user) => {
    // if (this.state.topBarText === "Add Buddy") {
    //   //add new friend methods
    //   this.setState({
    //     modal: true
    //   })
    // } else if (this.state.topBarText === "Remove Buddy") {
    //   //remove friend methods
    // }

    //make it so div can be colored blue! :)
    //move already-friend check to here instead.
    if (this.state.onlineText === "People") { //if clicking on a person not a friend
      //is this person already a friend???
      if (!this.props.friendList.some(friend => parseInt(friend.friend_id) === user.id)) {
        this.setState({
          clickedPersonId: user.id,
          clickedPersonName: user.name,
          modal: true
        })
      } else {
        this.setState({
          clickedPersonId: user.id,
          clickedPersonName: user.name
        })
      }
    } else {
      this.setState({
        clickedPersonId: user.id,
        clickedPersonName: user.name,
        modal: true
      })
    }

  }

  handleAddBuddy = () => {
    this.props.addToFriendList(this.state.clickedPersonId, this.state.clickedPersonName);
    this.toggleModal();
  }

  handleRemoveBuddy = () => {
    let friend = this.props.friendList.filter(friend => parseInt(friend.friend_id) === this.state.clickedPersonId); //returns array of length 1, friend is friend object **CAREFUL**
    this.props.removeFromFriendList(friend[0].id, this.state.clickedPersonId); //(friend ID friend object, USER ID to be removed user object.) - sorry.
  }

  toggleModal = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  render() {
    return (
      <div className="friendlist-component">
        {this.state.modal &&
          <Modal
            modal={this.state.modal}
            onClose={this.toggleModal}
            topBarText={this.state.topBarText}
            setErrorText={this.setErrorText}
          >
            {this.state.topBarText === "Add Buddy" ?
              <div>
                Add {this.state.clickedPersonName} to your Buddy List?
                <div className="friendlist-buttons"><button onClick={() =>
                  this.props.addToFriendList(this.state.clickedPersonId, this.state.clickedPersonName)} className="header-button">Yes</button>
                  <button onClick={this.toggleModal} className="header-button">No</button></div>
              </div>
              :
              <div>
                Remove {this.state.clickedPersonName} from your Buddy List?
                <div className="friendlist-buttons"><button onClick={this.handleRemoveBuddy} className="header-button">Yes</button>
                  <button onClick={this.toggleModal} className="header-button">No</button></div>
              </div>
            }

          </Modal>
        }
        <div className="friendlist-tag-wrapper">
          <div onClick={() => this.handlePeopleClick()} ref={this.people} className="friendlist-tag friendlist-tag-people-on">
            People
          </div>
          <div onClick={() => this.handleBuddyClick()} ref={this.buddy} className="friendlist-tag friendlist-tag-buddies-off">
            Buddies
          </div>
        </div>
        <div className="friendlist-wrapper">
          <div className="friendlist">
            <div className="friendlist-buddy-title">{this.state.onlineText} Online:</div>
            {this.props.onlineUserList && this.state.onlineText === "People" && this.props.onlineUserList.map(user =>
              <div onClick={() => {
                this.handleClickedBuddy(user);
              }} className="friendlist-name" key={`onlineUser_${user.id}`}>
                {this.props.currentUser.name !== user.name && user.name}
              </div>
            )}
            {this.props.onlineFriendList && this.state.onlineText === "Buddies" && this.props.onlineFriendList.map(user =>
              <div onClick={() => {
                this.handleClickedBuddy(user);
              }} className="friendlist-name" key={`onlineUser_${user.id}`}>
                {this.props.currentUser.name !== user.name && user.name}
              </div>
            )}
          </div>
        </div>
      </div >
    )
  }
}
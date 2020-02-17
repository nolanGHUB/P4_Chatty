import React, { Component } from 'react'
//custom components
import Modal from './Modal'
import UpdateUsername from './UpdateUsername'

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
      clickedPersonName: '',
      previousTarget: '',
      toggleUpdateNameModal: false,
      leftButtonText: 'Change Name',
      rightButtonText: 'Add Buddy',
      errorText: ''
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

  handleClickedBuddy = (user, e) => {
    if (this.state.previousTarget) {
      this.state.previousTarget.classList.remove('friendlist-name-selected');
      this.setState({
        previousTarget: e.target
      })
      e.target.classList.add('friendlist-name-selected');
    } else {
      e.target.classList.add('friendlist-name-selected');
      this.setState({
        previousTarget: e.target
      })
    }

    if (this.state.onlineText === "People") { //if clicking on a person not a friend
      //is this person already a friend?
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
    this.toggleModal();
  }

  setNameChange = (e) => {
    this.setState({
      toggleUpdateNameModal: true
    })
  }

  toggleModal = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  toggleUpdateNameModal = () => {
    this.setState({
      toggleUpdateNameModal: !this.state.toggleUpdateNameModal,
      errorText: ''
    });
  };

  setErrorText = (errorText) => {
    this.setState({
      errorText
    })
  }

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
                  this.handleAddBuddy()} className="header-button">Yes</button>
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
        {this.state.toggleUpdateNameModal &&
          <UpdateUsername
            currentUser={this.props.currentUser}
            updateStateListsForNewName={this.props.updateStateListsForNewName}
            toggleUpdateNameModal={this.toggleUpdateNameModal}
            setErrorText={this.setErrorText}
            errorText={this.state.errorText}
          />
        }
        {this.props.currentUser &&
          <div className="friendlist-header">
            <h4 className="friendlist-welcome-text">Welcome, {this.props.currentUser.name}</h4>
          </div>
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
              <div onClick={(e) => {
                this.handleClickedBuddy(user, e);
              }} className="friendlist-name" key={`onlineUser_${user.id}`}>
                {/* {this.props.currentUser.name !== user.name && user.name} */}
                {user.name}
              </div>
            )}
            {this.props.onlineFriendList && this.state.onlineText === "Buddies" && this.props.onlineFriendList.map(user =>
              <div onClick={(e) => {
                this.handleClickedBuddy(user, e);
              }} className="friendlist-name" key={`onlineUser_${user.id}`}>
                {this.props.currentUser.name !== user.name && user.name}
              </div>
            )}
          </div>
          <div className="friendlist-icons-wrapper">
            <button onClick={(e) => this.setNameChange(e)} className="chat-send">Username Change</button>
            <button className="friendlist-button chat-send friendlist-buttons">Direct Message</button>
            <button className="chat-send friendlist-buttons">{this.state.rightButtonText}</button>
          </div>
        </div>

      </div >
    )
  }
}
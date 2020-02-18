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
      clickedPersonName: '',
      previousTarget: '',
      toggleUpdateNameModal: false,
      addBuddyText: 'Add Buddy',
      removeBuddyText: 'Remove Buddy',
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
      topBarText: "Add Buddy",
      clickedPersonName: ''
    })
    this.props.setClickedPersonId(0);
    this.state.previousTarget && this.state.previousTarget.classList.remove('friendlist-name-selected');
  }

  handleBuddyClick() {
    this.buddy.current.classList.add("friendlist-tag-buddies-on");
    this.buddy.current.classList.remove("friendlist-tag-buddies-off");
    this.people.current.classList.add('friendlist-tag-people-off');
    this.people.current.classList.remove('friendlist-tag-people-on');

    this.setState({
      onlineText: "Buddies",
      topBarText: "Remove Buddy",
      clickedPersonName: ''
    })
    this.props.setClickedPersonId(0);
    this.state.previousTarget && this.state.previousTarget.classList.remove('friendlist-name-selected');
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
        this.props.setClickedPersonId(user.id)
        this.setState({
          clickedPersonName: user.name,
        })
      } else {
        this.props.setClickedPersonId(user.id)
        this.setState({
          clickedPersonName: user.name
        })
      }
    } else {
      this.props.setClickedPersonId(user.id)
      this.setState({
        clickedPersonName: user.name,
      })
    }
  }

  handleAddBuddy = () => {
    this.props.addToFriendList(this.props.clickedPersonId, this.state.clickedPersonName);
    this.toggleModal(); //to close
  }

  handleRemoveBuddy = () => {
    let friend = this.props.friendList.filter(friend => parseInt(friend.friend_id) === this.props.clickedPersonId); //returns array of length 1, friend is friend object **CAREFUL**
    this.props.removeFromFriendList(friend[0].id, this.props.clickedPersonId); //(friend ID friend object, USER ID to be removed user object.) - sorry.
    this.toggleModal(); // to close
  }

  addRemoveBuddyClick = () => {
    if (this.props.clickedPersonId !== 0 && this.state.onlineText === "People" && this.props.onlineFriendList.filter(user => user.id === this.props.clickedPersonId).length === 0) { // as long as you've clicked someone && theyre not already a buddy
      this.toggleModal();
    } else if (this.props.clickedPersonId !== 0 && this.state.onlineText === "Buddies") {
      this.toggleModal();
    }
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
    console.log(this.props.clickedPersonId);
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
            <button className="chat-send friendlist-buttons" onClick={this.addRemoveBuddyClick}>{this.state.onlineText === "Buddies" ? this.state.removeBuddyText : this.state.addBuddyText}</button>
          </div>
        </div>

      </div >
    )
  }
}
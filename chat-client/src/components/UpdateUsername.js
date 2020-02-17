import React, { Component } from 'react'
//api_helper
import { updateUsername } from '../services/api_helper'

export default class UpdateUsername extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      topBarText: "Update Username"
    }
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    })
  }

  handleNameUpdateSubmit = async (e) => {
    e.preventDefault();
    if (this.state.name && this.state.name.match(/^[A-Za-z0-9]+$/)) {
      const newName = await updateUsername(this.props.currentUser.id, this.state.name);
      if (newName.status === "SUCCESS") {
        this.props.updateStateListsForNewName(this.state.name)
        this.props.toggleUpdateNameModal();
      }
    } else if (this.state.name) { //exists but did not pass regex check.
      console.log("exists but did not pass regex check.")
      this.props.setErrorText("Name must contain letters or numbers only. No special characters.");
    } else { // had nothing entered at all.
      console.log("had nothing entered at all.")
      this.props.setErrorText("You must enter a new name before updating, it cannot be blank.");
    }
  }

  render() {
    return (
      <div className="updateusername-component">
        <div onClick={(e) => {
          if (e.target.classList.contains('modal'))
            this.props.toggleUpdateNameModal();
        }} className="modal">
          <div className="modal-inner">
            <div
              className="modal-button"
              onClick={e => {
                this.props.setErrorText("");
                this.props.toggleUpdateNameModal()
              }}>{this.state.topBarText}
              <div className='modal-button-box'>X</div>
            </div>
            <div className="modal-child">
              <div className="error-message">{this.props.errorText}</div>
              <form className="login-register-form" onSubmit={(e) => this.handleNameUpdateSubmit(e)}>
                <label htmlFor="name">New Name:</label>
                <input
                  type="text"
                  name="name"
                  value={this.state.name}
                  onChange={this.handleChange}
                  autoComplete="off"
                />
                <button className="header-button form-button">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

}
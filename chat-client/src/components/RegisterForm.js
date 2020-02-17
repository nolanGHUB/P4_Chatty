import React from 'react'
//api_helper
import { registerUser } from '../services/api_helper'

class RegisterForm extends React.Component {
  constructor(props) {
    super(props)

    this.usernameRef = React.createRef();

    this.state = {
      name: '',
      email: '',
      password: '',
    }
  }

  componentDidMount() {
    this.usernameRef.current.focus();
  }

  handleRegister = async (e, registerData) => {
    e.preventDefault();
    const currentUser = await registerUser(registerData);
    if (!currentUser.errorMessage) {
      this.props.setUser(currentUser)
      this.props.setUserList();
      this.props.setFriendList();
      this.props.toggleModal();
    } else {
      this.props.setErrorText(currentUser.errorMessage)
    }
  }

  handleChange = (e) => {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    })
  }

  render() {
    return (
      <div className="login-register">
        <img className="login-logo" alt="login aim logo" src="images/sign-on.png"></img>
        {this.props.errorText && <p>{this.props.errorText}</p>}
        <form className="login-register-form" onSubmit={(e) => this.handleRegister(e, this.state)}>
          <label htmlFor="name">Username: </label>
          <input
            ref={this.usernameRef}
            type="text"
            name="name"
            value={this.state.name}
            onChange={this.handleChange}
          />
          <label htmlFor="email">Email: </label>
          <input
            type="text"
            name="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
          <button className="header-button form-button">Register</button>
        </form>
      </div>
    )
  }
}

export default RegisterForm
import React, { Component } from 'react'
//Api calls
import { loginUser } from '../services/api_helper'

class LoginForm extends Component {
  constructor(props) {
    super(props)

    this.emailRef = React.createRef();

    this.state = {
      email: '',
      password: ''
    }
  }

  componentDidMount() {
    this.emailRef.current.focus();
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    })
  }

  handleLogin = async (e, loginData) => {
    e.preventDefault();
    const currentUser = await loginUser(loginData);
    if (!currentUser.errorMessage) {
      this.props.setUser(currentUser);
      this.props.setUserList();
      this.props.setFriendList();
      this.props.setErrorText('');
      this.props.toggleModal();
    } else {
      this.props.setErrorText(currentUser.errorMessage)
    }

  }

  render() {
    return (
      <div className="login-register">
        <img className="login-logo" alt="login aim logo" src="images/sign-on.png"></img>
        {this.props.errorText && <div className="error-message">{this.props.errorText}</div>}
        <form className="login-register-form" onSubmit={(e) =>
          this.handleLogin(e, { email: this.state.email, password: this.state.password })
        }>
          <label htmlFor="email">Email: </label>
          <input
            ref={this.emailRef}
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
          <button className="header-button form-button">Sign On</button>
        </form>
      </div>
    )
  }
}

export default LoginForm
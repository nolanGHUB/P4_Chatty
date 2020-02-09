import React from 'react'
//api_helper
import { registerUser } from '../services/api_helper'

class RegisterForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      email: '',
      password: '',
    }
  }

  handleRegister = async (e, registerData) => {
    e.preventDefault();
    const currentUser = await registerUser(registerData);
    if (!currentUser.errorMessage) {
      this.props.setUser(currentUser)
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
        {this.props.errorText && <p>{this.props.errorText}</p>}
        <form className="login-register-form" onSubmit={(e) => this.props.handleRegister(e, this.state)}>
          {/* <h2>Register!</h2> */}
          <label htmlFor="name">Username: </label>
          <input
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
          <button className="form-button">Register</button>
        </form>
      </div>
    )
  }
}

export default RegisterForm
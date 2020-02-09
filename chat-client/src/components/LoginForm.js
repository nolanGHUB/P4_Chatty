import React, { Component } from 'react'
//React-Router
import { Link } from 'react-router-dom'
//Api calls
import { loginUser } from '../services/api_helper'

class LoginForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: ''
    }
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
    this.props.setUser(currentUser);

    // this.props.history.push('/todos')
  }

  render() {
    return (
      <div>
        <form onSubmit={(e) =>
          this.handleLogin(e, { email: this.state.email, password: this.state.password })
        }>
          <h2>Login!</h2>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
          <button>Login</button>
          <Link to="/register">Register</Link>
        </form>
      </div>
    )
  }
}

export default LoginForm
import React from 'react'

//custom components
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import Modal from './Modal'

export default class Header extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      errorText: '',
      modal: false,
      formClicked: 'login',
      topBarText: 'Sign On'
    }
  }

  setErrorText = (errorText) => {
    this.setState({
      errorText
    })
  }

  handleLogout = () => {
    this.props.setUser(null)

    localStorage.removeItem('authToken');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('id');
  }

  toggleModal = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  render() {
    return (
      <div className="header">
        {this.props.currentUser ?
          <div>
            <h4>Welcome back, {this.props.currentUser.name}</h4>
            <button onClick={this.handleLogout}>Logout</button>
          </div>
          :
          <div className="header-buttons">
            <div onClick={(e) => {
              this.toggleModal();
              this.setState({
                formClicked: 'login',
                topBarText: 'Sign On'
              })
            }} className="header-button">LOG IN</div>
            <div onClick={(e) => {
              this.toggleModal();
              this.setState({
                formClicked: 'register',
                topBarText: 'Register'
              })
            }} className="header-button">SIGN UP</div>
            <Modal
              modal={this.state.modal}
              onClose={this.toggleModal}
              topBarText={this.state.topBarText}>
              {this.state.formClicked === 'login' ?
                <LoginForm
                  setUser={this.props.setUser}
                  setErrorText={this.setErrorText}
                  errorText={this.state.errorText}
                />
                :
                <RegisterForm
                  setUser={this.props.setUser}
                  setErrorText={this.setErrorText}
                  errorText={this.state.errorText}
                />
              }
            </Modal>
          </div>
        }
      </div>
    )
  }

}
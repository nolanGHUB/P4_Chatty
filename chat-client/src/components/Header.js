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

  toggleModal = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  render() {
    return (
      <div className="header">
        <div className="header-logo-and-welcome-wrapper">
          <div className="header-logo-div">
            <img className="header-logo-img" src="/images/aim-logo3.png" alt="retro aim-like logo"></img>
            <span className="header-logo-text">Chatty</span>
          </div>
          {this.props.currentUser && <h4 className="header-logo-welcome-text">Welcome back, {this.props.currentUser.name}</h4>}
        </div>

        {this.props.currentUser ?
          <div className="header-welcome">
            <div className="header-button" onClick={this.handleLogout}>Logout</div>
          </div>
          :
          <div className="header-buttons">
            <div onClick={(e) => {
              this.toggleModal();
              this.setState({
                formClicked: 'login',
                topBarText: 'Sign On'
              })
            }} className="header-button">Login</div>
            <div onClick={(e) => {
              this.toggleModal();
              this.setState({
                formClicked: 'register',
                topBarText: 'Register'
              })
            }} className="header-button">Register</div>
            <Modal
              modal={this.state.modal}
              onClose={this.toggleModal}
              topBarText={this.state.topBarText}
              setErrorText={this.setErrorText}>
              {this.state.formClicked === 'login' ?
                <LoginForm
                  setUser={this.props.setUser}
                  setErrorText={this.setErrorText}
                  errorText={this.state.errorText}
                  setUserList={this.props.setUserList}
                  currentUser={this.currentUser}
                />
                :
                <RegisterForm
                  setUser={this.props.setUser}
                  setErrorText={this.setErrorText}
                  errorText={this.state.errorText}
                  setUserList={this.props.setUserList}
                  currentUser={this.currentUser}
                />
              }
            </Modal>
          </div>
        }
      </div>
    )
  }

}
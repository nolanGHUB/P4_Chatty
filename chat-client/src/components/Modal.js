import React, { Component } from "react";

class Modal extends Component {

  render() {
    if (!this.props.modal) {
      return (
        null
      );
    }
    return (
      <div onClick={(e) => {
        if (e.target.classList.contains('modal'))
          this.props.onClose();
      }} className="modal">

        <div className="modal-inner">
          <div
            className="modal-button"
            onClick={e => {
              this.props.setErrorText("");
              this.props.onClose(e)
            }}>{this.props.topBarText}
            <div className='modal-button-box'>X</div>
          </div>
          <div className="modal-child">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default Modal
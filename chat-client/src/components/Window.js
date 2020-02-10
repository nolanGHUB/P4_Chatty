import React from 'react'

export default function Window(props) {
  return (
    <div>
      <div className="window">
        <div className="modal-inner">
          <div
            className="modal-button"
            onClick={e => { props.onClose(e) }}>{props.topBarText}
            <div className='modal-button-box'>X</div>
          </div>
          <div className="modal-child">
            {props.children}
          </div>
        </div>
      </div>
    </div>
  )
}
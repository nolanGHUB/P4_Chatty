import React from 'react'

export default function Window(props) {
  return (
    <div>
      <div className="window">
        <div className="modal-inner">
          <div className="modal-button">{props.topBarText}
            <div onClick={e => { props.onClose(e) }} className='modal-button-box'>X</div>
          </div>
          <div className="modal-child">
            {props.children}
          </div>
        </div>
      </div>
    </div>
  )
}
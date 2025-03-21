import React from 'react'
import { Card } from 'react-bootstrap'
import message from '../../../public/Image/message.png'

const Takecontrol = () => {
  return (
    <div className="mb-4 bg-white p-3">
    <Card.Body className="d-flex align-items-center gap-3 border-none">
      <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
        <span className="fs-5" >
            <img src={message} alt="" />
        </span>
      </div>
      <div>
        <div className="fw-medium">Take Control, Stay infor...</div>
        <div className="small text-muted">Add your email to get the  latest from Opay</div>
      </div>
      <div>
        <button className='btn btn-success px-3' >GO</button>
      </div>
    </Card.Body>
  </div>
  )
}

export default Takecontrol
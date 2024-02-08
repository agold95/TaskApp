import React from 'react'
import PropTypes from 'prop-types'

function Notification({ info }) {
  if (!info.message) {
    return
  }

  // eslint-disable-next-line consistent-return
  return (
    <div className={`alert text-center ${info.type === 'error' ? 'alert-danger' : 'alert-primary'}`}>
      <h5 className="m-0">{info.message}</h5>
    </div>
  )
}

Notification.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  info: PropTypes.object.isRequired,
}

export default Notification

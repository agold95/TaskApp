import PropTypes from 'prop-types'

const Notification = ({ info }) => {
  if (!info.message) {
    return
  }

  return <div className={`alert text-center ${info.type === 'error' ? 'alert-danger' : 'alert-primary'}`}><h5 className='m-0'>{info.message}</h5></div>
}

Notification.propTypes = {
    info: PropTypes.object.isRequired
}

export default Notification
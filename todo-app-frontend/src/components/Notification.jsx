import PropTypes from 'prop-types'

const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }
  return <div className="alert alert-primary text-center">{notification}</div>
}

Notification.propTypes = {
  notification: PropTypes.node
}

export default Notification

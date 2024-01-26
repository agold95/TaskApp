const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }
  return <div className="alert alert-primary text-center">{notification}</div>
}

export default Notification

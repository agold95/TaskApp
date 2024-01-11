const Notification = ({ notification }) => {
  if (notification === null) {
    return null;
  }
  return <div className="message text-center text-danger">{notification}</div>;
}

export default Notification;

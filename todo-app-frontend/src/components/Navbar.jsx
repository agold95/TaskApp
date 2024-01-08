import Logout from "./Logout"

const Navbar = ({ user, username, handleLogout }) => {
    return (
      <div className="navbar">
        <h1>Task App</h1>
        <p>{user.name} logged in</p>
        <Logout username={username} handleLogout={handleLogout} />
      </div>
    )
}

export default Navbar
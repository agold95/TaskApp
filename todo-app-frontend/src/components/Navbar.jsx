import Logout from "./Logout"

// bootstrap components
import { Container, Navbar } from "react-bootstrap"

const NavbarComponent = ({ user, username, handleLogout }) => {
    return (
      <Navbar className="bg-body-tertiary">
        <Container></Container>
        <Container className="justify-content-center">
          <Navbar.Brand>Task App</Navbar.Brand>
        </Container>
        <Container className="pl-0">
          <Navbar.Text></Navbar.Text>
          <Navbar.Text>{user.username} logged in</Navbar.Text>
          <Logout username={username} handleLogout={handleLogout} />
        </Container>
      </Navbar>
    )
}

export default NavbarComponent
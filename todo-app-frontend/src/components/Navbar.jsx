// bootstrap components
import { Container, Navbar, Button } from "react-bootstrap"

const NavbarComponent = ({ user, handleLogout }) => {
    return (
      <Navbar className="bg-secondary">
        <Container></Container>
        <Container className="justify-content-center align-items-center align-self-center">
          <Navbar.Brand className="m-0 p-0">TaskApp</Navbar.Brand>
        </Container>
        <Container className="pl-0">
          <Navbar.Text></Navbar.Text>
          <Navbar.Text>{user.username} logged in</Navbar.Text>
          <Button variant="outline-dark" size="sm" title="logout" onClick={handleLogout}>Logout</Button>
        </Container>
      </Navbar>
    )
}

export default NavbarComponent
import React from 'react'
import PropTypes from 'prop-types'

// bootstrap components
import { Container, Navbar, Button } from 'react-bootstrap'

function NavbarComponent({
  user,
  handleLogout,
}) {
  return (
    <Navbar className="navbar border-bottom border-dark">
      <Container />
      <Container className="justify-content-center align-items-center align-self-center">
        <Navbar.Brand className="m-0 p-0">TaskApp</Navbar.Brand>
      </Container>
      <Container className="pl-0">
        <Navbar.Text />
        <Navbar.Text>
          {user.username}
          {' '}
          logged in
        </Navbar.Text>
        <Button variant="outline-dark" size="sm" title="logout" onClick={handleLogout}>Logout</Button>
      </Container>
    </Navbar>
  )
}

NavbarComponent.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  user: PropTypes.object.isRequired,
  handleLogout: PropTypes.func.isRequired,
}

export default NavbarComponent

import PropTypes from 'prop-types'

// bootstrap components
import { Button, Container, Form } from 'react-bootstrap'

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => {
  return (
    <Container className='d-flex flex-column align-items-center'>
      <h2 className='pb-2'>Login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Text>Username</Form.Text>
          <Form.Control
            id='username'
            value={username}
            required
            placeholder='Enter username'
            onChange={handleUsernameChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Text>Password</Form.Text>
          <Form.Control
            id='password'
            type="password"
            value={password}
            required
            placeholder='Enter password'
            onChange={handlePasswordChange}
          />
        </Form.Group>
        <div className=' p-2 d-flex justify-content-end'>
          <Button id='login-button' type="submit">Login</Button>
        </div>
      </Form>
    </Container>
  )
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm
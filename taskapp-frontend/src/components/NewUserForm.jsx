import PropTypes from 'prop-types'

// bootstrap components
import { Button, Container, Form } from 'react-bootstrap'

const NewUserForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  handlePasswordConfirmationChange,
  username,
  password,
  passwordConfirmation
}) => {
  return (
    <Container className='d-flex flex-column align-items-center'>
      <h2 className='pb-2'>Create an account</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Text>Username</Form.Text>
          <Form.Control
            id='new-user-username'
            value={username}
            required
            minLength='3'
            maxLength='25'
            placeholder='Enter username'
            onChange={handleUsernameChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Text>Password</Form.Text>
          <Form.Control
            id='new-user-password'
            type="password"
            value={password}
            required
            placeholder='Enter password'
            onChange={handlePasswordChange}
          />
        </Form.Group>
          <Form.Group>
          <Form.Text>Confirm Password</Form.Text>
          <Form.Control
            id='new-user-password-confirmation'
            type="password"
            value={passwordConfirmation}
            required
            placeholder='Enter password confirmation'
            onChange={handlePasswordConfirmationChange}
          />
        </Form.Group>
        <div className='p-2 d-flex justify-content-end'>
          <Button id='new-user-button' type="submit">Create account</Button>
        </div>
      </Form>
    </Container>
  )
}

NewUserForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  handlePasswordConfirmationChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  passwordConfirmation: PropTypes.string.isRequired
}

export default NewUserForm
import PropTypes from 'prop-types'

const NewUserForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  handleNameChange,
  username,
  password,
  name
}) => {
  return (
    <div>
      <h2>Create an account</h2>

      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            id='new-user-username'
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          password
          <input
            id='new-user-password'
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <div>
          name
          <input
            id='new-user-name'
            value={name}
            onChange={handleNameChange}
          />
        </div>
        <button id='new-user-button' type="submit">create</button>
      </form>
    </div>
  )
}

NewUserForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  handleNameChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
}

export default NewUserForm
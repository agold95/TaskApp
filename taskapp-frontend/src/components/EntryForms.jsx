import { useState } from 'react'
import PropTypes from 'prop-types'

// services
import taskService from '../services/tasks'
import loginService from '../services/login'
import usersService from '../services/users'

// components
import LoginForm from "./LoginForm"
import NewUserForm from "./NewUserForm"

// bootstrap components
import { Button, Spinner } from "react-bootstrap"

const EntryForms = ({
    setUser,
    notify
}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [loginVisible, setLoginVisible] = useState(false)
    const [loading, setLoading] = useState(false)

    // login handling
    const handleLogin = async (event) => {
      event.preventDefault()
      setLoading(true)
      try {
        const user = await loginService.login({
            username, password
        })
        window.localStorage.setItem(
            'loggedTaskAppUser', JSON.stringify(user)
        ) 
        taskService.setToken(user.token)
        setUser(user)
        setUsername('')
        setPassword('')
        notify(`${user.username} successfully logged in!`)
        } catch (error) {
        console.log(error)
        notify(`${error.response.data.error}`, 'error')
        setUsername('')
        setPassword('')
        } finally {
          setLoading(false)
      }
    }

    // new user handling
    const handleNewUser = async (event) => {
      event.preventDefault()
      setLoading(true)
      try {
        const newUser = await usersService.newUser({
            username, password, passwordConfirmation
        })
        taskService.setToken(newUser.token)
        setUsername('')
        setPassword('')
        setPasswordConfirmation('')
        setLoginVisible(false)
        notify(`New user ${newUser.username} created!`)
      } catch (error) {
        console.log(error)
        setUsername('')
        setPassword('')
        setPasswordConfirmation('')
        notify(`${error.response.data.error}`, 'error')
      } finally {
        setLoading(false)
      }
    }

    // clears fields on form switch
    const formSwitch = () => {
        if (loginVisible) {
        setLoginVisible(false)
        setUsername('')
        setPassword('')
        } else {
        setLoginVisible(true)
        setUsername('')
        setPassword('')
        setPasswordConfirmation('')
        }
    }

    // renders forms on button switch
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div className="d-flex flex-column align-items-center">
        <h1 className="p-5 m-5">Welcome to TaskApp</h1>
        <div>
          <p>Log in or create a new account to start using!</p>
        </div>
        {/* adds a spinner for loading */}
        {loading ? (
          <div className='p-5 m-5'>
            <Spinner as="span" animation="border" role="status" aria-hidden="true" variant='primary' style={{ width: '3rem', height: '3rem'}} />
          </div>
        ) : (
          <div className="p-5">
            <div style={hideWhenVisible}>
              <LoginForm
                username={username}
                password={password}
                handleUsernameChange={({ target }) => setUsername(target.value)}
                handlePasswordChange={({ target }) => setPassword(target.value)}
                handleSubmit={handleLogin}
              />
              <div className="p-5">
                <Button variant="success" size="sm" onClick={() => formSwitch()}>Create a new account</Button>
              </div>
            </div>
            <div style={showWhenVisible}>
              <NewUserForm
                username={username}
                password={password}
                passwordConfirmation={passwordConfirmation}
                handleUsernameChange={({ target }) => setUsername(target.value)}
                handlePasswordChange={({ target }) => setPassword(target.value)}
                handlePasswordConfirmationChange={({ target }) => setPasswordConfirmation(target.value)}
                handleSubmit={handleNewUser}
              />
              <div className="p-5">
                <Button variant="info" size="sm" onClick={() => formSwitch()}>Log in to an existing account</Button>
              </div>
            </div>
        </div>
        )}
      </div>
    )
}

EntryForms.propTypes = {
  setUser: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired
}

export default EntryForms
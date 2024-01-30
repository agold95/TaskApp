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
import { Button } from "react-bootstrap"

const EntryForms = ({
    setNotification,
    setUser
}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [loginVisible, setLoginVisible] = useState(false)

    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    // login handling
    const handleLogin = async (event) => {
        event.preventDefault()
        try {
        const user = await loginService.login({
            username, password
        })
        window.localStorage.setItem(
            'loggedTaskappUser', JSON.stringify(user)
        ) 
        taskService.setToken(user.token)
        setUser(user)
        setUsername('')
        setPassword('')
        setNotification(`${user.username} successfully logged in!`)
        setTimeout(() => {
            setNotification(null)
        }, 5000)
        } catch (error) {
        console.log(error)
        setNotification(`${error.response.data.error}`)
        setUsername('')
        setPassword('')
        setTimeout(() => {
            setNotification(null)
        }, 5000)
        }
    }

    // new user handling
    const handleNewUser = async (event) => {
        event.preventDefault()
        try {
        const newUser = await usersService.newUser({
            username, password, passwordConfirmation
        })
        taskService.setToken(newUser.token)
        setUsername('')
        setPassword('')
        setPasswordConfirmation('')
        setLoginVisible(false)
        setNotification(`New user ${newUser.username} created!`)
        setTimeout(() => {
            setNotification(null)
        }, 5000)
        } catch (error) {
        console.log(error)
        setUsername('')
        setPassword('')
        setPasswordConfirmation('')
        setNotification(`${error.response.data.error}`)
        setTimeout(() => {
            setNotification(null)
        }, 5000)
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

    return (
      <div className="d-flex flex-column align-items-center">
        <h1 className="p-5 m-5">Welcome to TaskApp</h1>
        <div>
          <p>Log in or create a new account to start using!</p>
        </div>
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
      </div>
    )
}

EntryForms.propTypes = {
    setNotification: PropTypes.func.isRequired,
    setUser: PropTypes.func.isRequired
}

export default EntryForms
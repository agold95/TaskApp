import { useState, useEffect } from "react"

// services
import taskService from './services/tasks'
import loginService from './services/login'
import usersService from './services/users'

// components
import LoginForm from "./components/LoginForm"
import Tasks from "./components/Tasks"
import NewUserForm from "./components/NewUserForm"
import NavbarComponent from "./components/Navbar"
import Notification from "./components/Notification"

// bootstrap components
import { Button } from "react-bootstrap"

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loginVisible, setLoginVisible] = useState(false)
  const [notification, setNotification] = useState(null)

  // initializes all tasks and sorts by users username
  useEffect(() => {
    if (user) {
      taskService
        .getAll()
        .then(initialTasks => {
          const userTasks = initialTasks.filter(task => task.user.username === user.username)
          setTasks(userTasks)
        })
      }
  }, [user])

  // sets users json web token
  useEffect(() => {
    // sets local storage to remember user
    const loggedUserJSON = window.localStorage.getItem('loggedTaskappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      taskService.setToken(user.token)
    }
  }, [])

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

  // logout handling
  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  // add task handling
  const addTask = (taskObject) => {
   taskService.create(taskObject).then((returnedTask) => {
     setTasks(tasks.concat(returnedTask))
     setNotification('Task added!')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    })
  }

  // remove task handling
  const removeTask = async (task) => {
    await taskService.remove(task.id)

    let tasks = await taskService.getAll()
    const userTasks = tasks.filter(task => task.user.username === user.username)
    setTasks(userTasks)
    setNotification('Task removed!')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
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

  // if not signed in, return the login/new user forms
  if (user === null) {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div className="d-flex flex-column align-items-center">
        <h1 className="p-5 m-5">Welcome to Task App</h1>
        <div>
          <p>Login or create a new account to start using!</p>
        </div>
        <div className="p-5">
          <Notification notification={notification} />
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

  return (
    <div>
      <NavbarComponent user={user} username={username} handleLogout={handleLogout} />
      <div>
        <Notification notification={notification} />
        <Tasks tasks={tasks} addTask={addTask} removeTask={removeTask} />
      </div>
    </div>
  )
}

export default App
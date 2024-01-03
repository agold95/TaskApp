import { useState, useEffect, useRef } from "react"
import { Routes, Route, Link, Navigate, useMatch } from "react-router-dom"

// components
import LoginForm from "./components/LoginForm"
import Tasks from "./components/Tasks"
import NewUserForm from "./components/NewUserForm"

// services
import taskService from './services/tasks'
import loginService from './services/login'
import usersService from './services/users'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])

  // initializes all tasks
  useEffect(() => {
    taskService
      .getAll()
      .then(initialTasks => {
        setTasks(initialTasks)
      })
  }, [])

  // sets users json web token
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
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
        username, password,
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
    }
  }

  // login form
  const loginForm = () => {
    return (
      <div>
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </div>
    )
  }

  // new user handling
  
  const handleNewUser = async (event) => {
    event.preventDefault()
    try {
      const newUser = await usersService.newUser({
        username, password, name,
      })
      window.localStorage.setItem(
        'loggedTaskappUser', JSON.stringify(newUser)
      ) 
      taskService.setToken(newUser.token)
      setUser(newUser)
      setUsername('')
      setPassword('')
      setName('')
    } catch (error) {
      console.log(error)
    }
  }

  // new user form
  const newUserForm = () => {
    return (
      <div>
        <NewUserForm
          username={username}
          password={password}
          name={name}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleNameChange={({ target }) => setName(target.value)}
          handleSubmit={handleNewUser}
        />
      </div>
    )
  }

  // logout handling
  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  // if not signed in, return the login/new user form
  if (user === null) {
    return (
      <div>
        <h1>Welcome to Note App!</h1>
        {loginForm()}
        <br />
        { newUserForm() }
      </div>
    )
  }

  return (
    <div>
      <h1>Tasks</h1>
      {user && <div>
        <p>{user.name} logged in</p>
        <button onClick={handleLogout}>logout</button>
        </div>
        }
      <Tasks tasks={tasks} />
    </div>
  )
}

export default App

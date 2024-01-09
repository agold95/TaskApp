import { useState, useEffect, useRef } from "react"
import { Routes, Route, Link, Navigate, useMatch } from "react-router-dom"

// components
import LoginForm from "./components/LoginForm"
import Tasks from "./components/Tasks"
import NewUserForm from "./components/NewUserForm"
import Navbar from "./components/Navbar"

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
  const [loginVisible, setLoginVisible] = useState(false)

  // initializes all tasks
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

  // logout handling
  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  // add task handling
  const addTask = async (taskObject) => {
    await taskService.create(taskObject).then((returnedTask) => {
      setTasks(tasks.concat(returnedTask))
    })
  }

  // remove task handling
  const removeTask = async (task) => {
    await taskService.remove(task.id)

    let tasks = await taskService.getAll()
    const userTasks = tasks.filter(task => task.user.username === user.username)
    setTasks(userTasks)
  }

  // if not signed in, return the login/new user forms
  if (user === null) {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <h1>Welcome to Task App!</h1>
        <div style={hideWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(true)}>Create a new account</button>
        </div>
        <div style={showWhenVisible}>
          <NewUserForm
            username={username}
            password={password}
            name={name}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleNameChange={({ target }) => setName(target.value)}
            handleSubmit={handleNewUser}
          />
          <button onClick={() => setLoginVisible(false)}>Log in to an existing account</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar user={user} username={username} handleLogout={handleLogout} />
      <div>
        <Tasks tasks={tasks} addTask={addTask} removeTask={removeTask} />
      </div>
    </div>
  )
}

export default App
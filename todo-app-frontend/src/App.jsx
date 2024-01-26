import { useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode"

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
  const [pastDueTasks, setPastDueTasks] = useState([])
  const [loginVisible, setLoginVisible] = useState(false)
  const [notification, setNotification] = useState(null)

  // checks user token every minute for expiration
  useEffect(() => {
    // decodes token expiration time
    const isTokenExpired = token => {
      const decodedToken = jwtDecode(token)
      //console.log('Token expires in:', decodedToken.exp * 1000 - Date.now(), 'seconds')
      return decodedToken.exp * 1000 < Date.now()
    }
    // logs user out if token is expired
    const interval = setInterval(() => {
      if (user && isTokenExpired(user.token)) {
        handleLogout()
        setNotification('Session expired, please log in again.')
      }
    }, 60000)

    return () => clearInterval(interval)
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

    // initializes users tasks
    useEffect(() => {
      const getTasks = async () => {
        if (user) {
          try {
            const userTasks = await taskService.getAll()
            const sortedTasks = [...userTasks].sort(
              (a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            setTasks(sortedTasks)
          } catch (error) {
            setNotification(`${error.response.data.error}`)
            setTimeout(() => {
              setNotification(null)
            }, 5000)
          }
        }
      }
      getTasks()
    }, [user])

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

  // logout handling
  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
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

  // add task handling
  const addTask = async (newTask) => {
    try {
      const createdTask = await taskService.create(newTask)
      setTasks(tasks.concat(createdTask))
      setNotification('Task added!')
          setTimeout(() => {
            setNotification(null)
          }, 5000)
    } catch (error) {
      setNotification(`${error.response.data.error}`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  // update task handling
  const updateTask = async (id, task) => {
    try {
      const taskToUpdate = { ...task, content: task.content, deadline: task.deadline }
      await taskService.update(id, taskToUpdate)
      
      let tasks = await taskService.getAll()
      const sorted = [...tasks].sort((a, b) => {
            return new Date(a.createdAt) - new Date(b.createdAt)
        })
      setTasks(sorted)
      setNotification('Task updated!')
        setTimeout(() => {
          setNotification(null)
        }, 5000)
    } catch (error) {
      console.log(error)
      setNotification(`${error.response.data.error}`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  // remove task handling
const removeTask = async (task) => {
  try {
    await taskService.remove(task.id)
    let tasks = await taskService.getAll()
    const sorted = [...tasks].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

    // Filters pastDueTasks based on the updated list of tasks
    const updatedPastDueTasks = pastDueTasks.filter((pastDueTask) => pastDueTask.id !== task.id)
    setTasks(sorted)
    setPastDueTasks(updatedPastDueTasks)
    setNotification('Task removed!')
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  } catch (error) {
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
      <NavbarComponent user={user} handleLogout={handleLogout} />
      <Notification notification={notification} />
      <div className="d-flex justify-content-center">
        <Tasks
          tasks={tasks}
          setTasks={setTasks}
          addTask={addTask}
          updateTask={updateTask}
          removeTask={removeTask}
          pastDueTasks={pastDueTasks}
          setPastDueTasks={setPastDueTasks}
        />
      </div>
    </div>
  )
}

export default App
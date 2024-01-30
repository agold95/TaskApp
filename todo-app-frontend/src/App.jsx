import { useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode"

// services
import taskService from './services/tasks'

// components
import Tasks from "./components/Tasks"
import NavbarComponent from "./components/Navbar"
import Notification from "./components/Notification"
import EntryForms from "./components/EntryForms"

function App() {
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
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
    }, 1 * 60 * 1000)

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
          }, 1 * 5 * 1000)
        }
      }
    }
    getTasks()
  }, [user])

  // logout handling
  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  // if not signed in, return the login/new user forms
  if (user === null) {
    return (
      <div>
        <Notification notification={notification} />
        <EntryForms 
          setUser={setUser}
          setNotification={setNotification}
        />
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
          setNotification={setNotification}
        />
      </div>
    </div>
  )
}

export default App
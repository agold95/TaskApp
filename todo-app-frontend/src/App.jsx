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

  // decodes token expiration time
  const isTokenExpired = token => {
    const decodedToken = jwtDecode(token)
    //console.log('Token expires in:', decodedToken.exp * 1000 - Date.now(), 'seconds')
    return decodedToken.exp * 1000 < Date.now()
  }

  // logout handling
  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  // checks user token every 3 seconds for expiration
  useEffect(() => {
    const tokenCheckInterval = setInterval(() => {
      // logs user out if token is expired
      if (user && isTokenExpired(user.token)) {
        handleLogout()
        setNotification("Session expired, please log in again.")
      }
    }, 3000)

    return () => clearInterval(tokenCheckInterval)
  }, [user])

  // sets users web token from local storage
  useEffect(() => {
    const setTokenFromLocalStorage = () => {
      const loggedUserJSON = window.localStorage.getItem("loggedTaskAppUser")
      if (loggedUserJSON) {
        try {
          const storedUser = JSON.parse(loggedUserJSON)
          setUser(storedUser)
          taskService.setToken(storedUser.token)
        } catch (error) {
          setNotification(`${error.response.data.error}`)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        }
      }
    }

    setTokenFromLocalStorage()
  }, [])

  // initializes users tasks
  useEffect(() => {
    const getTasks = async () => {
      try {
        const userTasks = await taskService.getAll()
        const sortedTasks = [...userTasks].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        )
        setTasks(sortedTasks)
      } catch (error) {
        setNotification(`${error.response.data.error}`)
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      }
    }

    if (user) {
      getTasks()
    }
  }, [user])

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
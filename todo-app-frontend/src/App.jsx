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
  const [info, setInfo] = useState({ message: null })

  // notification handling
  const notify = (message, type = 'info') => {
    setInfo({ message, type })
    setTimeout(() => {
      setInfo({ message: null })
    }, 5000)
  }

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
        notify("Session expired, please log in again.", 'error')
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
          notify(`${error.response.data.error}`, 'error')
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
        notify(`${error.response.data.error}`, 'error')
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
        <Notification info={info} />
        <EntryForms 
          setUser={setUser}
          notify={notify}
        />
    </div>
    )
  }

  return (
    <div>
      <NavbarComponent user={user} handleLogout={handleLogout} />
      <Notification info={info} />
      <div className="d-flex justify-content-center">
        <Tasks
          tasks={tasks}
          setTasks={setTasks}
          notify={notify}
        />
      </div>
    </div>
  )
}

export default App
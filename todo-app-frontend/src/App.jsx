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
  const [pastDueTasks, setPastDueTasks] = useState([])
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
            }, 5000)
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
      setNotification('Task completed!')
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
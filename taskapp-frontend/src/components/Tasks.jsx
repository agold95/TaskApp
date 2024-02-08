import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

// bootstrap components
import { Container } from 'react-bootstrap'

// MDI components
import Icon from '@mdi/react'
import { mdiPlusCircle, mdiMinusCircle } from '@mdi/js'

// components
import Task from './Task'
import TaskForm from './TaskForm'
import TaskSort from './TaskSort'

// services
import taskService from '../services/tasks'

function Tasks({
  tasks,
  setTasks,
  notify,
}) {
  const [taskFormVisible, setTaskFormVisible] = useState(false)
  const [pastDueTasks, setPastDueTasks] = useState([])

  // useEffect hook for rending tasks
  useEffect(() => {
    setTasks(tasks)
    const updatedPastDueTasks = tasks.filter(
      (task) => task.deadline !== null && new Date(task.deadline) < Date.now(),
    )
    setPastDueTasks(updatedPastDueTasks)
  }, [tasks, setTasks])

  // add task handling
  const addTask = async (newTask) => {
    try {
      const createdTask = await taskService.create(newTask)
      setTasks(tasks.concat(createdTask))
      notify('Task added!')
    } catch (error) {
      notify(`${error.response.data.error}`, 'error')
    }
  }

  // displays amount of tasks that are past due, if applicable
  const pastDueDisplay = () => {
    const taskCount = pastDueTasks.length

    return taskCount > 0 ? (
      <h3 className="text-danger alert alert-danger m-0 border-2">
        {`You have ${taskCount} task${taskCount === 1 ? '' : 's'} that ${taskCount === 1 ? 'is' : 'are'} past due!`}
      </h3>
    ) : null
  }

  // renders forms on button switch
  const hideWhenVisible = { display: taskFormVisible ? 'none' : '' }
  const showWhenVisible = { display: taskFormVisible ? '' : 'none' }

  return (
    <Container className="m-2 p-2 col-md-6">
      <h1>Tasks</h1>
      <div className="m-3 p-3 text-center">
        {tasks.length <= 0 && (
        <h3 className="p-2 alert alert-primary">You have no tasks, click the button to create one!</h3>
        )}
        {pastDueDisplay()}
      </div>
      <Container className="d-flex flex-column align-items-end">
        <Container>
          <div>
            <div style={showWhenVisible}>
              <div className="d-flex justify-content-center p-3">
                <Icon className="minus" title="Close task form" path={mdiMinusCircle} size={3} onClick={() => setTaskFormVisible(false)}>Hide new task form</Icon>
              </div>
              <TaskForm setTaskFormVisible={setTaskFormVisible} createTask={addTask} />
            </div>
            <div style={hideWhenVisible}>
              <div className="d-flex justify-content-center p-3">
                <Icon className="plus" title="Add task" path={mdiPlusCircle} size={3} onClick={() => setTaskFormVisible(true)}>Add a new task</Icon>
              </div>
            </div>
          </div>
          {tasks.length > 0 && (
            <TaskSort tasks={tasks} setTasks={setTasks} />
          )}
          {tasks.map((task) => (
            <Task
              key={task.id}
              task={task}
              pastDueTasks={pastDueTasks}
              setPastDueTasks={setPastDueTasks}
              setTasks={setTasks}
              notify={notify}
            />
          ))}
        </Container>
      </Container>
    </Container>
  )
}

Tasks.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  tasks: PropTypes.array.isRequired,
  setTasks: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
}

export default Tasks

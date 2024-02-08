import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

// bootstrap components
import { Container, Spinner } from 'react-bootstrap'

// MDI components
import Icon from '@mdi/react'
import { mdiSquareEditOutline, mdiCheckboxMarkedOutline, mdiAlertBoxOutline } from '@mdi/js'

// components
import EditTaskForm from './EditTaskForm'

// services
import taskService from '../services/tasks'

function Task({
  task,
  pastDueTasks,
  setPastDueTasks,
  setTasks,
  notify,
}) {
  const [taskFormVisible, setTaskFormVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  // evaluates deadline and current time to determine if task is past due or not, then renders it
  useEffect(() => {
    if (task.deadline !== null) {
      const isTaskPastDue = new Date(task.deadline) < Date.now()
      const isTaskAlreadyAdded = pastDueTasks.some((pastDueTask) => pastDueTask.id === task.id)

      if (isTaskPastDue && !isTaskAlreadyAdded) {
        setPastDueTasks((prevPastDueTasks) => [...prevPastDueTasks, task])
      } else if (!isTaskPastDue && isTaskAlreadyAdded) {
        setPastDueTasks((prevPastDueTasks) => prevPastDueTasks.filter(
          (pastDueTask) => pastDueTask.id !== task.id,
        ))
      }
    }
  }, [task, pastDueTasks, setPastDueTasks])

  const pastDueTasksHandler = () => (task.deadline !== null && new Date(task.deadline) < Date.now()
    ? <Icon title="This task is past due!" className="alert-box" path={mdiAlertBoxOutline} size={3} />
    : null)

  // update task handling
  const updateTask = async (id) => {
    try {
      const taskToUpdate = { ...task, content: task.content, deadline: task.deadline }
      await taskService.update(id, taskToUpdate)

      const tasks = await taskService.getAll()
      const sorted = [...tasks].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      setTasks(sorted)
      notify('Task updated!')
    } catch (error) {
      console.log(error)
      notify(`${error.response.data.error}`, 'error')
    }
  }

  // remove task handling
  const removeTask = async () => {
    setLoading(true)
    try {
      await taskService.remove(task.id)
      const tasks = await taskService.getAll()
      const sorted = [...tasks].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

      // Filters pastDueTasks based on the updated list of tasks
      const updatedPastDueTasks = pastDueTasks.filter((pastDueTask) => pastDueTask.id !== task.id)
      setTasks(sorted)
      setPastDueTasks(updatedPastDueTasks)
      notify('Task completed!')
    } catch (error) {
      notify(`${error.response.data.error}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  // renders forms on button switch
  const hideWhenVisible = { display: taskFormVisible ? 'none' : '' }
  const showWhenVisible = { display: taskFormVisible ? '' : 'none' }

  return (
    <Container className={`task py-3 mb-3 border ${task.deadline !== null && new Date(task.deadline) < Date.now() ? 'border-danger border-3' : 'border-dark border-2'} bg-light rounded d-flex align-items-center justify-content-between`}>
      {loading ? (
        <>
          <p>removing task...</p>
          <Spinner as="span" animation="border" role="status" aria-hidden="true" variant="danger" style={{ width: '3rem', height: '3rem' }} />
        </>
      ) : (
        <>
          <div style={hideWhenVisible}>
            <h3 className="task-content text-break">{task.content}</h3>
            {task.deadline === null
              ? <p>Due on: none specified</p>
              : (
                <p>
                  Due on:
                  {new Date(task.deadline).toLocaleDateString()}
                  {' '}
                  by
                  {new Date(task.deadline).toLocaleTimeString()}
                </p>
              )}
            <small>
              <i>
                Added on:
                {new Date(task.createdAt).toLocaleDateString()}
                {' '}
                at
                {new Date(task.createdAt).toLocaleTimeString()}
              </i>
            </small>
          </div>
          <div style={showWhenVisible} className="flex-grow-1">
            <EditTaskForm
              task={task}
              updateTask={updateTask}
              setTaskFormVisible={setTaskFormVisible}
            />
          </div>
          <div style={hideWhenVisible}>
            {pastDueTasksHandler()}
          </div>
          <div className="d-flex flex-column">
            <div style={hideWhenVisible}>
              <div className="m-1 py-1">
                <Icon className="edit" title="Edit task" path={mdiSquareEditOutline} size={2} onClick={() => setTaskFormVisible(true)} />
              </div>
              <div className="m-1 py-1">
                <Icon className="finish" title="Finish task" path={mdiCheckboxMarkedOutline} size={2} onClick={() => removeTask(task)} />
              </div>
            </div>
          </div>
        </>
      )}

    </Container>
  )
}

Task.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  task: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  pastDueTasks: PropTypes.array.isRequired,
  setPastDueTasks: PropTypes.func.isRequired,
  setTasks: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
}

export default Task

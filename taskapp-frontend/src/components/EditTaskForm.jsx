import React, { useState } from 'react'
import PropTypes from 'prop-types'

// bootstrap components
import {
  Container, Form, Button, Spinner,
} from 'react-bootstrap'

function EditTaskForm({
  updateTask,
  task,
  setTaskFormVisible,
}) {
  const [updatedTaskInfo, setUpdatedTaskInfo] = useState({
    content: task.content,
    deadline: task.deadline,
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setUpdatedTaskInfo({ ...updatedTaskInfo, [e.target.name]: e.target.value })
  }

  // sets time format for input
  const formDateValue = () => {
    const taskDeadline = new Date(updatedTaskInfo.deadline)
    // checks if deadline is a valid date
    if (!updatedTaskInfo.deadline || Number.isNaN(taskDeadline.getTime())) {
      return ''
    }
    return (
      new Date(taskDeadline.getTime() - taskDeadline.getTimezoneOffset() * 60000)
        .toISOString()).slice(0, -5)
  }

  const editTask = (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      updateTask(task.id, updatedTaskInfo)
      setTaskFormVisible(false)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <h2 className="text-center">Edit Task</h2>
      <Form onSubmit={editTask}>
        <Form.Group>
          <Form.Text>Task</Form.Text>
          <Form.Control
            disabled={loading}
            id="content"
            type="text"
            name="content"
            value={updatedTaskInfo.content}
            placeholder="Enter task"
            required
            minLength="3"
            maxLength="100"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Text>
            Deadline
            {' '}
            <small><i>(optional)</i></small>
          </Form.Text>
          <Form.Control
            disabled={loading}
            id="deadline"
            type="datetime-local"
            name="deadline"
            value={formDateValue()}
            onChange={handleChange}
          />
        </Form.Group>
        <div className="pt-3 d-flex justify-content-evenly align-items-center">
          {loading ? (
            <Spinner as="span" animation="border" role="status" aria-hidden="true" variant="primary" size="sm" />
          ) : (
            <>
              <Button className="m-1" variant="secondary" onClick={() => setTaskFormVisible(false)}>Cancel</Button>
              <Button variant="success" type="submit">Save</Button>
            </>
          )}
        </div>
      </Form>
    </Container>
  )
}

EditTaskForm.propTypes = {
  updateTask: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  task: PropTypes.object.isRequired,
  setTaskFormVisible: PropTypes.func.isRequired,
}

export default EditTaskForm

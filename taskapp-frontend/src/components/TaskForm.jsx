import React, { useState } from 'react'
import PropTypes from 'prop-types'

// bootstrap components
import {
  Button, Container, Form, Spinner,
} from 'react-bootstrap'

function TaskForm({
  createTask,
  setTaskFormVisible,
}) {
  const [content, setContent] = useState('')
  const [deadline, setDeadline] = useState('')
  const [loading, setLoading] = useState(false)

  const addTask = (event) => {
    event.preventDefault()
    setLoading(true)
    try {
    // converts the deadline to UTC before adding the task
      let utcDeadline = deadline
      if (deadline) {
      // parses the deadline as a Date object in the user's local timezone
        const localDeadline = new Date(deadline)
        // converts the local deadline to UTC and formats it as an ISO string
        utcDeadline = localDeadline.toISOString()
      }
      createTask({ content, deadline: utcDeadline })
      setContent('')
      setDeadline('')
      setTaskFormVisible(false)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setContent('')
    setDeadline('')
  }

  return (
    <Container className="py-3 my-3">
      <Form className="p-3 border border-2 border-secondary rounded" onSubmit={addTask}>
        <h2 className="text-center">Add new task</h2>
        <Form.Group>
          <Form.Text>Task</Form.Text>
          <Form.Control
            disabled={loading}
            id="content"
            type="text"
            value={content}
            placeholder="Enter task"
            required
            minLength="3"
            maxLength="100"
            onChange={({ target }) => setContent(target.value)}
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
            value={deadline}
            onChange={({ target }) => setDeadline(target.value)}
          />
        </Form.Group>
        <div className="pt-3 d-flex justify-content-evenly">
          {loading ? (
            <Spinner as="span" animation="border" role="status" aria-hidden="true" variant="primary" size="sm" />
          ) : (
            <>
              <Button className="mx-4" variant="secondary" type="reset" onClick={reset}>Reset</Button>
              <Button variant="success" type="submit">Add Task</Button>
            </>
          )}
        </div>
      </Form>
    </Container>
  )
}

TaskForm.propTypes = {
  createTask: PropTypes.func.isRequired,
  setTaskFormVisible: PropTypes.func.isRequired,
}

export default TaskForm

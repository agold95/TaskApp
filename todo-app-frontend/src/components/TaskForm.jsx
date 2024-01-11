import { useState } from "react"

//bootstrap components
import { Button, Container, Form, FormGroup } from "react-bootstrap"

const TaskForm = ({ createTask }) => {
  const [content, setContent] = useState('')
  const [deadline, setDeadline] = useState('')

  const addTask = event => {
    event.preventDefault()
    createTask({ content, deadline })
    setContent('')
    setDeadline('')
  }

  const reset = () => {
    setContent('')
    setDeadline('')
  }

  return (
    <Container className="p-2">
      <h2>Add new task</h2>
      <Form onSubmit={addTask}>
        <Form.Group>
          <Form.Text>Task</Form.Text>
          <Form.Control
            id="content"
            type="text"
            value={content}
            required
            onChange={({ target }) => setContent(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Text>Deadline <small><i>(optional)</i></small></Form.Text>
          <Form.Control
            id="deadline"
            type="datetime-local"
            value={deadline}
            onChange={({ target }) => setDeadline(target.value)}
          />
        </Form.Group>
        <div className='p-2 d-flex justify-content-end'>
          <Button className="mx-4" size="sm" variant="danger" type="reset" onClick={() => reset()}>Reset</Button>
          <Button variant="success" type="submit">Add Task</Button>
        </div>
      </Form>
    </Container>
  )
}

export default TaskForm
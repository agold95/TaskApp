import { useState } from "react"

//bootstrap components
import { Button, Container, Form } from "react-bootstrap"

const TaskForm = ({ createTask, setTaskFormVisible }) => {
  const [content, setContent] = useState('')
  const [deadline, setDeadline] = useState('')

  const addTask = event => {
    event.preventDefault()
    createTask({ content, deadline })
    setContent('')
    setDeadline('')
    setTaskFormVisible(false)
  }

  const reset = () => {
    setContent('')
    setDeadline('')
  }

  return (
    <Container className="py-3 my-3">
      <h2 className="text-center">Add new task</h2>
      <Form className="p-3 border border-secondary rounded" onSubmit={addTask}>
        <Form.Group>
          <Form.Text>Task</Form.Text>
          <Form.Control
            id="content"
            type="text"
            value={content}
            placeholder='Enter task'
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
        <div className='pt-3 d-flex justify-content-evenly'>
          <Button className="mx-4" size="sm" variant="danger" type="reset" onClick={() => reset()}>Reset</Button>
          <Button variant="success" type="submit">Add Task</Button>
        </div>
      </Form>
    </Container>
  )
}

export default TaskForm
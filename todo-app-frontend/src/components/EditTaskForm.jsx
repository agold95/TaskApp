import { useState } from "react"

// bootstrap components
import { Container, Form, Button } from "react-bootstrap"

const EditTaskForm = ({ updateTask, task, setTaskFormVisible }) => {
    const [editContent, setEditContent] = useState('')
    const [editDeadline, setEditDeadline] = useState('')

    const editTask = event => {
        event.preventDefault()
        updateTask(task.id, {
            content: editContent,
            deadline: editDeadline
        })
        setEditContent('')
        setEditDeadline('')
        setTaskFormVisible(false)
    }

    return (
        <Container className="py-3 my-3">
        <h2 className="text-center">Edit Task</h2>
        <Form className="p-3 border border-secondary rounded" onSubmit={editTask}>
            <Form.Group>
            <Form.Text>Task</Form.Text>
            <Form.Control
                id="content"
                type="text"
                value={editContent}
                placeholder='Enter task'
                required
                onChange={({ target }) => setEditContent(target.value)}
            />
            </Form.Group>
            <Form.Group>
            <Form.Text>Deadline <small><i>(optional)</i></small></Form.Text>
            <Form.Control
                id="deadline"
                type="datetime-local"
                value={editDeadline}
                onChange={({ target }) => setEditDeadline(target.value)}
            />
            </Form.Group>
            <div className='pt-3 d-flex justify-content-evenly'>
            <Button variant="success" type="submit">Save</Button>
            </div>
        </Form>
        </Container>
    )
}

export default EditTaskForm
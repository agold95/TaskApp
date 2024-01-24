import { useState } from "react"

// bootstrap components
import { Container, Form, Button } from "react-bootstrap"

const EditTaskForm = ({ updateTask, task, setTaskFormVisible }) => {
    const [updatedTaskInfo, setUpdatedTaskInfo] = useState({
        content: task.content,
        deadline: task.deadline
    })
    
    const handleChange = e => {
        setUpdatedTaskInfo({ ...updatedTaskInfo, [e.target.name]: e.target.value })
    }

    // sets time format for input
    const d = new Date(updatedTaskInfo.deadline)
    const formattedDate = (new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString()).slice(0, -5)

    const editTask = event => {
        event.preventDefault()
        updateTask(task.id, { ...updatedTaskInfo })
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
                name="content"
                value={updatedTaskInfo.content}
                placeholder='Enter task'
                required
                onChange={handleChange}
            />
            </Form.Group>
            <Form.Group>
            <Form.Text>Deadline <small><i>(optional)</i></small></Form.Text>
            <Form.Control
                id="deadline"
                type="datetime-local"
                name="deadline"
                value={formattedDate}
                onChange={handleChange}
            />
            </Form.Group>
            <div className='pt-3 d-flex justify-content-evenly'>
                <Button className="m-1" variant="outline-secondary" onClick={() => setTaskFormVisible(false)}>Cancel</Button>
                <Button variant="success" type="submit">Save</Button>
            </div>
        </Form>
        </Container>
    )
}

export default EditTaskForm
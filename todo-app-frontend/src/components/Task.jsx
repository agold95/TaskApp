import { useState } from "react"

import EditTaskForm from "./EditTaskForm"

// bootstrap components
import { Button, Container } from "react-bootstrap"

const Task = ({ task, updateTask, removeTask }) => {
    const [taskFormVisible, setTaskFormVisible] = useState(false)

    const hideWhenVisible = { display: taskFormVisible ? 'none' : '' }
    const showWhenVisible = { display: taskFormVisible ? '' : 'none' }

    return (
        <Container className="py-3 mb-3 border border-secondary rounded d-flex justify-content-between align-items-center">
            <div>
                <h3>{task.content}</h3>
                {task.deadline == null
                    ? <p>Due on: none specified</p>
                    : <p>Due on: {new Date(task.deadline).toLocaleDateString()} by {new Date(task.deadline).toLocaleTimeString()}</p>}
                <small><i>Added on: {new Date(task.createdAt).toLocaleDateString()} at {new Date(task.createdAt).toLocaleTimeString()}</i></small>
            </div>
            <div className="d-flex flex-column">
                <div style={hideWhenVisible}>
                    <Button className="m-1" variant="outline-success" onClick={() => setTaskFormVisible(true)}>Edit Task</Button>
                </div>
                <div style={showWhenVisible}>
                    <Button className="m-1" variant="outline-secondary" onClick={() => setTaskFormVisible(false)}>Cancel</Button>
                </div>
                <div>
                    <Button className="m-1" variant="outline-danger" onClick={() => removeTask(task)}>Finish Task</Button>
                </div>
            </div>
            <div style={showWhenVisible}>
                <EditTaskForm task={task} updateTask={updateTask} />
            </div>
        </Container>
    )
}

export default Task
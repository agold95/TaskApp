// bootstrap components
import { Button, Container } from "react-bootstrap"

const Task = ({ task, removeTask }) => {
    return (
        <Container className="m-3 p-3 border border-secondary rounded d-flex justify-content-between align-items-center">
            <div>
                <h3>{task.content}</h3>
                {task.deadline == null
                    ? <p>Due on: <i>none specified</i></p>
                    : <p>Due on: <i>{new Date(task.deadline).toLocaleDateString()} by {new Date(task.deadline).toLocaleTimeString()}</i></p>}
                <small>Created on: {new Date(task.updatedAt).toLocaleDateString()} at {new Date(task.updatedAt).toLocaleTimeString()}</small>
            </div>
            <div>
                <Button variant="outline-danger" onClick={() => removeTask(task)}>Finish Task</Button>
            </div>
        </Container>
    )
}

export default Task
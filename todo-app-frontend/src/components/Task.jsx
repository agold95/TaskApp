// bootstrap components
import { Button, Container } from "react-bootstrap"

const Task = ({ task, removeTask }) => {
    return (
        <Container className="m-3 p-3 border border-secondary rounded d-flex justify-content-between align-items-center">
            <div>
                <h3>{task.content}</h3>
                {task.deadline == null
                    ? <p>Due on: none specified</p>
                    : <p>Due on: {new Date(task.deadline).toLocaleDateString()} by {new Date(task.deadline).toLocaleTimeString()}</p>}
                <small><i>Added on: {new Date(task.updatedAt).toLocaleDateString()} at {new Date(task.updatedAt).toLocaleTimeString()}</i></small>
            </div>
            <div>
                <Button variant="outline-danger" onClick={() => removeTask(task)}>Finish Task</Button>
            </div>
        </Container>
    )
}

export default Task
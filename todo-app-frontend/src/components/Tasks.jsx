import { useState } from "react"

import Task from "./Task"
import TaskForm from "./TaskForm"

// bootstrap components
import { Button, Container } from "react-bootstrap"

const Tasks = ({ tasks, addTask, removeTask }) => {
    const [taskFormVisible, setTaskFormVisible] = useState(false)

    const hideWhenVisible = { display: taskFormVisible ? 'none' : '' }
    const showWhenVisible = { display: taskFormVisible ? '' : 'none' }

    return (
        <Container className="m-2 p-2">
            <h1>Tasks</h1>
            <div style={showWhenVisible}>
                <Button variant="secondary" onClick={() => setTaskFormVisible(false)}>Hide new task form</Button> 
                <TaskForm createTask={addTask} />
            </div>
            <Button style={hideWhenVisible} onClick={() => setTaskFormVisible(true)}>Add a new task</Button>
            <Container className="d-flex flex-column align-items-center m-2">
                {tasks.map(task =>
                    <Task
                    key={task.id}
                    task={task}
                    removeTask={removeTask}
                    />
                    )}
            </Container>
        </Container>
    )
}

export default Tasks
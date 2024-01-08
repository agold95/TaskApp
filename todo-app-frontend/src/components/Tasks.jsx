import { useState } from "react"

import Task from "./Task"
import TaskForm from "./TaskForm"

const Tasks = ({ tasks, addTask, removeTask }) => {
    const [taskFormVisible, setTaskFormVisible] = useState(false)

    const hideWhenVisible = { display: taskFormVisible ? 'none' : '' }
    const showWhenVisible = { display: taskFormVisible ? '' : 'none' }

    return (
        <div>
        <h1>Tasks</h1>
        <div style={showWhenVisible}>
            <TaskForm createTask={addTask} />
            <button onClick={() => setTaskFormVisible(false)}>Hide new task form</button> 
        </div>
        <button style={hideWhenVisible} onClick={() => setTaskFormVisible(true)}>Create a new task</button>
        {tasks.map(task =>
            <Task
            key={task.id}
            task={task}
            removeTask={removeTask}
            />
        )}
        </div>
    )
}

export default Tasks
const Task = ({ task, removeTask }) => {
    return (
        <div>
            <h4>{task.content}</h4>
            <p>Created on: {task.updatedAt}</p>
            <p>Due by: {task.deadline}</p>
            <button onClick={() => removeTask(task)}>Finish Task</button>
        </div>
    )
}

export default Task
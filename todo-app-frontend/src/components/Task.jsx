const Task = ({ task }) => {
    return (
        <div>
            <p>{task.content}</p>
            <p>Created on: {task.updatedAt}</p>
            <p>Due on: {task.deadline}</p>
        </div>
    )
}

export default Task
import { useState } from "react"

const TaskForm = ({ createTask }) => {
  const [content, setContent] = useState('')
  const [deadline, setDeadline] = useState('')

  const addTask = event => {
    event.preventDefault()
    createTask({ content, deadline })
    setContent('')
    setDeadline('')
  }

  return (
    <div>
      <h2>Create new blog</h2>
      <form onSubmit={addTask}>
        Task:
        <input
          id="content"
          type="text"
          onChange={({ target }) => setContent(target.value)}
        />
        <br />
        Deadline:
        <input
          id="deadline"
          type="datetime-local"
          onChange={({ target }) => setDeadline(target.value)}
        />
        <button type="submit">Create Task</button>
      </form>
    </div>
  )
}

export default TaskForm

import { useEffect, useState } from "react"

import Task from "./Task"
import TaskForm from "./TaskForm"

// bootstrap components
import { Button, Container, Dropdown, DropdownButton } from "react-bootstrap"

const Tasks = ({ tasks, setTasks, addTask, updateTask, removeTask, pastDueTasks, setPastDueTasks }) => {
    const [taskFormVisible, setTaskFormVisible] = useState(false)
    const [filterName, setFilterName] = useState('')

    const hideWhenVisible = { display: taskFormVisible ? 'none' : '' }
    const showWhenVisible = { display: taskFormVisible ? '' : 'none' }

    useEffect(() => {
        setTasks(tasks)
    }, [tasks, setTasks])

    // sorts tasks by date created ascending
    const sortCreatedAscending = () => {
        const sorted = [...tasks].sort((a, b) => {
            return new Date(a.createdAt) - new Date(b.createdAt)
        })
        setTasks(sorted)
        setFilterName('Date added - oldest')
    }

    // sorts tasks by date created descending
    const sortCreatedDescending = () => {
        const sorted = [...tasks].sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt)
        })
        setTasks(sorted)
        setFilterName('Date added - newest')
    }

    // sorts tasks by due date ascending
    const sortDueDateClosest = () => {
        const sorted = [...tasks].sort((a, b) => {
            return new Date(a.deadline) - new Date(b.deadline)
        })
        setTasks(sorted)
        setFilterName('Due date - closest')
    }

    // sorts tasks by due date descending
    const sortDueDateFurthest = () => {
        const sorted = [...tasks].sort((a, b) => {
            return new Date(b.deadline) - new Date(a.deadline)
        })
        setTasks(sorted)
        setFilterName('Due date - furthest')
    }

    // displays amount of tasks that are past due, if applicable
    const pastDueDisplay = () => {
        if (pastDueTasks.length === 1) {
            return <h3 className="text-danger alert alert-danger">You have 1 task that is past due!</h3>
        } else if (pastDueTasks.length > 1) {
            return <h3 className="text-danger alert alert-danger">You have {pastDueTasks.length} tasks that are past due!</h3>
        } else {
            return null
        }
    }

    return (
        <Container className="m-2 p-2">
            <h1>Tasks</h1>
            <Container className="d-flex flex-column align-items-end">
                <Container>
                        <div style={showWhenVisible}>
                            <div className="d-flex justify-content-center">
                                <Button variant="secondary" onClick={() => setTaskFormVisible(false)}>Hide new task form</Button> 
                            </div>
                            <TaskForm setTaskFormVisible={setTaskFormVisible} createTask={addTask} />
                        </div>
                        <div style={hideWhenVisible}>
                            <div className="d-flex justify-content-center">
                                <Button onClick={() => setTaskFormVisible(true)}>Add a new task</Button>
                            </div>
                        </div>
                        <div className="m-3 p-3 text-center">
                        {pastDueDisplay()}
                        </div>
                    <Container className="d-flex justify-content-end align-items-center">
                        <DropdownButton size="sm" variant="link" title="Sort" drop="end">
                            <Dropdown.Header>Date added:</Dropdown.Header>
                            <Dropdown.Item onClick={sortCreatedAscending}>oldest</Dropdown.Item>
                            <Dropdown.Item onClick={sortCreatedDescending}>newest</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Header>Due date:</Dropdown.Header>
                            <Dropdown.Item onClick={sortDueDateClosest}>closest</Dropdown.Item>
                            <Dropdown.Item onClick={sortDueDateFurthest}>furthest</Dropdown.Item>
                        </DropdownButton>
                        <div>
                            {filterName === ''
                                ? <small className="m-0">Date added - oldest</small>
                                : <small className="m-0">{ filterName }</small>
                            }
                        </div>
                    </Container>
                    {tasks.map(task =>
                        <Task
                        key={task.id}
                        task={task}
                        updateTask={updateTask}
                        removeTask={removeTask}
                        pastDueTasks={pastDueTasks}
                        setPastDueTasks={setPastDueTasks}
                        />
                    )}
                </Container>
            </Container>
        </Container>
    )
}

export default Tasks
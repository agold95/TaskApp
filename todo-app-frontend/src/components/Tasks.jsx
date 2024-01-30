import { useEffect, useState } from "react"
import PropTypes from 'prop-types'

import Task from "./Task"
import TaskForm from "./TaskForm"

// bootstrap components
import { Container, Dropdown, DropdownButton } from "react-bootstrap"

// MDI components
import Icon from "@mdi/react"
import { mdiPlusCircle } from "@mdi/js"
import { mdiMinusCircle } from "@mdi/js"

const Tasks = ({
    tasks,
    setTasks,
    addTask,
    updateTask,
    removeTask,
    pastDueTasks,
    setPastDueTasks
}) => {
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
            return <h3 className="text-danger alert alert-danger m-0 border-2">You have 1 task that is past due!</h3>
        } else if (pastDueTasks.length > 1) {
            return <h3 className="text-danger alert alert-danger m-0 border-2">You have {pastDueTasks.length} tasks that are past due!</h3>
        } else {
            return null
        }
    }

    return (
        <Container className="m-2 p-2 w-50">
            <h1>Tasks</h1>
            <div className="m-3 p-3 text-center">
                {pastDueDisplay()}
            </div>
            <Container className="d-flex flex-column align-items-end">
                <Container>
                    <div>
                        <div style={showWhenVisible}>
                            <div className="d-flex justify-content-center p-3">
                                <Icon className="minus" title="Close task form" path={mdiMinusCircle} size={3} onClick={() => setTaskFormVisible(false)}>Hide new task form</Icon> 
                            </div>
                            <TaskForm setTaskFormVisible={setTaskFormVisible} createTask={addTask} />
                        </div>
                        <div style={hideWhenVisible}>
                            <div className="d-flex justify-content-center p-3">
                                <Icon className="plus" title="Add task" path={mdiPlusCircle} size={3} onClick={() => setTaskFormVisible(true)}>Add a new task</Icon>
                            </div>
                        </div>
                    </div>
                    <Container className="d-flex justify-content-end align-items-center">
                        <DropdownButton size="sm" variant="link" title="Sort" drop="end">
                            <Dropdown.Header>Date added -</Dropdown.Header>
                            <Dropdown.Item onClick={sortCreatedAscending}>oldest</Dropdown.Item>
                            <Dropdown.Item onClick={sortCreatedDescending}>newest</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Header>Due date -</Dropdown.Header>
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

Tasks.propTypes = {
    tasks: PropTypes.array.isRequired,
    setTasks: PropTypes.func.isRequired,
    addTask: PropTypes.func.isRequired,
    updateTask: PropTypes.func.isRequired,
    removeTask: PropTypes.func.isRequired,
    pastDueTasks: PropTypes.array.isRequired,
    setPastDueTasks: PropTypes.func.isRequired
}

export default Tasks
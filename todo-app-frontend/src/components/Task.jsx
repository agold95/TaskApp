import { useEffect, useState } from "react"
import PropTypes from 'prop-types'

// components
import EditTaskForm from "./EditTaskForm"

// bootstrap components
import { Container } from "react-bootstrap"

// MDI components
import Icon from "@mdi/react"
import { mdiSquareEditOutline } from "@mdi/js"
import { mdiCheckboxMarkedOutline } from "@mdi/js"
import { mdiAlertBoxOutline } from "@mdi/js"

const Task = ({
    task,
    updateTask,
    removeTask,
    pastDueTasks,
    setPastDueTasks
}) => {
    const [taskFormVisible, setTaskFormVisible] = useState(false)

    const hideWhenVisible = { display: taskFormVisible ? 'none' : '' }
    const showWhenVisible = { display: taskFormVisible ? '' : 'none' }

    // evaluates deadline and current time to determine if task is past due or not, then renders it
    useEffect(() => {
        // if task has no deadline, return
        if (task.deadline === null) {
            return
        }

        const isTaskPastDue = new Date(task.deadline) < Date.now()
        const isTaskAlreadyAdded = pastDueTasks.some(pastDueTask => pastDueTask.id === task.id)

        if (isTaskPastDue && !isTaskAlreadyAdded) {
            setPastDueTasks(prevPastDueTasks => [...prevPastDueTasks, task])
        } else if (!isTaskPastDue && isTaskAlreadyAdded) {
            setPastDueTasks(prevPastDueTasks => prevPastDueTasks.filter(pastDueTask => pastDueTask.id !== task.id))
        }
    }, [task, pastDueTasks, setPastDueTasks])

    const pastDueTasksHandler = () => {
        return task.deadline !== null && new Date(task.deadline) < Date.now()
            ? <Icon title="This task is past due!" className="alert-box" path={mdiAlertBoxOutline} size={3} />
            : null
    }

    return (
        <Container className={`py-3 mb-3 border ${task.deadline !== null && new Date(task.deadline) < Date.now() ? 'border-danger border-3' : 'border-secondary border-2'} bg-light rounded d-flex align-items-center justify-content-between`}>
            <div style={hideWhenVisible}>
                <h3>{task.content}</h3>
                {task.deadline === null
                    ? <p>Due on: none specified</p>
                    : <p>Due on: {new Date(task.deadline).toLocaleDateString()} by {new Date(task.deadline).toLocaleTimeString()}</p>}
                <small><i>Added on: {new Date(task.createdAt).toLocaleDateString()} at {new Date(task.createdAt).toLocaleTimeString()}</i></small>
            </div>
            <div style={showWhenVisible} className="flex-grow-1">
                <EditTaskForm task={task} updateTask={updateTask} setTaskFormVisible={setTaskFormVisible} />
            </div>
            <div style={hideWhenVisible}>
                {pastDueTasksHandler()}
            </div>
            <div className="d-flex flex-column">
                <div style={hideWhenVisible}>
                    <div className="m-2 py-1">
                        <Icon className="edit" title="Edit task" path={mdiSquareEditOutline} size={2} onClick={() => setTaskFormVisible(true)}></Icon>
                    </div>
                    <div className="m-2 py-1">
                        <Icon className="finish" title="Finish task" path={mdiCheckboxMarkedOutline} size={2} onClick={() => removeTask(task)}></Icon>
                    </div>
                </div>
            </div>
        </Container>
    )
}

Task.propTypes = {
    task: PropTypes.object.isRequired,
    updateTask: PropTypes.func.isRequired,
    removeTask: PropTypes.func.isRequired,
    pastDueTasks: PropTypes.array.isRequired,
    setPastDueTasks: PropTypes.func.isRequired
}

export default Task
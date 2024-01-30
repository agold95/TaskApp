import { useEffect, useState } from "react"
import PropTypes from 'prop-types'

// components
import Task from "./Task"
import TaskForm from "./TaskForm"
import TaskSort from "./TaskSort"

// bootstrap components
import { Container } from "react-bootstrap"

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

    const hideWhenVisible = { display: taskFormVisible ? 'none' : '' }
    const showWhenVisible = { display: taskFormVisible ? '' : 'none' }

    // useEffect hook for rending tasks
    useEffect(() => {
        setTasks(tasks)
    }, [tasks, setTasks])

    // displays amount of tasks that are past due, if applicable
    const pastDueDisplay = () => {
        const taskCount = pastDueTasks.length

        return taskCount > 0 ? (
            <h3 className="text-danger alert alert-danger m-0 border-2">
                {`You have ${taskCount} task${taskCount === 1 ? '' : 's'} that ${taskCount === 1 ? 'is' : 'are'} past due!`}
            </h3>
        ) : null
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
                    {tasks.length > 0 && (
                        <TaskSort tasks={tasks} setTasks={setTasks} />
                    )}
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
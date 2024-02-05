const Task = require('../models/task')
const User = require('../models/user')

const initialUsers = [
    {
        username: 'User1',
        password: '1111'
    }
]

const initialTasks = [
    {
        content: 'First task',
        deadline: ''
    },
    {
        content: 'Second task',
        deadline: ''
    },
    {
        content: 'Third task',
        deadline: ''
    }
]

const tasksinDB = async () => {
    const tasks = await Task.find({})
    return tasks.map(task => task.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
    initialUsers, initialTasks, tasksinDB, usersInDb
}
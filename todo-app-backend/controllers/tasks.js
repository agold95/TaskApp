const tasksRouter = require('express').Router()
const Task = require('../models/task')

// get all tasks
tasksRouter.get('/', async (request, response) => {
  const tasks = await Task.find({}).populate('user', { username: 1 })
  response.json(tasks)
})

// get individual task
tasksRouter.get('/:id', async (request, response) => {
  const task = await Task.findById(request.params.id)
  if (task) {
    response.json(task)
  } else {
    response.status(404).end()
  }
})

// create new task
tasksRouter.post('/', async (request, response) => {
  const { content, deadline } = request.body
  const task = new Task({
    content, deadline
  })

  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'operation not permitted' })
  }

  task.user = user._id

  let createdTask = await task.save()

  user.tasks = user.tasks.concat(createdTask._id)
  await user.save()

  createdTask = await Task.findById(createdTask._id).populate('user')

  response.status(201).json(createdTask)
})

// edit task
tasksRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const task = {
    content: body.content,
    deadline: body.deadline,
  }

  await Task.findByIdAndUpdate(request.params.id, task, { new: true })
    .then(updatedTask => {
      response.json(updatedTask)
    })
    .catch(error => next(error))
})

// delete task
tasksRouter.delete('/:id', async (request, response) => {
  await Task.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = tasksRouter
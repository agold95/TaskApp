const tasksRouter = require('express').Router()
const Task = require('../models/task')

// get all tasks
tasksRouter.get('/', async (request, response) => {
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'Not authorized' })
  }

  const tasks = await Task.find({ user: user.id }).populate('user', { username: 1 })
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
    return response.status(401).json({ error: 'Operation not permitted' }).end()
  }

  task.user = user._id

  let createdTask = await task.save()

  user.tasks = user.tasks.concat(createdTask._id)
  await user.save()

  createdTask = await Task.findById(createdTask._id).populate('user')

  response.status(201).json(createdTask)
})

// update task
tasksRouter.put('/:id', async (request, response) => {
  const body = request.body
  const id = request.params.id

  const task = {
    content: body.content,
    deadline: body.deadline
  }

  const updatedTask = await Task.findByIdAndUpdate(id, task, { new: true })
  response.status(201).json(updatedTask)
})

// delete task
tasksRouter.delete('/:id', async (request, response) => {
  await Task.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = tasksRouter
const tasksRouter = require('express').Router()
const Task = require('../models/task')

// helper to check if deadline is formatted correctly
const isValidDate = (dateString) => !isNaN(Date.parse(dateString))

// get all tasks
tasksRouter.get('/', async (request, response) => {
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'Not authorized' })
  }

  const tasks = await Task.find({ user: user.id }).populate('user', { username: 1 })
  response.json(tasks)
})

// create new task
tasksRouter.post('/', async (request, response) => {
  const { content, deadline } = request.body
  const task = new Task({
    content, deadline
  })

  const user = request.user

  // returns if user is not signed in
  if (!user) {
    return response.status(401).json({ error: 'Operation not permitted' }).end()
  }

  // returns if task content is empty
  if (!task.content) {
    return response.status(400).json({ error: 'Task content cannot be empty' }).end()
  }

  // returns if deadline is malformatted
  if (deadline && !isValidDate(deadline)) {
    return response.status(400).json({ error: 'Malformatted deadline' })
  }

  // returns if content is greater than 3 characters long
  if (task.content.length < 3) {
      return response.status(400).json({ error: 'Task content must be greater than 3 characters' }).end()
  }

  // returns if task content is longer than 100 characters long
  if (task.content.length > 100) {
      return response.status(400).json({ error: 'Task content must be less than 100 characters' }).end()
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

  // returns if task content is empty
  if (!task.content) {
    return response.status(400).json({ error: 'Task content cannot be empty' }).end()
  }

  // returns if task content is greater than 3 characters long
  if (task.content.length < 3) {
      return response.status(400).json({ error: 'Task content must be greater than 3 characters' }).end()
  }

  // returns if deadline is malformatted
  if (task.deadline && !isValidDate(task.deadline)) {
    return response.status(400).json({ error: 'Malformatted deadline' })
  }

  // returns if content is greater than 3 characters long
  if (task.content.length < 3) {
      return response.status(400).json({ error: 'Task content must be greater than 3 characters' }).end()
  }

  // returns if task content is longer than 100 characters long
  if (task.content.length > 100) {
      return response.status(400).json({ error: 'Task content must be less than 100 characters' }).end()
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
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// create new user
usersRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  // checks for username/password length
  if (password.length <= 3 || username.length <= 3) {
      return response.status(400).json({ error: 'username or password must be longer than 3 characters' }).end()
  }

  // checks for existing username
  const existingUser = await User.findOne({ username })

  if (existingUser) {
    return response.status(400).json({ error: 'username already exists'})
  }

  // password hashing
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

// get all users
usersRouter.get('/', async (request, response) => {
   const users = await User
    .find({}).populate('tasks', { content: 1, deadline: 1 })
    
  response.json(users)
})

module.exports = usersRouter
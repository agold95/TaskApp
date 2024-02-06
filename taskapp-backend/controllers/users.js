const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// create new user
usersRouter.post('/', async (request, response) => {
  const { username, password, passwordConfirmation } = request.body

  // checks for username/password length
  if (password.length < 3 || username.length < 3) {
      return response.status(400).json({ error: 'Username or password must be longer than 3 characters' }).end()
  }

  // checks for existing username
  const existingUser = await User.findOne({ username })

  if (existingUser) {
    return response.status(400).json({ error: 'Username already exists'}).end()
  }

  // checks for matching passwords
  if (password !== passwordConfirmation) {
    return response.status(400).json({ error: 'Passwords must match'}).end()
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

module.exports = usersRouter
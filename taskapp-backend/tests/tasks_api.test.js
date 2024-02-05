const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')

const api = supertest(app)
const User = require('../models/user')
const Task = require('../models/task')

const helper = require('./test_helper')

describe('A user:', () => {
    beforeAll(async () => {
        await User.deleteMany({})
    })

    test('Can be created', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'Testuser1',
            password: '12345',
            passwordConfirmation: '12345'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
        
        // checks that user is added to array of users
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        // checks that user with new users username is added
        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('Can sign in', async () => {
        await api
            .post('/api/login')
            .send({ username: 'Testuser1', password: '12345' })
            .expect(200)
    })
})

describe('A signed-in user:', () => {
    beforeAll(async () => {
        await User.deleteMany({})
        await Task.deleteMany({})

        const passwordHash = await bcrypt.hash('123abc', 10)
        const user = new User({ username: 'Testuser2', passwordHash })
        await user.save()

        const loggedInUser = await api
            .post('/api/login')
            .send({ username: 'Testuser2', password: '123abc' })
            .expect(200);

        authToken = loggedInUser.body.token
    })

    test('Can create a new task', async () => {
        const tasksAtStart = await helper.tasksinDB()

        const newTask = {
            content: 'This is a task!',
            deadline: '2024-04-01T00:00:00.000+00:00'
        }
        
        await api
            .post('/api/tasks')
            .send(newTask)
            .set({ 'Authorization': `Bearer ${authToken}`, Accept: 'application/json' })
            .expect(201)
        
        // checks that task was added to array of tasks
        const tasksAtEnd = await helper.tasksinDB()
        expect(tasksAtEnd).toHaveLength(tasksAtStart.length + 1)
    })

    test('Can edit a task', async () => {
        const tasksAtStart = await helper.tasksinDB()
        const taskToUpdate = tasksAtStart[0]

        const editedTask = {
            content: 'This is an edited task!',
        }

        const updatedTask = await api
            .put(`/api/tasks/${taskToUpdate.id}`)
            .send(editedTask)
            .set({ 'Authorization': `Bearer ${authToken}`, Accept: 'application/json' })
            .expect(201)
        
        // checks that content is updated
        expect(updatedTask.body).toHaveProperty('content', 'This is an edited task!')
        // checks that the updatedAt property is different
        expect(updatedTask.body.updatedAt).not.toBe(taskToUpdate.updatedAt)
        // checks that the updated task is not the same as it previously was
        expect(updatedTask.body).not.toBe(taskToUpdate)
    })

    test('Can delete a task', async () => {
        const tasksAtStart = await helper.tasksinDB()
        const taskToDelete = tasksAtStart[0]

        await api
            .delete(`/api/tasks/${taskToDelete.id}`)
            .set({ 'Authorization': `Bearer ${authToken}`, Accept: 'application/json' })
            .expect(204)
        
        const tasksAtEnd = await helper.tasksinDB()
        // checks that task is deleted
        expect(tasksAtEnd).toHaveLength(tasksAtStart.length - 1)
    })
})

afterAll(async () => {
  await mongoose.connection.close()
})
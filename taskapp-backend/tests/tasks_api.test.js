const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')

const api = supertest(app)
const User = require('../models/user')
const Task = require('../models/task')

const helper = require('./test_helper')

describe('A new user:', () => {
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

    test('Can sign in after creating account', async () => {
        await api
            .post('/api/login')
            .send({ username: 'Testuser1', password: '12345' })
            .expect(200)
    })

    describe('Cannot be created:', () => {
        test('If username is fewer than 3 characters', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                username: 'ab',
                password: '12345',
                passwordConfirmation: '12345'
            }

            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
            
            const usersAtEnd = await helper.usersInDb()
            
            // checks result message
            expect(result.body.error).toContain('Username or password must be longer than 3 characters')
            // checks that user was not created
            expect(usersAtEnd).toStrictEqual(usersAtStart)
        })

        test('If password is fewer than 3 characters', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                username: 'Testuser2',
                password: '12',
                passwordConfirmation: '12'
            }

            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
            
            const usersAtEnd = await helper.usersInDb()
            
            // checks result message
            expect(result.body.error).toContain('Username or password must be longer than 3 characters')
            // checks that user was not created
            expect(usersAtEnd).toStrictEqual(usersAtStart)
        })

        test('If password and password confirmation do not match', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                username: 'Testuser2',
                password: '12345',
                passwordConfirmation: 'abcde'
            }

            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
            
            const usersAtEnd = await helper.usersInDb()
            
            // checks result message
            expect(result.body.error).toContain('Passwords must match')
            // checks that user was not created
            expect(usersAtEnd).toStrictEqual(usersAtStart)
        })

        test('If username already exists', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                username: 'Testuser1',
                password: 'hijkl',
                passwordConfirmation: 'hijkl'
            }

            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
            
            const usersAtEnd = await helper.usersInDb()
            
            // checks result message
            expect(result.body.error).toContain('Username already exists')
            // checks that user was not created
            expect(usersAtEnd).toStrictEqual(usersAtStart)
        })
    })

    describe('Cannot sign in', () => {
        test('If username is incorrect or does not exist', async () => {
            const usersAtStart = await helper.usersInDb()

            const result = await api
            .post('/api/login')
            .send({ username: 'abcd', password: '12345' })
            .expect(401)
            
            const usersAtEnd = await helper.usersInDb()
            
            // checks result message
            expect(result.body.error).toContain('Invalid username or password')
            // checks that user was not created
            expect(usersAtEnd).toStrictEqual(usersAtStart)
        })

        test('If password is incorrect or does not exist', async () => {
            const usersAtStart = await helper.usersInDb()

            const result = await api
            .post('/api/login')
            .send({ username: 'Testuser1', password: 'abcde' })
            .expect(401)
            
            const usersAtEnd = await helper.usersInDb()
            
            // checks result message
            expect(result.body.error).toContain('Invalid username or password')
            // checks that user was not created
            expect(usersAtEnd).toStrictEqual(usersAtStart)
        })
    })
})

describe('A signed-in user:', () => {
    beforeAll(async () => {
        await User.deleteMany({})
        await Task.deleteMany({})

        // creates new user
        const passwordHash = await bcrypt.hash('123abc', 10)
        const user = new User({ username: 'Testuser3', passwordHash })
        await user.save()

        // logs new user in
        const loggedInUser = await api
            .post('/api/login')
            .send({ username: 'Testuser3', password: '123abc' })
            .expect(200)

        authToken = loggedInUser.body.token

        // adds a task to their array of tasks
        const firstTask = {
            content: 'This is the first task!',
            deadline: '2024-06-30T00:00:00.000+00:00'
        }
        
        await api
            .post('/api/tasks')
            .send(firstTask)
            .set({ 'Authorization': `Bearer ${authToken}`, Accept: 'application/json' })
            .expect(201)
    })

    describe('Can:', () => {
        test('Get all their tasks', async () => {
            const response = await api
                .get('/api/tasks')
                .set({ 'Authorization': `Bearer ${authToken}`, Accept: 'application/json' })
                .expect(200)
                .expect('Content-Type', /application\/json/)
            
            expect(response.body).toHaveLength(1)
        })

        test('Create a new task', async () => {
            const tasksAtStart = await helper.tasksinDB()

            const newTask = {
                content: 'This is a created task!',
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

        test('Create a new task with no deadline', async () => {
            const tasksAtStart = await helper.tasksinDB()

            const newTask = {
                content: 'This is a task with no deadline',
                deadline: ''
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

        test('Edit a task', async () => {
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

        test('Delete a task', async () => {
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

    describe('Cannot:', () => {
        describe('Create a new task:', () => {
            test('If content is missing', async () => {
                const tasksAtStart = await helper.tasksinDB()

                const newTask = {
                    content: '',
                    deadline: ''
                }
                
                const result = await api
                    .post('/api/tasks')
                    .send(newTask)
                    .set({ 'Authorization': `Bearer ${authToken}`, Accept: 'application/json' })
                    .expect(400)
                
                const tasksAtEnd = await helper.tasksinDB()

                expect(tasksAtEnd).toStrictEqual(tasksAtStart)
                expect(result.body.error).toContain('Task content cannot be empty')
            })

            test('If deadline is malformatted', async () => {
                const tasksAtStart = await helper.tasksinDB()

                const newTask = {
                    content: 'A task',
                    deadline: 'april 1st, 2024'
                }
                
                const result = await api
                    .post('/api/tasks')
                    .send(newTask)
                    .set({ 'Authorization': `Bearer ${authToken}`, Accept: 'application/json' })
                    .expect(400)
                
                const tasksAtEnd = await helper.tasksinDB()

                expect(tasksAtEnd).toStrictEqual(tasksAtStart)
                expect(result.body.error).toContain('Malformatted deadline')
            })

            test('If content is shorter than 3 characters', async () => {
                const tasksAtStart = await helper.tasksinDB()

                const newTask = {
                    content: 'ab',
                    deadline: ''
                }
                
                const result = await api
                    .post('/api/tasks')
                    .send(newTask)
                    .set({ 'Authorization': `Bearer ${authToken}`, Accept: 'application/json' })
                    .expect(400)
                
                const tasksAtEnd = await helper.tasksinDB()

                expect(tasksAtEnd).toStrictEqual(tasksAtStart)
                expect(result.body.error).toContain('Task content must be greater than 3 characters')
            })

            test('If content is longer than 100 characters', async () => {
                const tasksAtStart = await helper.tasksinDB()

                const newTask = {
                    content: 'lllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll',
                    deadline: ''
                }
                
                const result = await api
                    .post('/api/tasks')
                    .send(newTask)
                    .set({ 'Authorization': `Bearer ${authToken}`, Accept: 'application/json' })
                    .expect(400)
                
                const tasksAtEnd = await helper.tasksinDB()

                expect(tasksAtEnd).toStrictEqual(tasksAtStart)
                expect(result.body.error).toContain('Task content must be less than 100 characters')
            })
        })

        describe('Edit a task:', () => {
            test('If content is empty', async () => {
                const tasksAtStart = await helper.tasksinDB()
                const taskToUpdate = tasksAtStart[0]

                const editedTask = {
                    content: '',
                }

                const result = await api
                    .put(`/api/tasks/${taskToUpdate.id}`)
                    .send(editedTask)
                    .set({ 'Authorization': `Bearer ${authToken}`, Accept: 'application/json' })
                    .expect(400)

                    const tasksAtEnd = await helper.tasksinDB()

                    expect(tasksAtEnd).toStrictEqual(tasksAtStart)
                    expect(result.body.error).toContain('Task content cannot be empty')
            })

            test('If deadline is malformatted', async () => {
                const tasksAtStart = await helper.tasksinDB()
                const taskToUpdate = tasksAtStart[0]

                const editedTask = {
                    content: 'This task has a bad deadline',
                    deadline: 'april 1st, 2024'
                }

                const result = await api
                    .put(`/api/tasks/${taskToUpdate.id}`)
                    .send(editedTask)
                    .set({ 'Authorization': `Bearer ${authToken}`, Accept: 'application/json' })
                    .expect(400)

                    const tasksAtEnd = await helper.tasksinDB()

                    expect(tasksAtEnd).toStrictEqual(tasksAtStart)
                    expect(result.body.error).toContain('Malformatted deadline')
            })

            test('If content is fewer than 3 characters', async () => {
                const tasksAtStart = await helper.tasksinDB()
                const taskToUpdate = tasksAtStart[0]

                const editedTask = {
                    content: 'hi',
                }

                const result = await api
                    .put(`/api/tasks/${taskToUpdate.id}`)
                    .send(editedTask)
                    .set({ 'Authorization': `Bearer ${authToken}`, Accept: 'application/json' })
                    .expect(400)

                    const tasksAtEnd = await helper.tasksinDB()

                    expect(tasksAtEnd).toStrictEqual(tasksAtStart)
                    expect(result.body.error).toContain('Task content must be greater than 3 characters')
            })

            test('If content is greater than 100 characters', async () => {
                const tasksAtStart = await helper.tasksinDB()
                const taskToUpdate = tasksAtStart[0]

                const editedTask = {
                    content: 'lllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll',
                }

                const result = await api
                    .put(`/api/tasks/${taskToUpdate.id}`)
                    .send(editedTask)
                    .set({ 'Authorization': `Bearer ${authToken}`, Accept: 'application/json' })
                    .expect(400)

                    const tasksAtEnd = await helper.tasksinDB()

                    expect(tasksAtEnd).toStrictEqual(tasksAtStart)
                    expect(result.body.error).toContain('Task content must be less than 100 characters')
            })
        })

        describe('Delete a task:', () => {
            test('If it does not belong to the user', async () => {
                // creates new user
                const passwordHash = await bcrypt.hash('123abc', 10)
                const user = new User({ username: 'Testuser4', passwordHash })
                await user.save()

                // logs new user in
                const loggedInUser = await api
                    .post('/api/login')
                    .send({ username: 'Testuser4', password: '123abc' })
                    .expect(200)

                authToken = loggedInUser.body.token

                const tasksAtStart = await helper.tasksinDB()
                const taskToDelete = tasksAtStart[0]

                await api
                    .delete(`/api/tasks/${taskToDelete.id}`)
                    .set({ 'Authorization': `Bearer ${authToken}`, Accept: 'application/json' })
                    .expect(403)
            })
        })
    })
})

afterAll(async () => {
  await mongoose.connection.close()
})
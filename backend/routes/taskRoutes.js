import express from 'express'
import Task from '../models/task.js'

const router = express.Router()

router.post('/', async (req, res) => {
    const { text, completed } = req.body

    try {
        const newTask = new Task({
            text,
            completed: completed || false
        })

        console.log(newTask)

        await newTask.save()
        res.status(201).json(newTask)
    } catch (err) {
        res.status(400).json({ message: 'Error creating task', error: err })
    }
})

router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find()
        res.status(200).json(tasks)
    } catch (err) {
        res.status(400).json({ message: 'Error getting tasks', error: err })
    }
})

router.put('/:_id', async (req, res) => {
    const { _id } = req.params
    const { text, completed } = req.body

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            _id,
            { text, completed },
            { new: true }
        )

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' })
        }

        res.status(200).json(updatedTask)
    } catch (err) {
        res.status(400).json({ message: 'Error updating task', error: err })
    }
})

router.delete('/:_id', async (req, res) => {
    const { _id } = req.params

    try {
        const deletedTask = await Task.findByIdAndDelete(_id)

        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' })
        }

        res.status(200).json({ message: 'Task deleted' })
    } catch (err) {
        res.status(400).json({ message: 'Error deleting task', error: err })
    }
})

export default router

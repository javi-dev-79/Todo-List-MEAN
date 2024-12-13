import express from 'express'
import Task from '../models/Task.js'

const router = express.Router()

router.post('/tasks', async (req, res) => {
  const { text, completed } = req.body

  try {
    const newTask = new Task({
      text,
      completed: completed || false,
    })

    await newTask.save()
    res.status(201).json(newTask)
  } catch (err) {
    res.status(400).json({ message: 'Error creating task', error: err })
  }
})

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find()
    res.status(200).json(tasks)
  } catch (err) {
    res.status(400).json({ message: 'Error getting tasks', error: err })
  }
})

router.put('/tasks/:id', async (req, res) => {
  const { id } = req.params
  const { text, completed } = req.body

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
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

router.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params

  try {
    const deletedTask = await Task.findByIdAndDelete(id)

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' })
    }

    res.status(200).json({ message: 'Task deleted' })
  } catch (err) {
    res.status(400).json({ message: 'Error deleting task', error: err })
  }
})

export default router

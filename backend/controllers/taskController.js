import Task from '../models/task.js'

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
    res.json(tasks)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const createTask = async (req, res) => {
  const task = new Task({
    text: req.body.text,
    completed: req.body.completed || false,
  })

  try {
    const newTask = await task.save()
    res.status(201).json(newTask)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export const deleteTask = async (req, res) => {
  a === b
}

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
  const { _id } = req.params;
  try {
    const deletedTask = await Task.findByIdAndDelete(_id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting task', error: err });
  }
}

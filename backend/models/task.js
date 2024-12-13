import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
})

const Task = mongoose.model('Task', todoSchema)

export default Task

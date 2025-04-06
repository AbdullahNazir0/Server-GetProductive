import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { Task } from '../models/task.model.js'
import moment from 'moment'
import mongoose from 'mongoose'

const createTask = asyncHandler(async (req, res) => {
  const { title, description, deadline, priority } = req.body
  const id = req.userId

  if (title.trim() == '') {
    throw new ApiError(400, 'Title is required')
  }

  try {
    await Task.create({
      title,
      description,
      deadline,
      priority,
      userId: req.userId
    })
  } catch(error) {
    console.log(error)
  }

  res.status(201).json(new ApiResponse(201, 'createdTask', 'Task created successfully'))
})

const getHomeTasks = asyncHandler(async (req, res) => {
  const id = new mongoose.Types.ObjectId(req.userId)

  const today = moment().startOf("day").toDate()
  const tasks = await Task.find({
    userId: id,
    $or: [
      { createdAt: { $gte: today } },
      { isDone: false, createdAt: { $lt: today } }
    ]
  }).sort({ createdAt: 1 })

  res.status(200).json(new ApiResponse(200, tasks, 'Home Tasks retrieved successfully'))
})

const getAllTasks = asyncHandler(async (req, res) => {
  const id = req.userId

  const tasks = await Task.aggregate([
    {
      $match: { userId: id }
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        tasks: { $push: "$$ROOT" },
      }
    },
    {
      $sort: { _id: -1 }
    }
  ])
  if (!tasks) {
    throw new ApiError(404, 'Tasks not found')
  }

  res.status(200).json(new ApiResponse(200, tasks, 'Tasks retrieved successfully'))
})

const getTasks = asyncHandler(async (req, res) => {
  const id = req.userId

  const tasks = await Task.find({ userId: id })
  if (!tasks) {
    throw new ApiError(404, 'Tasks not found')
  }

  res.status(200).json(new ApiResponse(200, tasks, 'Tasks retrieved successfully'))
})

const getTaskById = asyncHandler(async (req, res) => {
  const id = req.params.id

  const task = await Task.findById(id)
  if (!task) {
    throw new ApiError(404, 'Task not found')
  }

  res.status(200).json(new ApiResponse(200, task, 'Task retrieved successfully'))
})

const updateTask = asyncHandler(async (req, res) => {
  const id = req.params.id

  const task = await Task.findById(id)
  if (!task) {
    throw new ApiError(404, 'Task not found')
  }

  const { title, description, deadline, priority, isDone } = req.body

  if (title.trim() === '') {
    throw new ApiError(400, 'Title is required')
  }

  const updatedTask = await Task.findByIdAndUpdate(id, {
    title,
    description,
    deadline,
    priority,
    isDone
  }, { new: true })
  if (!updatedTask) {
    throw new ApiError(500, 'Failed to update task')
  }

  res.status(200).json(new ApiResponse(200, updatedTask, 'Task updated successfully'))
})

const deleteTask = asyncHandler(async (req, res) => {
  const id = req.params.id

  const task = await Task.findById(id)
  if (!task) {
    throw new ApiError(404, 'Task not found')
  }

  const deletedTask = await Task.findByIdAndDelete(id)
  if (!deletedTask) {
    throw new ApiError(500, 'Failed to delete task')
  }

  res.status(200).json(new ApiResponse(200, task, 'Task deleted successfully'))
})

export {
  getHomeTasks,
  getAllTasks,
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
}

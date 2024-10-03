import mongoose from "mongoose";
import { Task } from "../models/taskModel.js";

// Create a new task
const createTask = async (req, res) => {
    const { title, description, category, assignedTo, dueDate } = req.body;

    try {
        // Ensure req.user exists (e.g., from middleware)
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized user" });
        }

        const task = await Task.create({
            title,
            description,
            category,
            status: "pending", // Default status
            assignedTo,
            createdBy: req.user._id,
            dueDate,
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: "Error creating task", error: error.message });
    }
};

// Fetch all tasks
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate("assignedTo", "username email")
            .populate("createdBy", "username email");

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tasks", error: error.message });
    }
};

// Fetch tasks created by the logged-in user
const getUserTasks = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized user" });
        }

        const tasks = await Task.find({ createdBy: req.user._id });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user tasks", error: error.message });
    }
};

// Update a task
const updateTask = async (req, res) => {
    const { taskId } = req.params;
    const { status, title, description, dueDate } = req.body;

    try {
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Update fields if provided
        if (status) task.status = status;
        if (title) task.title = title;
        if (description) task.description = description;
        if (dueDate) task.dueDate = dueDate;

        await task.save();
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: "Error updating task", error: error.message });
    }
};

// Delete a task
const deleteTask = async (req, res) => {
    const { taskId } = req.params;

    try {
        const task = await Task.findByIdAndDelete(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting task", error: error.message });
    }
};

// Export the controller functions
export {
    createTask,
    getAllTasks,
    getUserTasks,
    updateTask,
    deleteTask,
};

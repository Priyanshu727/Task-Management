import express from "express";
import {
    createTask,
    getAllTasks,
    getUserTasks,
    updateTask,
    deleteTask,
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createTask);

router.get("/", protect, (req, res) => {
    if (req.user.role === "admin") {
        getAllTasks(req, res);
    } else {
        getUserTasks(req, res);
    }
});

router.get("/my-tasks", protect, getUserTasks);

router.put("/:id", protect, updateTask);

router.delete("/:id", protect, deleteTask);

export const taskRouter = router;
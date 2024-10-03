import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["development", "design", "marketing", "other"],
      default: "other",
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  // This references the User model from another file
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  // Also references the User model
      required: true,
    },
    dueDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Export the Task model (not the User model)
export const Task = mongoose.model('Task', taskSchema);

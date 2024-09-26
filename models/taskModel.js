const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: Date, required: true },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Not sure",
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending",
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // user id
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // this doesn't need to send or attach because it set by authentication middleware.
});

module.exports = mongoose.model("Task", TaskSchema);

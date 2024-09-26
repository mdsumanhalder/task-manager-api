const Task = require("../models/taskModel");
const User = require("../models/userModel");

exports.getDashboard = async (req, res) => {
  try {
    if (req.user.role !== "Admin" && req.user.role !== "Manager") {
      return res.status(403).send("Not authorized");
    }

    const tasks = await Task.find();
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
      (task) => task.status === "Completed"
    ).length;
    const pendingTasks = tasks.filter(
      (task) => task.status === "Pending"
    ).length;
    const inProgressTasks = tasks.filter(
      (task) => task.status === "In Progress"
    ).length;

    const users = await User.find();
    const userStats = users.map((user) => ({
      username: user.username,
      tasksAssigned: tasks.filter(
        (task) => task.assignedTo.toString() === user._id.toString()
      ).length,
      tasksCompleted: tasks.filter(
        (task) =>
          task.assignedTo.toString() === user._id.toString() &&
          task.status === "Completed"
      ).length,
    }));

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      userStats,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

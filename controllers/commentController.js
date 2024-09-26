const Comment = require("../models/commentModel");
const Task = require("../models/taskModel");
const Notification = require("../models/notificationModel");

exports.addComment = async (req, res) => {
  const { taskId, text } = req.body;
  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).send("Task not found");

    const comment = new Comment({
      taskId,
      userId: req.user.id,
      text,
    });

    await comment.save();

    const notification = new Notification({
      userId: task.createdBy,
      message: `New comment on your task "${task.title}": ${text}`,
    });
    await notification.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ taskId: req.params.taskId }).populate(
      "userId"
    );
    res.json(comments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

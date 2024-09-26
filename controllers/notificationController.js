const Notification = require("../models/notificationModel");
const nodemailer = require("nodemailer");

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other services like SendGrid, or Mailgun
  auth: {
    user: process.env.EMAIL, // your email here
    pass: process.env.PASSWORD, // your email password here
  },
});

// Function to send an email notification
const sendEmailNotification = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to, // recipient's email
    subject,
    text,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Error sending email: ", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id });
    res.json(notifications);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).send("Notification not found");

    notification.read = true;
    await notification.save();

    // Send an email when a notification is marked as read
    const userEmail = req.user.email; // Assuming the email is attached to the request
    sendEmailNotification(
      userEmail,
      "Task Notification Marked as Read",
      `The task with the title "${notification.title}" has been marked as read.`
    );

    res.json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const notification = new Notification({
      userId: req.body.userId,
      title: req.body.title,
      description: req.body.description,
    });
    await notification.save();

    // Send an email to the assignee
    const userEmail = req.body.email; // The assignee's email (get it from the request)
    sendEmailNotification(
      userEmail,
      "New Task Assigned",
      `A new task titled "${notification.title}" has been assigned to you. Please check your dashboard.`
    );

    res.json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

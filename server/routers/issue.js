const express = require("express");
const Issue = require("../models/Issue"); // Assuming the model is in the models folder
const { verifyUser, requireAdmin } = require("../middlewares/auth.middlewares");

const router = express.Router();

// Issue creation route
router.post('/issues', verifyUser, async (req, res) => {
  const { userId, userName, userRegNumber, issue } = req.body;
console.log(req.body);
  try {
    // Create a new issue document
    const newIssue = new Issue({
      userId,
      userName,
      userRegNumber,
      issue,
    });

    // Save the issue to the database
    const savedIssue = await newIssue.save();

    res.status(201).json({
      message: 'Issue submitted successfully!',
      issue: savedIssue,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error submitting the issue',
      error: error.message,
    });
  }
});

router.get("/fetchIssues", verifyUser, async (req, res) => {
    try {
        const issues = await Issue.find(); // Retrieve all issues from the database
        res.status(200).json(issues); // Send issues as a JSON response
    } catch (error) {
        res.status(500).json({
            message: "Error fetching issues",
            error: error.message,
        });
    }
});
router.put('/solveIssues/:id', verifyUser, async (req, res) => {
    const { status } = req.body;
    try {
      const updatedIssue = await Issue.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
      res.status(200).json({
        message: 'Issue status updated successfully!',
        issue: updatedIssue,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error updating issue status',
        error: error.message,
      });
    }
  });
  router.delete('/deleteIssues/:id', verifyUser, requireAdmin, async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedIssue = await Issue.findByIdAndDelete(id);
  
      if (!deletedIssue) {
        return res.status(404).json({ message: 'Issue not found' });
      }
  
      res.status(200).json({ message: 'Issue deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting the issue', error: error.message });
    }
  });

module.exports = router;

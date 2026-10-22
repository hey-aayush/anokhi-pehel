const mongoose = require('mongoose');
const { Schema } = mongoose;

const IssueSchema = new Schema({
  userId: { type: String, required: true }, // User ID of the person raising the issue
  userName: { type: String, required: true }, // Name of the user raising the issue
  userRegNumber: { type: String, required: true }, // Registration number of the user
  issue: { type: String, required: true }, // Description of the issue
  status: {
    type: String,
    enum: ['unsolved', 'in-progress', 'resolved'], // Possible values for status
    default: 'unsolved', // Default status when issue is created
  },
  createdAt: { type: Date, default: Date.now }, // Date the issue was created
});

IssueSchema.index({ status: 1 });
IssueSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Issue', IssueSchema);

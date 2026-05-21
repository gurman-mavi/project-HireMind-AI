const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  interviewType: {
    type: String,
    required: true,
    default: 'General'
  },
  overallScore: {
    type: Number,
    required: true
  },
  technicalAccuracy: {
    type: Number,
    default: 0
  },
  communicationScore: {
    type: Number,
    default: 0
  },
  confidenceScore: {
    type: Number,
    default: 0
  },
  strengths: {
    type: [String],
    default: []
  },
  improvements: {
    type: [String],
    default: []
  },
  timelineData: {
    type: Array,
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);

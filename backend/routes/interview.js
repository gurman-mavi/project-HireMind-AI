const express = require('express');
const { generateQuestion, evaluateAnswer, evaluateInterview } = require('../services/geminiService');
const Report = require('../models/Report');
const router = express.Router();

// Generate the next interview question based on history and resume context
router.post('/next-question', async (req, res) => {
  try {
    const { history, resumeContext, role } = req.body;
    const question = await generateQuestion(history, resumeContext, role);
    res.json({ question });
  } catch (error) {
    console.error('Error generating question:', error);
    res.status(500).json({ error: 'Failed to generate question' });
  }
});

// Evaluate user's answer
router.post('/evaluate', async (req, res) => {
  try {
    const { question, answer } = req.body;
    const evaluation = await evaluateAnswer(question, answer);
    res.json(evaluation);
  } catch (error) {
    console.error('Error evaluating answer:', error);
    res.status(500).json({ error: 'Failed to evaluate answer' });
  }
});

// Evaluate full interview transcript
router.post('/evaluate-interview', async (req, res) => {
  try {
    const { history } = req.body;
    const evaluation = await evaluateInterview(history);
    res.json(evaluation);
  } catch (error) {
    console.error('Error evaluating full interview:', error);
    res.status(500).json({ error: 'Failed to evaluate interview' });
  }
});

// Save evaluated report to DB
router.post('/report', async (req, res) => {
  try {
    const { userId, interviewType, overallScore, technicalAccuracy, communicationScore, confidenceScore, strengths, improvements, timelineData } = req.body;
    
    const newReport = new Report({
      userId,
      interviewType,
      overallScore,
      technicalAccuracy,
      communicationScore,
      confidenceScore,
      strengths,
      improvements,
      timelineData
    });
    
    await newReport.save();
    res.status(201).json({ message: 'Report saved successfully', report: newReport });
  } catch (error) {
    console.error('Error saving report:', error);
    res.status(500).json({ error: 'Failed to save report' });
  }
});

// Fetch reports for a specific user
router.get('/reports/:userId', async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

module.exports = router;

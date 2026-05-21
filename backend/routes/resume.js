const express = require('express');
const multer = require('multer');
const { analyzeResume } = require('../services/geminiService');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded' });
    }

    // Convert buffer to string. For PDFs, we ideally need a PDF parser.
    // For simplicity in this demo, we assume the user uploads a text-based resume (TXT or simple PDF parsing).
    // In a real app, use pdf-parse to extract text.
    // To make it simple for the college project MVP without extra deps, we expect raw text or a basic readable format.
    const resumeText = req.file.buffer.toString('utf-8');

    const analysis = await analyzeResume(resumeText);
    
    res.json(analysis);
  } catch (error) {
    console.error('Error in resume upload:', error);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
});

module.exports = router;

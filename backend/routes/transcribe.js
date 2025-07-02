import express from 'express';
import multer from 'multer';
import { transcribeAudio } from '../services/whisper.js';

const upload = multer();
const router = express.Router();

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const transcript = await transcribeAudio(req.file.buffer);
    res.json({ text: transcript });
  } catch (err) {
    res.status(500).json({ error: 'Transcription failed' });
  }
});

export default router;

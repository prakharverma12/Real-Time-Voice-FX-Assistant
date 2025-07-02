import express from 'express';
import { synthesizeSpeech } from '../services/tts-engine.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { text } = req.body;
  const audioBuffer = await synthesizeSpeech(text);
  res.set('Content-Type', 'audio/wav');
  res.send(audioBuffer);
});

export default router;

import express from 'express';
import { parseIntent } from '../services/openai-intent.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { text } = req.body;
  const intent = await parseIntent(text);
  res.json({ effects: intent });
});

export default router;

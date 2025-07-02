import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import transcribeRoute from './routes/transcribe.js';
import intentRoute from './routes/intent.js';
import ttsRoute from './routes/tts.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/transcribe', transcribeRoute);
app.use('/api/intent', intentRoute);
app.use('/api/tts', ttsRoute);

app.listen(5000, () => {
  console.log('Server running at http://localhost:5000');
});
app.get('/', (req, res) => {
  res.send('Welcome to the AI Assistant API');
});
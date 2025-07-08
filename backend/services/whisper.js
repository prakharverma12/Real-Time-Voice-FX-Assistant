import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.ASSEMBLYAI_API_KEY;
const uploadEndpoint = 'https://api.assemblyai.com/v2/upload';
const transcriptEndpoint = 'https://api.assemblyai.com/v2/transcript';

async function uploadToAssembly(buffer) {
  const response = await axios.post(uploadEndpoint, Readable.from(buffer), {
    headers: {
      authorization: API_KEY,
      'transfer-encoding': 'chunked',
    },
  });
  return response.data.upload_url;
}

async function requestTranscription(audio_url) {
  const response = await axios.post(
    transcriptEndpoint,
    { audio_url },
    {
      headers: {
        authorization: API_KEY,
        'content-type': 'application/json',
      },
    }
  );
  return response.data.id;
}

async function pollTranscription(transcriptId) {
  const pollingEndpoint = `${transcriptEndpoint}/${transcriptId}`;

  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      const res = await axios.get(pollingEndpoint, {
        headers: { authorization: API_KEY },
      });

      const status = res.data.status;

      if (status === 'completed') {
        clearInterval(interval);
        resolve(res.data.text);
      } else if (status === 'error') {
        clearInterval(interval);
        reject(new Error(res.data.error));
      }
    }, 2000); // Poll every 2s
  });
}

export async function transcribeAudio(buffer) {
  const audioUrl = await uploadToAssembly(buffer);
  const transcriptId = await requestTranscription(audioUrl);
  const text = await pollTranscription(transcriptId);
  console.log('Transcription completed:', text);
  return text;
}

export async function parseIntent(text) {
  const keywords = text.toLowerCase();
  const effects = [];

  if (keywords.includes('reverb')) effects.push('reverb');
  if (keywords.includes('delay') || keywords.includes('echo')) effects.push('delay');
  if (keywords.includes('pitch')) effects.push('pitch-shift');
  if (keywords.includes('low')) effects.push('low-pass');
  if (keywords.includes('high')) effects.push('high-pass');
  if (keywords.includes('gain')) effects.push('gain');

  console.log('Parsed intent:', effects);

  return effects;
}

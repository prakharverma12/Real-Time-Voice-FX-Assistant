import vosk from 'vosk';
const { Model, KaldiRecognizer } = vosk;
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';

const modelPath = path.resolve("models/en"); // make sure this is correct
const sampleRate = 16000;

let model;
export function initVoskModel() {
  if (!model) {
    model = new Model(modelPath);
    console.log("🧠 Vosk model loaded.");
  }
}

export async function transcribeAudio(buffer) {
  initVoskModel();

  const recognizer = new KaldiRecognizer(model, sampleRate);
  recognizer.setWords(true);

  const stream = Readable.from(buffer);

  for await (const chunk of stream) {
    recognizer.acceptWaveform(chunk);
  }

  const result = recognizer.finalResult();
  const json = JSON.parse(result);

  return json.text;
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

  return effects;
}

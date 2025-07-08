import { startMic, stopMic, getAudioBlob } from './mic-capture.js';
import { applyEffects } from './audio-engine.js';
import { getIntent } from './intent-handler.js';
import { speak } from './tts.js';
import { log } from './ui.js';

let listening = false;

document.getElementById('talkBtn').onclick = async () => {
  if (listening) return;
  listening = true;
  const fileInput = document.getElementById('uploadBtn'); 

  // ✅ Check if a file is selected
  if (!fileInput.files || fileInput.files.length === 0) {
    log("⚠️ No file selected. Please upload an audio file.");
    listening = false;
    return;
  }

  const file = fileInput.files[0];

  // ✅ Check if file is non-empty
  if (file.size === 0) {
    log("⚠️ Uploaded file is empty.");
    listening = false;
    return;
  }
  log("🎤 Listening...");

  await startMic();
  speak(`PLEASE SPEAK NOW`);
  while (listening) {
    const blob = await getAudioBlob(3000); // record 2-3 sec chunk
    log(`📦 Blob size: ${blob.size} bytes`);
    const transcript = await fetchTranscript(blob);
    if (!transcript) 
    {
      log(`🗣️ You did not speak!`);
      break;
    }
    log(blob);

    log(`🗣️ You: ${transcript}`);

    const effects = await getIntent(transcript);
    log(`🎛️ Applying: ${effects.join(', ')}`);
    applyEffects(effects);

    await speak(`Effect applied: ${effects.join(', ')}. What would you like to do next?`);
  }
};

document.getElementById('stopBtn').onclick = () => {
  listening = false;
  stopMic();
  log("🛑 Stopped.");
};

async function fetchTranscript(blob) {
  const form = new FormData();
  form.append("file", blob, "audio.wav");
  log("📝 Transcribing audio...");
  const res = await fetch("http://localhost:5000/api/transcribe", {
    method: "POST",
    body: form,
  });
  const data = await res.json();
  return data.text;
}

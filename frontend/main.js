import { startMic, stopMic, getAudioBlob } from './mic-capture.js';
import { applyEffects } from './audio-engine.mjs';
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
  
  log("🎧 Playing original uploaded audio...");
  await playBlob(file);

  log("🎤 Listening...");

  await startMic();
  speak(`WHAT EFFECT WOULD YOU LIKE TO APPLY?`);

  while (listening) {
    const blob = await getAudioBlob(7000); // record 2-3 sec chunk
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
    let transformedBlob = await applyEffects(file, effects);

    await speak(`Effect applied: ${effects.join(', ')}. What would you like to do next?`);
    log("🔊 Playing transformed audio...");
    await playBlob(transformedBlob);
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
async function playBlob(blob) {
  const arrayBuffer = await new Response(blob).arrayBuffer(); 
  const audioCtx = new (window.AudioContext || winQAdow.webkitAudioContext)();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

  const source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioCtx.destination);
  source.start();

  return new Promise(resolve => {
    source.onended = resolve;
  });
}

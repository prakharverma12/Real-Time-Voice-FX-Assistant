let mediaStream, mediaRecorder;
let audioChunks = [];


export async function startMic() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) {
        audioChunks.push(e.data);
      }
    };

    console.log("🎙️ Microphone access granted");
  } catch (err) {
    console.error("🚫 Failed to access microphone:", err);
  }
}

export async function getAudioBlob(duration = 3000) {
  return new Promise((resolve, reject) => {
    if (!mediaRecorder) {
      console.error("🚫 mediaRecorder is undefined");
      return reject(new Error("No MediaRecorder"));
    }

    console.log("🚀 Starting audio capture");

    audioChunks = [];

    mediaRecorder.onstart = () => console.log("▶️ Recorder started");
    mediaRecorder.onstop = () => {
      console.log("🛑 Recorder stopped");
      const blob = new Blob(audioChunks, { type: 'audio/wav' });
      console.log("📦 Blob created:", blob);
      resolve(blob);
    };
    mediaRecorder.ondataavailable = e => {
      console.log("🎧 Chunk received:", e.data.size);
      audioChunks.push(e.data);
    };

    mediaRecorder.start();

    setTimeout(() => {
      console.log("⏲️ Stopping recorder after timeout...");
      mediaRecorder.stop();
    }, duration);
  });
}


export function stopMic() {
  mediaRecorder?.stop();
  mediaStream?.getTracks().forEach(t => t.stop());
}

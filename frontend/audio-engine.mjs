let audioCtx, source, dryGain, fxChain;


export async function applyEffects(blob, effects) {
  // Initialize AudioContext if not already
  if (!audioCtx || audioCtx.state === "closed") {
    audioCtx = new AudioContext();
  }

  // Decode audio into AudioBuffer
  const arrayBuffer = await new Response(blob).arrayBuffer();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

  // Create source node from decoded buffer
  source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;

  // Create gain node as first node (volume/base gain)
  const dryGain = audioCtx.createGain();
  let lastNode = dryGain;

  // Build your FX chain dynamically
  for (const effect of effects) {
    switch (effect) {
      case 'reverb': {
        const convolver = audioCtx.createConvolver();
        // You could load and assign an IR here: convolver.buffer = await loadIR();
        convolver.buffer = await loadIR('/ir/irHall.wav');
        lastNode.connect(convolver);
        lastNode = convolver;
        break;
      }
      case 'delay': {
        const delay = audioCtx.createDelay();
        delay.delayTime.value = 0.5; // 0.5s between repeats

        const feedback = audioCtx.createGain();
        feedback.gain.value = 0.4; // how much of the echo is fed back

        // Connect feedback loop
        delay.connect(feedback);
        feedback.connect(delay);

        lastNode.connect(delay);
        lastNode = delay;
        break;
      }

      case 'gain': {
        const gain = audioCtx.createGain();
        gain.gain.value = 2.0;
        lastNode.connect(gain);
        lastNode = gain;
        break;
      }
      case 'pitch-shift':
        console.warn("⚠️ Pitch-shift is complex and not implemented here.");
        break;
    }
  };

  // Route to MediaStream destination
  const dest = audioCtx.createMediaStreamDestination();
  lastNode.connect(dest); // for recording only
  // Optional: also connect to audioCtx.destination if you want to monitor live

  // Record the processed audio stream
  const recorder = new MediaRecorder(dest.stream);
  const chunks = [];

  recorder.ondataavailable = e => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  const recordedBlob = new Promise(resolve => {
    recorder.onstop = () => {
      const outBlob = new Blob(chunks, { type: 'audio/webm' });
      resolve(outBlob);
    };
  });

  recorder.start();
  source.connect(dryGain);  // start audio chain
  source.start();

  // Wait until audio finishes playing through graph
  await new Promise(resolve => {
    source.onended = resolve;
  });

  recorder.stop();
  return recordedBlob;  // ✅ processed audio blob, ready to be played elsewhere
}

async function loadIR(url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return await audioCtx.decodeAudioData(arrayBuffer);
}

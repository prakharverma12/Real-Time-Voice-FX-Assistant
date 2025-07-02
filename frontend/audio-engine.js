let audioCtx, source, dryGain, fxChain;

export function applyEffects(effects) {
  if (!audioCtx) {
    audioCtx = new AudioContext();
    dryGain = audioCtx.createGain();
    dryGain.connect(audioCtx.destination);
  }

  // Reset chain
  if (source) source.disconnect();
  fxChain = [];

  effects.forEach(effect => {
    switch (effect) {
      case 'reverb':
        const convolver = audioCtx.createConvolver();
        // Load IR file if you have one (mocked)
        fxChain.push(convolver);
        break;
      case 'delay':
        const delay = audioCtx.createDelay();
        delay.delayTime.value = 0.4;
        fxChain.push(delay);
        break;
      case 'pitch-shift':
        // Use playbackRate hack or external library
        break;
      case 'gain':
        const gain = audioCtx.createGain();
        gain.gain.value = 2.0;
        fxChain.push(gain);
        break;
    }
  });

  // Connect all
  if (fxChain.length > 0) {
    for (let i = 0; i < fxChain.length - 1; i++) {
      fxChain[i].connect(fxChain[i + 1]);
    }
    fxChain.at(-1).connect(audioCtx.destination);
  }
}

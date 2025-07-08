
# 🎙️ Voice FX Assistant

A web-based real-time **duplex voice assistant** that responds to natural speech and manipulates audio using the Web Audio API. Users can apply effects like reverb, echo, pitch-shift, filters, and gain changes — just by talking to it. Upload audio or use your microphone. Built to run fully in the browser with minimal latency.

---

## 🧠 Features

- 🔁 **Full-duplex speech** — Speak and hear the assistant at the same time
- 🎛️ **Voice-controlled audio FX** — Apply effects like reverb, pitch shift, echo, filters
- 🧠 **Local speech recognition** — Uses Vosk (on-device ASR) for fast, private transcription
- 📤 **Upload support** — Apply effects to uploaded audio files
- 🗣️ **Natural commands** — Understands phrases like:
  - “Add reverb”
  - “Reduce echo by 50%”
  - “Pitch shift down three semitones”

---

## 🧱 Tech Stack

### 🖥️ Frontend

- **Vite + Vanilla JS**
- **Web Audio API** for real-time audio graph
- **MediaRecorder** for microphone input
- **SpeechSynthesis API** (or ElevenLabs/OpenAI TTS)
- Simple UI with centered controls

### 🔧 Backend

- **Express.js**
- **Assembly.ai** (speech-to-text via api)
- **Intent parser** to map transcript → audio effects
- File upload endpoint for processing external audio

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/YOUR_USERNAME/voice-fx-assistant.git
cd voice-fx-assistant
````

### 2. Install Dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 3. Run Locally

```bash
# Start backend (port 5000)
cd backend
npm start

# Start frontend (port 5173 or similar)
cd ../frontend
npm run dev
```

---

## 📁 Folder Structure

```
voice-fx-assistant/
├── backend/
│   ├── index.js              # Express server
│   ├── routes/
│   ├── services/
│   │   └── vosk.js           # Vosk ASR logic
│   └── models/               # Vosk model (ignored in Git)
│
├── frontend/
│   ├── index.html
│   ├── main.js               # App entry point
│   ├── audio.js              # Web Audio API graph
│   └── style.css             # Simple UI styles
│
└── .gitignore
```

---

## 🔊 Supported Effects

| Intent Phrase            | Effect Component              |
| ------------------------ | ----------------------------- |
| “Add reverb”             | `ConvolverNode`               |
| “Add delay” or “echo”    | `DelayNode`                   |
| “Pitch shift down”       | `playbackRate` or FFT         |
| “Low pass filter”        | `BiquadFilterNode (lowpass)`  |
| “High pass filter”       | `BiquadFilterNode (highpass)` |
| “Increase volume / gain” | `GainNode`                    |

---

## ✨ Example Flow

1. **User clicks "Start Talking"**
2. Assistant says: “Please speak now.”
3. User says: “Add reverb to my voice.”
4. Assistant applies reverb and plays it back
5. Assistant asks: “What would you like to do next?”
6. User: “Lower the pitch.”
7. Assistant applies pitch shift and responds

---

## 📦 Model Files

Place your Vosk model (e.g., `vosk-model-small-en-us-0.15`) in:

```
backend/models/en/
```

Download from [https://alphacephei.com/vosk/models](https://alphacephei.com/vosk/models)

Ensure it contains:

* `conf/`
* `am/`
* `HCLG.fst`
* `model.conf`

---

## 🛠️ TODO & Future Ideas

* 🎨 Visual FX graph using D3.js or Tone.js
* 🔉 Voice cloning (match user timbre)
* 🧠 RAG-based response generation
* 🌐 WebRTC for P2P audio chat

---

## 🛑 Stopping the Assistant

* Click **Stop** to:

  * Disconnect microphone
  * Cancel all audio nodes
  * Stop listening and speaking

---

## ⚙️ .gitignore

```gitignore
node_modules/
models/
*.log
.env
.DS_Store
Thumbs.db
```

---

## 📝 License

MIT License © \[Your Name or Handle]

---

## 🙌 Credits

* [Vosk Speech Recognition](https://alphacephei.com/vosk/)
* [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
* [OpenAI](https://platform.openai.com/)
* [ElevenLabs](https://www.elevenlabs.io/) (for optional TTS)


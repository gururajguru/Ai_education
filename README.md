# 🌌 Adaptive AI Learning Universe

Welcome to the **Adaptive AI Learning Universe**, a next-generation personalized educational ecosystem. It utilizes real-time biometric indicators and cognitive state tracking (attention spans, fatigue levels, and stress ratings) to dynamically optimize learning speeds, adjust quiz difficulties, structure customized study schedules, and establish virtual co-working networks.

---

## 🚀 Key Innovation Highlights

### 1. Pedagogical Mode Swapper
Students can toggle between **5 core learning modes** dynamically inside their navigation HUD:
- **Beginner Mode**: Conceptual structures explained using simple terminology and day-to-day analogies.
- **Fast Learner Mode**: Condensed bullet summaries, mathematical vectors, and hyper-direct conceptual statements.
- **Exam Prep Mode**: Structured notes formatted as checklists, equations, pitfall guidelines, and exam review prompts.
- **Revision Mode**: Short, active questions and flashcards.
- **Visual Learning**: SVG node diagrams, ASCII visual system paths, and graphical layouts.

### 2. Cognitive biometric scanning 👁️
Uses your webcam to scan facial retention markers in real time:
- **Attention Monitor**: Measures focused attention span, recommending deep breathing breaks if values drop.
- **Stress Diagnostic**: Measures stress loads, automatically toggling the AI Tutor to **Beginner Mode** if stress climbs past critical levels.
- **Fatigue Indicator**: Monitors fatigue index parameters, prompting the student for active learning breaks if fatigue spikes.

### 3. Gemini Cog-Tutor chatbot
An interactive tutoring agent allowing voice-to-text input (Web Speech API) and multilingual translations. It adjusts response coordinates based on active pedagogical modes.

### 4. Adaptive quiz matrix
Custom quizzes generated on the fly. It displays instant score summaries, correct choices visual indicators, and detailed AI explanations of mistakes. Perfect score achievements unlock celestial badges.

### 5. Holographic co-working channels
Collaborative co-working networks containing simulated student holograms. Participating in room chats generates simulated study-partner responses, encouraging streak compliance.

---

## 🛠️ Technological Stack

### Frontend (`client/`)
- **Core Library**: React.js (Vite, JS ES6)
- **Styling**: Tailwind CSS + Custom Vanilla keyframes for futuristic glassmorphisms and neon glowing cards.
- **Animations**: Framer Motion for premium, smooth transitions and 3D card flips.
- **Visual Data**: Recharts plotting aggregate biometrics.
- **Audio Inputs**: SpeechRecognition browser Web Speech API.

### Backend (`server/`)
- **Runtime**: Node.js + Express
- **AI Core**: Google Gemini Generative AI SDK (`gemini-1.5-flash` model).
- **Fallback Engine**: Implements an intelligent, offline mock educational expert system if no API key is specified, ensuring the submission runs perfectly out-of-the-box.

---

## 💻 Sandbox Installation Guidelines

### Prerequisites
- Node.js installed (v18.x or above recommended)
- Google Chrome browser (for speech dictation controls)

### 1. Clone or Open Workspace
Open the project directory in your IDE:
```bash
C:\Users\gurur\.gemini\antigravity-ide\scratch\adaptive-ai-learning-universe
```

### 2. Set Up Environment Variables
Copy the server env file inside the `server/` subdirectory:
```bash
cd server
cp .env.example .env
```
Open `.env` and paste your custom Google Gemini API Key:
```env
GEMINI_API_KEY=your_google_gemini_api_key
```
*(If left blank, the app will run beautifully utilizing local knowledge structures).*

### 3. Spin Up Backend Server
From the root folder, launch the backend Node dependencies:
```bash
cd server
npm install
npm start
```
The server will boot on port `http://localhost:5000`.

### 4. Spin Up Frontend Web Server
In a new terminal window, boot the React Vite environment:
```bash
cd client
npm install
npm run dev
```
The web app will open at: **`http://localhost:3000`**.

---

## 🧠 AI Integration Mechanics
The Gemini LLM model is queried utilizing structured system instructions indicating the current student's mode preference.
```javascript
let systemPrompt = `You are an AI Tutor operating in [${mode} Mode]. 
- Beginner Mode: Use analogies, avoid jargon.
- Fast Learner Mode: Output brief bullet metrics.
- Exam Prep Mode: Focus on cheat sheets and test equations.`;
```
This instructions prompt is appended directly into user chat prompts before submission to the Google API router.

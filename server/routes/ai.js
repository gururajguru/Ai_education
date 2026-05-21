const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API client if key exists
let genAI = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log('🤖 Google Gemini AI client successfully initialized!');
}

// System Startup logs documenting AI provider priority
if (process.env.GROQ_API_KEY) {
  console.log('⚡ Groq Blazing-Fast AI Accelerator successfully initialized! Using Llama 3.3.');
} else {
  console.warn('⚠️ GROQ_API_KEY missing in env. Groq disabled.');
}

/**
 * Helper to call Groq OpenAI-compatible Chat Completions API
 * Natively supports JSON mode for structured outputs!
 */
const callGroqAPI = async (messages, jsonMode = false) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  try {
    const payload = {
      model: 'llama-3.3-70b-versatile',
      messages: messages,
      temperature: 0.7
    };
    
    if (jsonMode) {
      payload.response_format = { type: 'json_object' };
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[GROQ API ERROR] Status ${response.status}:`, errText);
      return null;
    }

    const data = await response.json();
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content;
    }
    return null;
  } catch (error) {
    console.error('[GROQ API FETCH EXCEPTION]', error);
    return null;
  }
};

// 1. AI Tutor Chat Endpoint
router.post('/chat', async (req, res) => {
  const { message, history, mode, language } = req.body;
  const targetLanguage = language || 'English';

  const systemPrompt = `You are a futuristic, friendly AI Tutor in the "Adaptive AI Learning Universe" ecosystem.
Current Learning Mode: [${mode || 'Beginner'}]. 
You must respond in [${targetLanguage}].

Adapt your explanation style to the current mode:
- Beginner: Break down complex terms, use analogies, avoid high jargon.
- Fast Learner: Provide direct, condensed summaries, reference advanced metrics, be quick and precise.
- Exam Prep: Structure your notes as exam cheat sheets, list equations, bullet-point critical takeaways, highlight common examiner pitfalls.
- Revision: Create quick fill-in-the-blanks, ask short review questions, and keep answers to 1-2 punchy sentences.
- Visual Learning: Describe ASCII charts, outline systems structurally, separate sections with emoji-labeled bullet points, and write clear conceptual hierarchies.`;

  // Try Groq first for blazing-fast Llama 3 completions
  if (process.env.GROQ_API_KEY) {
    const messages = [
      { role: 'system', content: systemPrompt }
    ];
    
    if (history && Array.isArray(history)) {
      history.forEach(item => {
        messages.push({
          role: item.sender === 'user' ? 'user' : 'assistant',
          content: item.text
        });
      });
    }
    
    messages.push({ role: 'user', content: message });
    
    const groqResponse = await callGroqAPI(messages, false);
    if (groqResponse) {
      return res.json({ response: groqResponse });
    }
    console.log('🔄 Groq chat completion failed or rate-limited. Falling back to Gemini...');
  }

  // Fallback 1: Google Gemini API
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `${systemPrompt}\n\nUser Message: ${message}\nAI Tutor:`;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return res.json({ response: text });
    } catch (err) {
      console.error('🔄 Gemini chat request failed. Falling back to mock...');
    }
  }

  // Fallback 2: Dynamic Mock AI Responses (Zero-config offline mode)
  setTimeout(() => {
    let responseText = '';
    const lowercaseMsg = message.toLowerCase();

    if (lowercaseMsg.includes('perceptron') || lowercaseMsg.includes('neural')) {
      if (mode === 'Beginner') {
        responseText = `🌌 **AI Tutor (Beginner Mode)**: Let's picture a Single Perceptron as a simple decision-making switch! Imagine you are deciding whether to play soccer. You look at three factors (weights):
1. Is it raining? (Weight: high negative)
2. Are your friends going? (Weight: high positive)
3. Do you have a soccer ball? (Weight: medium positive)

The perceptron adds all these factors together. If the sum exceeds a certain "threshold" (called bias), the switch flips to **Yes**! Otherwise, it says **No**. Multi-Layer Perceptrons are just thousands of these switches linked together so they can handle complex decisions, like recognizing a cat photo! 🐱`;
      } else if (mode === 'Fast Learner') {
        responseText = `⚡ **AI Tutor (Fast Learner Mode)**: 
*   **Perceptron Definition**: The basic unit of an artificial neural network, calculating a weighted sum of inputs plus bias, passing it through an activation function $\\sigma(\\sum w_i x_i + b)$.
*   **Multi-Layer Perceptron (MLP)**: A feedforward neural network comprising input, hidden, and output layers.
*   **Gradient Computation**: $\\delta_j^l = \\frac{\\partial C}{\\partial z_j^l}$. Weights adjust in the opposite direction of the gradient: $W \\leftarrow W - \\eta \\nabla C$.
*   **Optimization**: Standard stochastic gradient descent updates are optimized using Adam ($m_t$ and $v_t$ tracking first/second momentum) to prevent getting stuck in local saddle points.`;
      } else {
        responseText = `📝 **AI Tutor (General Mode)**: A perceptron is the fundamental building block of deep learning. In Multi-layer perceptrons, layers of nodes map inputs to targets using mathematical transformations, where layers learn hidden abstractions by updating weight matrices through backpropagation gradients. Need an equation breakdown or a custom review flashcard? Just let me know!`;
      }
    } else if (lowercaseMsg.includes('quantum') || lowercaseMsg.includes('qubit')) {
      responseText = `⚛️ **AI Tutor (Quantum Computing Mode)**:
Superposition is the ability of a quantum system to be in multiple states simultaneously. Think of a spinning coin. While it spins, it isn't strictly heads or tails; it's a dynamic mix of both. 
Only when you stop it (measure it) does it collapse into heads or tails!
- **State Vector representation**: $|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$ where $|\\alpha|^2 + |\\beta|^2 = 1$.
- **Entanglement**: Einstein famously called this "spooky action at a distance." Changing the state of one entangled qubit instantly correlates the state of the other, no matter the physical distance.`;
    } else if (lowercaseMsg.includes('hello') || lowercaseMsg.includes('hi') || lowercaseMsg.includes('hey')) {
      responseText = `👋 Hello Explorer! Welcome to the **Adaptive AI Learning Universe**. I am your dedicated **${mode || 'Beginner'} Mode** tutor. What concepts are we exploring today? You can ask me to explain "Perceptrons", "Quantum Qubits", or generate dynamic exam study planners!`;
    } else {
      responseText = `🌌 **AI Tutor**: That is a fascinating topic! In **${mode || 'Beginner'} Mode**, we look at how this builds the future. 
Here is a structured explanation:
1. **Core Concept**: It connects to our main framework.
2. **Key Analogy**: Imagine it like cells in a brain collaborating.
3. **Takeaway**: By studying this step-by-step, we build robust pathways.

*Tip: You can toggle the AI Learning Switch in the top right to Beginner, Fast Learner, or Exam Prep to change how I explain concepts!*`;
    }

    res.json({ response: responseText });
  }, 600);
});

// 2. AI Summarize Endpoint
router.post('/summarize', async (req, res) => {
  const { content, format } = req.body;
  const prompt = `Summarize the following educational text into a high-impact, professional ${format || 'bullet-points'} cheat sheet suitable for student review. Include main equations or facts: \n\n${content}`;

  // Try Groq first
  if (process.env.GROQ_API_KEY) {
    const groqSummary = await callGroqAPI([
      { role: 'user', content: prompt }
    ], false);
    if (groqSummary) {
      return res.json({ summary: groqSummary });
    }
  }

  // Fallback 1: Gemini
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return res.json({ summary: text });
    } catch (err) {
      console.error('🔄 Gemini summary failed. Falling back to mock...');
    }
  }

  // Fallback 2: Mock
  setTimeout(() => {
    res.json({
      summary: `🎯 **AI Core Summary (${format || 'Points'})**:\n- **Primary Metric**: Core concepts are structured logically for maximum memory retention.\n- **Optimized Strategy**: Regular study spacing maintains a 95% retention rate compared to cramming.\n- **Key Takeaway**: Understanding basic building blocks yields better performance during high-stakes adaptive quizzes.`
    });
  }, 400);
});

// 3. AI Generated Adaptive Quiz Endpoint
router.post('/generate-quiz', async (req, res) => {
  const { topic, difficulty } = req.body;

  const systemInstructions = `You are an Adaptive Quiz Planner Agent. Generate a 3-question multiple choice quiz on the topic "${topic}" with difficulty level "${difficulty}".
Output ONLY raw valid JSON matching this schema:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answerIndex": 0,
    "explanation": "Why Option A is correct."
  }
]`;

  // Try Groq JSON mode for perfect schemas
  if (process.env.GROQ_API_KEY) {
    const response = await callGroqAPI([
      { role: 'system', content: `${systemInstructions}\nOutput strictly valid JSON without markdown wrapping.` },
      { role: 'user', content: `Create 3 multiple choice questions for ${topic} at ${difficulty} level.` }
    ], true); // Force JSON Mode!

    if (response) {
      try {
        const parsedQuiz = JSON.parse(response);
        return res.json(parsedQuiz);
      } catch (err) {
        console.error('🔄 Failed to parse Groq JSON response:', response);
      }
    }
  }

  // Fallback 1: Gemini
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(systemInstructions);
      const text = result.response.text().trim();
      const cleanedJson = text.replace(/^```json/, '').replace(/```$/, '').trim();
      return res.json(JSON.parse(cleanedJson));
    } catch (err) {
      console.error('🔄 Gemini quiz parser failed. Falling back to mock...');
    }
  }

  // Fallback 2: Mock Quiz Fallback
  setTimeout(() => {
    let mockQuestions = [];
    if (topic.toLowerCase().includes('quantum') || topic.toLowerCase().includes('physics')) {
      mockQuestions = [
        {
          question: "Which of the following describes the quantum state vector equation?",
          options: [
            "|Ψ⟩ = α|0⟩ + β|1⟩ where |α|² + |β|² = 1",
            "F = G(m₁m₂)/d²",
            "E = mc²",
            "|Ψ⟩ = α|0⟩ * β|1⟩ where α + β = 0"
          ],
          answerIndex: 0,
          explanation: "In quantum mechanics, a qubit superposition is represented by a linear combination of basis vectors where coefficients squared sum to 1 representing measurement probabilities."
        },
        {
          question: "What quantum phenomenon did Einstein famously refer to as 'spooky action at a distance'?",
          options: [
            "Superposition",
            "Entanglement",
            "Decoherence",
            "Tunneling"
          ],
          answerIndex: 1,
          explanation: "Quantum entanglement links two particles such that the state of one instantly determines the state of another, which Einstein conceptualized with skepticism."
        }
      ];
    } else {
      mockQuestions = [
        {
          question: "In neural network weights optimization, what role does the learning rate (η) play?",
          options: [
            "It controls the size of steps taken towards local minimums",
            "It defines the total number of layers in the model",
            "It controls activation thresholds",
            "It sets the initial random bias factors"
          ],
          answerIndex: 0,
          explanation: "The learning rate acts as a step scaling coefficient. High learning rates overshoot optimization minimums, while low learning rates slow down convergences."
        },
        {
          question: "What mathematical function is commonly used to adjust weights in an artificial neural network?",
          options: [
            "Cosine Similarity",
            "Backpropagation & Chain Rule",
            "Fourier Transformation",
            "Linear regression slope"
          ],
          answerIndex: 1,
          explanation: "Backpropagation uses the calculus chain rule to calculate partial derivatives of the loss function with respect to weights, adjusting them iteratively."
        }
      ];
    }
    res.json(mockQuestions);
  }, 500);
});

// 4. AI Generated Mindmap Coordinate Endpoint (UPGRADED to support fully custom maps!)
router.post('/generate-mindmap', async (req, res) => {
  const { topic } = req.body;

  const systemInstructions = `You are a Semantic Outline Mindmap Architect. Map 5 crucial connected branches for the topic: "${topic}".
Output ONLY raw valid JSON matching this schema:
{
  "n1": "Label for foundation branch 1",
  "n2": "Label for advanced branch 2",
  "n3": "Label for future branch 3",
  "n4": "Label for sub-concept under branch 1",
  "n5": "Label for sub-concept under branch 2"
}`;

  if (process.env.GROQ_API_KEY) {
    const response = await callGroqAPI([
      { role: 'system', content: systemInstructions },
      { role: 'user', content: `Outline branches for ${topic}.` }
    ], true); // Force JSON Mode!

    if (response) {
      try {
        const labels = JSON.parse(response);
        const mindMapData = {
          root: { id: 'root', label: topic, x: 250, y: 150 },
          nodes: [
            { id: 'n1', label: labels.n1 || 'Foundations', parent: 'root', x: 100, y: 280, color: '#00f2fe' },
            { id: 'n2', label: labels.n2 || 'Advanced Practices', parent: 'root', x: 250, y: 280, color: '#8a2be2' },
            { id: 'n3', label: labels.n3 || 'Future Horizons', parent: 'root', x: 400, y: 280, color: '#ff007f' },
            { id: 'n4', label: labels.n4 || 'Core Theories', parent: 'n1', x: 50, y: 380, color: '#39ff14' },
            { id: 'n5', label: labels.n5 || 'Deployments', parent: 'n2', x: 250, y: 380, color: '#39ff14' }
          ]
        };
        return res.json(mindMapData);
      } catch (err) {
        console.error('🔄 Failed to parse custom mindmap nodes. Using mock layout.');
      }
    }
  }

  // Offline/Mock Mindmap
  const mindMapData = {
    root: { id: 'root', label: topic, x: 250, y: 150 },
    nodes: [
      { id: 'n1', label: 'Core Foundations', parent: 'root', x: 100, y: 280, color: '#00f2fe' },
      { id: 'n2', label: 'Advanced Practices', parent: 'root', x: 250, y: 280, color: '#8a2be2' },
      { id: 'n3', label: 'Future Horizons', parent: 'root', x: 400, y: 280, color: '#ff007f' },
      { id: 'n4', label: 'Mathematical Logic', parent: 'n1', x: 50, y: 380, color: '#39ff14' },
      { id: 'n5', label: 'Real-world Deployment', parent: 'n2', x: 250, y: 380, color: '#39ff14' }
    ]
  };
  res.json(mindMapData);
});

// 5. AI Generated Flashcards Endpoint (UPGRADED to support fully custom flashcards!)
router.post('/generate-flashcards', async (req, res) => {
  const { topic } = req.body;

  const systemInstructions = `You are a Flashcard Architect. Generate 3 core Q&A cards for the topic: "${topic}".
Output ONLY raw valid JSON matching this schema:
[
  {
    "question": "Question text here?",
    "answer": "Answer text here?"
  }
]`;

  if (process.env.GROQ_API_KEY) {
    const response = await callGroqAPI([
      { role: 'system', content: systemInstructions },
      { role: 'user', content: `Generate 3 flashcards for ${topic}.` }
    ], true); // Force JSON Mode!

    if (response) {
      try {
        const cards = JSON.parse(response);
        const mappedCards = cards.map(c => ({
          question: c.question,
          answer: c.answer,
          category: topic
        }));
        return res.json(mappedCards);
      } catch (err) {
        console.error('🔄 Failed to parse flashcard JSON. Using static deck.');
      }
    }
  }

  // Static Fallback Flashcards
  const flashcards = [
    { question: `What is the core challenge in studying ${topic}?`, answer: 'Balancing micro-foundational learning curves with practical building paradigms.', category: topic },
    { question: `Define the primary theorem governing ${topic}.`, answer: 'Optimization equations must balance parameter scales to minimize general loss values.', category: topic },
    { question: `Name a common real-world application of ${topic}.`, answer: 'Large-scale predictive models, real-time control loops, and low-latency digital frameworks.', category: topic }
  ];
  
  res.json(flashcards);
});

module.exports = router;

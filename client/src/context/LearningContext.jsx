import React, { createContext, useState, useEffect } from 'react';

export const LearningContext = createContext();

const INITIAL_COURSES = [
  {
    id: 'c1',
    title: 'Advanced Neural Networks & Deep Learning',
    subject: 'Artificial Intelligence',
    progress: 75,
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=400&q=80',
    summary: 'A comprehensive study of artificial neural architectures, weight adjustments, backpropagation, and transformers.',
    lessons: [
      { id: 'l1', title: 'Perceptrons & Multi-Layer Perceptrons', completed: true, content: 'A perceptron is an algorithm for supervised learning of binary classifiers. Multi-layer perceptrons use backpropagation to learn weights.' },
      { id: 'l2', title: 'Gradient Descent Optimization', completed: true, content: 'Stochastic Gradient Descent (SGD), Adam, and RMSprop optimization functions adjust model weights based on loss gradients.' },
      { id: 'l3', title: 'Attention Mechanism & Transformers', completed: false, content: 'Attention mechanisms allow models to focus on specific segments of input sequences, paving the way for large language models (LLMs).' }
    ]
  },
  {
    id: 'c2',
    title: 'Modern Quantum Computing Fundamentals',
    subject: 'Physics & Computing',
    progress: 40,
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=400&q=80',
    summary: 'Explore qubits, quantum superposition, quantum entanglement, and elementary quantum algorithms (Deutsch-Jozsa, Shor).',
    lessons: [
      { id: 'l4', title: 'Qubits & Superposition states', completed: true, content: 'Unlike bits (0 or 1), a qubit exists in a superposition of states |0⟩ and |1⟩ until measured.' },
      { id: 'l5', title: 'Quantum Entanglement & Gates', completed: false, content: 'Entanglement allows qubits to correlate instantly. Quantum logic gates act on qubits to perform computations.' },
      { id: 'l6', title: 'Shor\'s Prime Factorization', completed: false, content: 'Shor\'s algorithm can factor integers in polynomial time, posing a structural challenge to RSA cryptosystems.' }
    ]
  },
  {
    id: 'c3',
    title: 'Full-Stack Edge Architectures & WebRTC',
    subject: 'Software Engineering',
    progress: 10,
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80',
    summary: 'Discover how serverless computing, edge databases, and WebRTC streaming build instantaneous global real-time applications.',
    lessons: [
      { id: 'l7', title: 'Edge vs Origin servers', completed: true, content: 'Edge servers are placed closer to the user to reduce network roundtrip delays.' },
      { id: 'l8', title: 'WebRTC P2P Data Handshakes', completed: false, content: 'WebRTC creates low-latency audio, video, and data transmission directly between web browsers.' },
      { id: 'l9', title: 'Serverless Functions at Edge', completed: false, content: 'Edge runtimes run tiny sandboxed code instances globally, minimizing cold starts.' }
    ]
  }
];

const INITIAL_FLASHCARDS = [
  { id: 'fc1', question: 'What is Backpropagation?', answer: 'The mathematical method used in artificial neural networks to calculate gradients of loss functions for weight updates.', category: 'Deep Learning' },
  { id: 'fc2', question: 'What is Quantum Superposition?', answer: 'The quantum principle where a physical system can be in multiple states simultaneously until it is measured.', category: 'Quantum Physics' },
  { id: 'fc3', question: 'What does WebRTC stand for?', answer: 'Web Real-Time Communication. It enables direct peer-to-peer audio, video, and data streaming between browsers.', category: 'Networking' }
];

const INITIAL_PLANNER = [
  { id: 'p1', task: 'Review Perceptrons Backprop equations', date: 'Today', difficulty: 'Hard', duration: 45, completed: false },
  { id: 'p2', task: 'Practice Shor\'s algorithm quiz questions', date: 'Tomorrow', difficulty: 'Hard', duration: 60, completed: false },
  { id: 'p3', task: 'Complete WebRTC PeerConnection session', date: 'Saturday', difficulty: 'Medium', duration: 30, completed: false }
];

const INITIAL_ROOMS = [
  {
    id: 'room1',
    name: 'Neural Network Deep Dive 🧠',
    activeUsers: [
      { name: 'Alex H.', status: 'Coding', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80' },
      { name: 'Sophia M.', status: 'Reading', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&q=80' }
    ],
    messages: [
      { id: 'm1', sender: 'Alex H.', text: 'Does anyone have a good mindmap for transformer self-attention formulas?', time: '2 mins ago' },
      { id: 'm2', sender: 'Sophia M.', text: 'I am checking the AI Memory generator! It just outputted a mindmap in the Tutor section!', time: '1 min ago' }
    ],
    productivity: 88
  },
  {
    id: 'room2',
    name: 'Quantum Physics Prep ⚛️',
    activeUsers: [
      { name: 'Marcus L.', status: 'Quiz Prep', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=128&q=80' }
    ],
    messages: [
      { id: 'm3', sender: 'Marcus L.', text: 'Superposition quiz is challenging but beautiful! Let me know if anyone wants to do a practice test.', time: '5 mins ago' }
    ],
    productivity: 94
  }
];

export const LearningProvider = ({ children }) => {
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('universe_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [flashcards, setFlashcards] = useState(() => {
    const saved = localStorage.getItem('universe_flashcards');
    return saved ? JSON.parse(saved) : INITIAL_FLASHCARDS;
  });

  const [planner, setPlanner] = useState(() => {
    const saved = localStorage.getItem('universe_planner');
    return saved ? JSON.parse(saved) : INITIAL_PLANNER;
  });

  const [studyRooms, setStudyRooms] = useState(() => {
    const saved = localStorage.getItem('universe_studyrooms');
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('universe_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem('universe_announcements');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'ann1',
        title: 'Deep Learning Practical Grades Released 🧠',
        content: 'I have finalized grading for the Layer Propagation derivations. Review your feedback inside Smart Courses. Live adaptive tutoring is active for those needing recovery points!',
        date: 'May 21, 2026',
        author: 'Dr. Evelyn Vance (AI Faculty)'
      },
      {
        id: 'ann2',
        title: 'Quantum Computing Lab Preparation ⚛️',
        content: 'Please calibrate your Qubit Superposition state models prior to Friday\'s lab session. Use the Spaced Repetition Active Recall engine to lock down your linear vectors.',
        date: 'May 20, 2026',
        author: 'Professor Marcus Sterling (Physics Department)'
      }
    ];
  });

  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem('universe_assignments');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'as1',
        title: 'Neural Network Weight Adjustment Derivations',
        description: 'Derive loss gradients with respect to weights for a 3-layer MLP using sigmoid activation functions. Show intermediate chain-rule equations.',
        dueDate: 'May 28, 2026',
        courseId: 'c1',
        submissions: [
          { studentName: 'ALEX H.', content: 'Completed sigmoid gradient equations and verified in PyTorch tensor matrices. Loss converges beautifully at 0.015.', submittedAt: '1 day ago', grade: '96/100', feedback: 'Perfect calculations!' },
          { studentName: 'SOPHIA M.', content: 'Completed backprop matrix multiplication derivation. Layer weights verified.', submittedAt: '2 hours ago', grade: 'Pending', feedback: '' }
        ]
      },
      {
        id: 'as2',
        title: 'Qubit Superposition & Bloch Sphere Plotting',
        description: 'Compute the probability amplitudes for a qubit state in superposition. Explain how a Hadamard gate transitions a state vector.',
        dueDate: 'June 02, 2026',
        courseId: 'c2',
        submissions: []
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('universe_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('universe_flashcards', JSON.stringify(flashcards));
  }, [flashcards]);

  useEffect(() => {
    localStorage.setItem('universe_planner', JSON.stringify(planner));
  }, [planner]);

  useEffect(() => {
    localStorage.setItem('universe_studyrooms', JSON.stringify(studyRooms));
  }, [studyRooms]);

  useEffect(() => {
    localStorage.setItem('universe_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('universe_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('universe_assignments', JSON.stringify(assignments));
  }, [assignments]);

  const markLessonComplete = (courseId, lessonId) => {
    setCourses(prevCourses => {
      return prevCourses.map(course => {
        if (course.id === courseId) {
          const updatedLessons = course.lessons.map(lesson => {
            if (lesson.id === lessonId) {
              return { ...lesson, completed: !lesson.completed };
            }
            return lesson;
          });
          const completedCount = updatedLessons.filter(l => l.completed).length;
          const progress = Math.round((completedCount / updatedLessons.length) * 100);
          return {
            ...course,
            lessons: updatedLessons,
            progress
          };
        }
        return course;
      });
    });
  };

  const addFlashcard = (fc) => {
    setFlashcards(prev => [
      {
        id: Date.now().toString(),
        ...fc
      },
      ...prev
    ]);
  };

  const deleteFlashcard = (id) => {
    setFlashcards(prev => prev.filter(fc => fc.id !== id));
  };

  const addPlannerTask = (task) => {
    setPlanner(prev => [
      {
        id: Date.now().toString(),
        completed: false,
        ...task
      },
      ...prev
    ]);
  };

  const togglePlannerTask = (id) => {
    setPlanner(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deletePlannerTask = (id) => {
    setPlanner(prev => prev.filter(t => t.id !== id));
  };

  const toggleBookmark = (item) => {
    setBookmarks(prev => {
      const exists = prev.find(b => b.id === item.id);
      if (exists) {
        return prev.filter(b => b.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const sendMessageToRoom = (roomId, messageText, sender) => {
    setStudyRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          messages: [
            ...room.messages,
            { id: Date.now().toString(), sender, text: messageText, time: 'Just now' }
          ]
        };
      }
      return room;
    }));
  };

  const createStudyRoom = (name) => {
    setStudyRooms(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name,
        activeUsers: [
          { name: 'You', status: 'Studying', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80' }
        ],
        messages: [],
        productivity: 100
      }
    ]);
  };

  // LMS Handlers
  const addAnnouncement = (title, content, author) => {
    setAnnouncements(prev => [
      {
        id: Date.now().toString(),
        title,
        content,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        author: author || 'Faculty System Admin'
      },
      ...prev
    ]);
  };

  const addAssignment = (title, description, dueDate, courseId) => {
    setAssignments(prev => [
      {
        id: Date.now().toString(),
        title,
        description,
        dueDate,
        courseId,
        submissions: []
      },
      ...prev
    ]);
  };

  const submitAssignment = (assignmentId, studentName, content) => {
    setAssignments(prev => prev.map(as => {
      if (as.id === assignmentId) {
        const existing = as.submissions.find(s => s.studentName.toUpperCase() === studentName.toUpperCase());
        if (existing) {
          // Update existing
          return {
            ...as,
            submissions: as.submissions.map(s => s.studentName.toUpperCase() === studentName.toUpperCase() ? { ...s, content, submittedAt: 'Just now', grade: 'Pending', feedback: '' } : s)
          };
        }
        return {
          ...as,
          submissions: [
            ...as.submissions,
            { studentName: studentName.toUpperCase(), content, submittedAt: 'Just now', grade: 'Pending', feedback: '' }
          ]
        };
      }
      return as;
    }));
  };

  const gradeSubmission = (assignmentId, studentName, grade, feedback) => {
    setAssignments(prev => prev.map(as => {
      if (as.id === assignmentId) {
        return {
          ...as,
          submissions: as.submissions.map(sub => {
            if (sub.studentName.toUpperCase() === studentName.toUpperCase()) {
              return { ...sub, grade, feedback };
            }
            return sub;
          })
        };
      }
      return as;
    }));
  };

  return (
    <LearningContext.Provider value={{
      courses,
      flashcards,
      planner,
      studyRooms,
      bookmarks,
      announcements,
      assignments,
      markLessonComplete,
      addFlashcard,
      deleteFlashcard,
      addPlannerTask,
      togglePlannerTask,
      deletePlannerTask,
      toggleBookmark,
      sendMessageToRoom,
      createStudyRoom,
      addAnnouncement,
      addAssignment,
      submitAssignment,
      gradeSubmission
    }}>
      {children}
    </LearningContext.Provider>
  );
};

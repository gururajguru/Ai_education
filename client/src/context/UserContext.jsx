import React, { createContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

export const UserContext = createContext();

const DEFAULT_BADGES = [
  { id: '1', title: 'Universe Pioneer', desc: 'Welcome to the Adaptive AI Learning Universe', icon: '🚀', unlocked: true },
  { id: '2', title: 'Streak Master', desc: 'Maintain a 5-day daily study streak', icon: '🔥', unlocked: false },
  { id: '3', title: 'Gemini Scholar', desc: 'Interact with the AI Tutor 10 times', icon: '🧠', unlocked: false },
  { id: '4', title: 'Quiz Master', desc: 'Score a perfect 100% on any quiz', icon: '🏆', unlocked: false },
  { id: '5', title: 'Hyper Focus', desc: 'Maintain focus engagement above 90% for 5 mins', icon: '⚡', unlocked: false },
  { id: '6', title: 'Recall Guru', desc: 'Achieve a cognitive memory retention rate of 95%', icon: '🧘', unlocked: false }
];

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('universe_user');
    if (saved) return JSON.parse(saved);
    return {
      name: 'Future Scholar',
      email: 'scholar@learninguniverse.ai',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      xp: 250,
      level: 1,
      streak: 0,
      badges: DEFAULT_BADGES,
      learningMode: 'Beginner', // 'Beginner' | 'Fast Learner' | 'Exam Prep' | 'Revision' | 'Visual Learning'
      completedLessons: [],
      studyTime: 120, // minutes
      role: 'Student' // Default role for portal permissions
    };
  });

  const [cognitiveProfile, setCognitiveProfile] = useState(() => {
    const saved = localStorage.getItem('universe_cognitive');
    if (saved) return JSON.parse(saved);
    return {
      retentionScore: 82, // memory retention rate %
      focusEngagement: 88, // active engagement rate %
      memoryDecayRate: 12, // memory forgetting rate % per day
      knowledgeGaps: [
        { id: 'g1', subject: 'Artificial Intelligence', topic: 'Backpropagation Gradients', score: 45, suggestion: 'Review Perceptrons equations, complete Optimizer Quiz' },
        { id: 'g2', subject: 'Quantum Physics', topic: 'Superposition State Vectors', score: 60, suggestion: 'Study Qubit Superposition lesson, practice recall cards' }
      ]
    };
  });

  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Welcome aboard!', message: 'Explore the AI Tutor to customize your study path.', time: 'Just now', read: false }
  ]);

  useEffect(() => {
    localStorage.setItem('universe_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('universe_cognitive', JSON.stringify(cognitiveProfile));
  }, [cognitiveProfile]);

  const addXP = (amount) => {
    setUser(prev => {
      const nextXP = prev.xp + amount;
      const nextLevel = Math.floor(nextXP / 500) + 1;
      let levelUp = false;
      
      if (nextLevel > prev.level) {
        levelUp = true;
        // Trigger a beautiful confetti celebration for leveling up!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00f2fe', '#4facfe', '#8a2be2', '#ff007f']
        });
        
        addNotification({
          title: 'LEVEL UP! 🎉',
          message: `Congratulations! You unlocked Level ${nextLevel} in the Universe.`,
          time: 'Just now'
        });
      }

      return {
        ...prev,
        xp: nextXP,
        level: nextLevel
      };
    });

    // Boosting memory retention slightly when completing tasks
    setCognitiveProfile(prev => {
      const nextRetention = Math.min(100, prev.retentionScore + 2);
      if (nextRetention >= 95) {
        setTimeout(() => unlockBadge('6'), 100);
      }
      return {
        ...prev,
        retentionScore: nextRetention
      };
    });
  };

  const changeLearningMode = (mode) => {
    setUser(prev => ({ ...prev, learningMode: mode }));
    addNotification({
      title: 'AI Learning Mode Switched',
      message: `Your learning context has been restructured for [${mode}] mode.`,
      time: 'Just now'
    });
  };

  const changeRole = (role) => {
    setUser(prev => ({ ...prev, role }));
    addNotification({
      title: `Workspace Switched 🛡️`,
      message: `System console re-calibrated for [${role}] privileges.`,
      time: 'Just now'
    });
  };

  const unlockBadge = (badgeId) => {
    setUser(prev => {
      const updatedBadges = prev.badges.map(b => {
        if (b.id === badgeId && !b.unlocked) {
          confetti({
            particleCount: 50,
            spread: 40,
            origin: { y: 0.8 }
          });
          addNotification({
            title: 'Achievement Unlocked! 🏆',
            message: `You earned the "${b.title}" badge.`,
            time: 'Just now'
          });
          return { ...b, unlocked: true };
        }
        return b;
      });
      return { ...prev, badges: updatedBadges };
    });
  };

  const addNotification = (notif) => {
    setNotifications(prev => [
      {
        id: Date.now().toString(),
        read: false,
        time: 'Just now',
        ...notif
      },
      ...prev
    ]);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const updateKnowledgeGap = (gapId, newScore) => {
    setCognitiveProfile(prev => {
      const updatedGaps = prev.knowledgeGaps.map(g => {
        if (g.id === gapId) {
          return { 
            ...g, 
            score: newScore,
            suggestion: newScore >= 80 ? 'Mastery unlocked! Topic calibrated as stable.' : g.suggestion
          };
        }
        return g;
      });
      return {
        ...prev,
        knowledgeGaps: updatedGaps
      };
    });
  };

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      cognitiveProfile,
      setCognitiveProfile,
      notifications,
      addXP,
      changeLearningMode,
      changeRole,
      unlockBadge,
      addNotification,
      markAllNotificationsRead,
      clearNotifications,
      updateKnowledgeGap
    }}>
      {children}
    </UserContext.Provider>
  );
};

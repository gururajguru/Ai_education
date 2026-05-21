const express = require('express');
const router = express.Router();

// Simple in-memory storage for cognitive session tracking
const telemetryLogs = [
  { timestamp: new Date(Date.now() - 3600000 * 5), student: 'Alex H.', focusRating: 82, retention: 85, decayRate: 3, duration: 45 },
  { timestamp: new Date(Date.now() - 3600000 * 4), student: 'Sophia M.', focusRating: 91, retention: 92, decayRate: 2, duration: 60 },
  { timestamp: new Date(Date.now() - 3600000 * 3), student: 'Marcus L.', focusRating: 74, retention: 76, decayRate: 4, duration: 30 },
  { timestamp: new Date(Date.now() - 3600000 * 2), student: 'Clara D.', focusRating: 88, retention: 89, decayRate: 3, duration: 55 }
];

// Post Telemetry Logs
router.post('/session', (req, res) => {
  const { studentName, focusRating, retention, decayRate, duration, attention, stress, drowsiness } = req.body;
  
  // Safe backward compatibility maps
  const mappedFocus = focusRating || attention || 80;
  const mappedRetention = retention || (stress ? Math.max(0, 100 - stress) : 82);
  const mappedDecay = decayRate || (drowsiness ? Math.max(1, Math.round(drowsiness / 5)) : 3);

  const logEntry = {
    timestamp: new Date(),
    student: studentName || 'Future Scholar',
    focusRating: mappedFocus,
    retention: mappedRetention,
    decayRate: mappedDecay,
    duration: duration || 10,
    // Add fallback tags for backwards compatibility with legacy visualizers
    attention: mappedFocus,
    stress: Math.max(0, 100 - mappedRetention),
    drowsiness: mappedDecay * 5
  };
  
  telemetryLogs.push(logEntry);
  res.json({ success: true, logged: logEntry });
});

// Retrieve Aggregate Telemetry Logs
router.get('/metrics', (req, res) => {
  const count = telemetryLogs.length;
  if (count === 0) {
    return res.json({ 
      averageFocusRating: 80, 
      averageRetention: 82, 
      averageDecayRate: 3, 
      totalSessions: 0,
      // Fallback variables
      averageAttention: 80,
      averageStress: 30,
      averageDrowsiness: 10
    });
  }

  const sumFocus = telemetryLogs.reduce((acc, log) => acc + (log.focusRating || log.attention || 80), 0);
  const sumRetention = telemetryLogs.reduce((acc, log) => acc + (log.retention || (100 - (log.stress || 30))), 0);
  const sumDecay = telemetryLogs.reduce((acc, log) => acc + (log.decayRate || Math.max(1, Math.round((log.drowsiness || 10) / 5))), 0);
  
  const sumAttention = telemetryLogs.reduce((acc, log) => acc + (log.attention || log.focusRating || 80), 0);
  const sumStress = telemetryLogs.reduce((acc, log) => acc + (log.stress || (100 - log.retention)), 0);
  const sumDrowsiness = telemetryLogs.reduce((acc, log) => acc + (log.drowsiness || (log.decayRate * 5)), 0);
  
  const totalMinutes = telemetryLogs.reduce((acc, log) => acc + log.duration, 0);

  res.json({
    // Cognitive API Standard
    averageFocusRating: Math.round(sumFocus / count),
    averageRetention: Math.round(sumRetention / count),
    averageDecayRate: Math.round(sumDecay / count),
    
    // Legacy Biometrics Fallback
    averageAttention: Math.round(sumAttention / count),
    averageStress: Math.round(sumStress / count),
    averageDrowsiness: Math.round(sumDrowsiness / count),
    
    totalStudyMinutes: totalMinutes,
    totalSessions: count,
    logs: telemetryLogs.slice(-10) // return last 10 log entries
  });
});

module.exports = router;

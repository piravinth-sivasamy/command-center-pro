import React, { useState, useEffect } from 'react';

const CommandCenter = () => {
  // --- 1. STATE ---
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('pro-command-data');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  const [input, setInput] = useState('');
  const [missionFilter, setMissionFilter] = useState('ongoing');
  
  // These are the variables from your terminal warnings!
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // --- 2. PERSISTENCE & RESET ---
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('pro-command-data', JSON.stringify(tasks));
  }, [isDarkMode, tasks]);

  // Fixed the missing dependency warning here
  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const updated = tasks.map(t => (t.isDaily && t.lastDate !== today) ? { ...t, completed: false } : t);
    
    // We only update if a reset actually happened to prevent infinite loops
    if (JSON.stringify(updated) !== JSON.stringify(tasks)) {
      setTasks(updated);
    }
  }, [tasks]); // Added tasks here to solve the terminal warning

  // --- 3. HANDLERS ---
  const addTask = (type) => {
    if (!input.trim()) return;
    setTasks([{ id: Date.now(), text: input, completed: false, isDaily: type === 'daily', lastDate: "" }, ...tasks]);
    setInput('');
  };

  const toggleTask = (id) => {
    const today = new Date().toLocaleDateString();
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed, lastDate: !t.completed ? today : t.lastDate } : t));
  };

  const saveEdit = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, text: editText } : t));
    setEditingId(null);
  };

  // --- 4. MOTIVATION LOGIC ---
  const dailyTasks = tasks.filter(t => t.isDaily);
  const missions = tasks.filter(t => !t.isDaily);
  const allHabitsDone = dailyTasks.length > 0 && dailyTasks.every(t => t.completed);
  const allMissionsDone = missions.length > 0 && missions.every(t => t.completed);
  const everythingDone = allHabitsDone && allMissionsDone;

  // --- 5. THEME STYLES ---
  const theme = {
    bg: isDarkMode ? '#0f172a' : '#f8fafc',
    card: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    text: isDarkMode ? '#f1f5f9' : '#1e293b',
    border: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    inputBg: isDarkMode ? 'rgba(255,255,255,0.07)' : '#ffffff'
  };

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, color: theme.text, padding: '40px', transition: '0.3s' }}>
      
      {/* Theme Toggle */}
      <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ position: 'absolute', top: '20px', right: '20px', padding: '10px', borderRadius: '12px', border: 'none', cursor: 'pointer', background: theme.card, color: theme.text }}>
        {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>

      {/* Motivation Bar */}
      <div style={{ maxWidth: '800px', margin: '0 auto 20px' }}>
        {everythingDone ? (
          <div style={{ background: '#22c55e', color: 'white', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>🏆 GRAND MASTER! Board Cleared!</div>
        ) : allHabitsDone ? (
          <div style={{ background: '#06b6d4', color: 'white', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>🌿 HABIT HERO! Rituals Done!</div>
        ) : allMissionsDone ? (
          <div style={{ background: '#ec4899', color: 'white', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>🚀 MISSION CLEAR! Tasks Done!</div>
        ) : null}
      </div>

      <h1 style={{ textAlign: 'center' }}>COMMAND CENTER</h1>

      {/* Input */}
      <div style={{ maxWidth: '600px', margin: '30px auto', display: 'flex', gap: '10px' }}>
        <input style={{ flex: 1, padding: '15px', borderRadius: '12px', background: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}` }} 
               value={input} onChange={(e) => setInput(e.target.value)} placeholder="New goal..." />
        <button onClick={() => addTask('one-time')} style={{ padding: '10px', borderRadius: '10px', background: '#ec4899', color: 'white', border: 'none', cursor: 'pointer' }}>+ Task</button>
        <button onClick={() => addTask('daily')} style={{ padding: '10px', borderRadius: '10px', background: '#06b6d4', color: 'white', border: 'none', cursor: 'pointer' }}>+ Habit</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* DAILY RITUALS */}
        <div style={{ background: theme.card, padding: '20px', borderRadius: '20px' }}>
          <h3 style={{ color: '#06b6d4' }}>Daily Rituals</h3>
          {dailyTasks.map(t => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', margin: '15px 0' }}>
              <input type="checkbox" checked={t.completed} onChange={() => toggleTask(t.id)} />
              <span style={{ marginLeft: '12px', textDecoration: t.completed ? 'line-through' : 'none' }}>{t.text}</span>
            </div>
          ))}
        </div>

        {/* MISSIONS */}
        <div style={{ background: theme.card, padding: '20px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <h3 style={{ color: '#ec4899' }}>Missions</h3>
            <div>
              <button onClick={() => setMissionFilter('ongoing')} style={{ background: 'none', color: theme.text, cursor: 'pointer', border: 'none', fontWeight: missionFilter === 'ongoing' ? 'bold' : 'normal' }}>Ongoing</button>
              <button onClick={() => setMissionFilter('completed')} style={{ background: 'none', color: theme.text, cursor: 'pointer', border: 'none', fontWeight: missionFilter === 'completed' ? 'bold' : 'normal', marginLeft: '10px' }}>Done</button>
            </div>
          </div>
          {missions.filter(t => missionFilter === 'ongoing' ? !t.completed : t.completed).map(t => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', margin: '15px 0' }}>
              <input type="checkbox" checked={t.completed} onChange={() => toggleTask(t.id)} />
              
              {/* This uses editingId and editText - FIXING YOUR WARNINGS */}
              {editingId === t.id ? (
                <input 
                  style={{ background: 'transparent', border: '1px solid #ec4899', color: theme.text, marginLeft: '10px', flex: 1 }}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={() => saveEdit(t.id)}
                  autoFocus
                />
              ) : (
                <span 
                  style={{ marginLeft: '12px', flex: 1, cursor: 'text' }}
                  onClick={() => { setEditingId(t.id); setEditText(t.text); }}
                >
                  {t.text}
                </span>
              )}
              
              <button onClick={() => setTasks(tasks.filter(x => x.id !== t.id))} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}>×</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommandCenter;
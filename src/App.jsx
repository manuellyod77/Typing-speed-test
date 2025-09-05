import React, { useState, useEffect, useRef, useCallback } from 'react';
import './index.css';

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog. Programming is the process of creating a set of instructions that tell a computer how to perform a task.",
  "React is a JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies.",
  "Typing speed is measured in words per minute. Practice regularly to improve your typing skills and become more productive in your daily computer work.",
  "JavaScript is a programming language that conforms to the ECMAScript specification. JavaScript is high-level, often just-in-time compiled, and multi-paradigm.",
  "Frontend development involves creating the user interface and experience of websites and web applications using HTML, CSS, and JavaScript."
];

const TypingSpeedTest = () => {
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [stats, setStats] = useState({ wpm: 0, accuracy: 100, errors: 0 });
  const textareaRef = useRef(null);

  // Load random text on component mount
  useEffect(() => {
    loadNewText();
  }, []);

  const loadNewText = useCallback(() => {
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setText(randomText);
    setUserInput('');
    setTimeElapsed(0);
    setIsTyping(false);
    setIsFinished(false);
    setStats({ wpm: 0, accuracy: 100, errors: 0 });
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  useEffect(() => {
    let interval;
    if (isTyping && !isFinished) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 0.1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isTyping, isFinished]);

  useEffect(() => {
    if (userInput.length > 0 && !isTyping) {
      setIsTyping(true);
    }

    if (userInput.length === text.length) {
      setIsFinished(true);
      setIsTyping(false);
      calculateStats();
    }
  }, [userInput, text, isTyping]);

  const calculateStats = useCallback(() => {
    const words = text.split(' ').length;
    const minutes = timeElapsed / 60;
    const wpm = Math.round(words / minutes);
    
    let errors = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] !== text[i]) {
        errors++;
      }
    }
    
    const accuracy = Math.max(0, Math.round(((userInput.length - errors) / userInput.length) * 100));
    
    setStats({ wpm: isFinite(wpm) ? wpm : 0, accuracy, errors });
  }, [text, userInput, timeElapsed]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const getCharacterClass = (index) => {
    if (index >= userInput.length) return '';
    if (userInput[index] === text[index]) return 'correct';
    return 'incorrect';
  };

  const formatTime = (seconds) => {
    return seconds.toFixed(1);
  };

  return (
    <div className="typing-test-container">
      <h1>⚡ Typing Speed Test</h1>
      
      <div className="stats-container">
        <div className="stat">
          <span className="stat-label">Time:</span>
          <span className="stat-value">{formatTime(timeElapsed)}s</span>
        </div>
        <div className="stat">
          <span className="stat-label">WPM:</span>
          <span className="stat-value">{stats.wpm}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Accuracy:</span>
          <span className="stat-value">{stats.accuracy}%</span>
        </div>
        <div className="stat">
          <span className="stat-label">Errors:</span>
          <span className="stat-value">{stats.errors}</span>
        </div>
      </div>

      <div className="text-display">
        {text.split('').map((char, index) => (
          <span
            key={index}
            className={`char ${getCharacterClass(index)} ${
              index === userInput.length ? 'current' : ''
            }`}
          >
            {char}
          </span>
        ))}
      </div>

      <textarea
        ref={textareaRef}
        className="typing-input"
        value={userInput}
        onChange={handleInputChange}
        placeholder="Start typing here..."
        disabled={isFinished}
        rows="4"
      />

      {isFinished && (
        <div className="results">
          <h2>Test Complete! 🎉</h2>
          <p>Your typing speed: <strong>{stats.wpm} WPM</strong></p>
          <p>Accuracy: <strong>{stats.accuracy}%</strong></p>
          <p>Errors: <strong>{stats.errors}</strong></p>
          <button onClick={loadNewText} className="restart-btn">
            Try Another Text 🔄
          </button>
        </div>
      )}

      {!isFinished && userInput.length === 0 && (
        <div className="instructions">
          <p>💡 Start typing the text above. The timer begins with your first keystroke.</p>
        </div>
      )}

      <div className="controls">
        <button onClick={loadNewText} className="new-text-btn">
          New Text 📝
        </button>
      </div>
    </div>
  );
};

export default TypingSpeedTest;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [attempts, setAttempts] = useState([]);
  const [currentAttempt, setCurrentAttempt] = useState([]);

  useEffect(() => {
    const app = document.querySelector('.App');
    if (app) {
      app.focus();
    }
  }, []);

  const handleKeyDown = (event) => {
    if (event.key.startsWith('Arrow')) {
      setCurrentAttempt([...currentAttempt, event.key.replace('Arrow', '').toLowerCase()]);
    } else if (event.key === 'Enter' && currentAttempt.length > 0) {
      checkCombination();
    }
  };

  const checkCombination = async () => {
    try {
      const response = await axios.post('http://localhost:8000/check', {
        user_combination: currentAttempt,
      });
      setAttempts([...attempts, { id: new Date().getTime(), attempt: currentAttempt, results: response.data.results }]);
      setCurrentAttempt([]); // Clear the current input for the next attempt
    } catch (error) {
      console.error('There was a problem with the Axios operation:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
      }
    }
  };

  const calculateOpacity = (index, attemptsLength) => {
    const maxOpacity = 1;
    const minOpacity = 0.1;
    const opacityStep = (maxOpacity - minOpacity) / attemptsLength;

    return maxOpacity - opacityStep * index;
  };


  const getArrowIcon = (arrow) => {
    const arrowIcons = {
      up: '↑',
      down: '↓',
      left: '←',
      right: '→',
    };
    return arrowIcons[arrow];
  };

  return (
      <div className="App" tabIndex={0} onKeyDown={handleKeyDown}>
        <div id="current-input">
          {currentAttempt.map((arrow, index) => (
              <span key={index} className="arrow">
            {getArrowIcon(arrow)}
          </span>
          ))}
        </div>
        {attempts.slice(0).reverse().map((attemptObj, index) => (
            <div key={attemptObj.id} className={`attempt ${attemptObj.id === attempts[attempts.length - 1].id ? 'animate-new-attempt' : ''}`} style={{opacity: calculateOpacity(index, attempts.length)}}>
              {attemptObj.attempt.map((arrow, idx) => (
                  <span key={idx} className={`arrow ${attemptObj.results[idx] || ''}`}>
                    {getArrowIcon(arrow)}
                  </span>
              ))}
            </div>
        ))}
      </div>
  );
}

export default App;
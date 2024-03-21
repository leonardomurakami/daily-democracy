import React, { useState, useReducer, useEffect } from 'react';
import axios from 'axios';
import { attemptsReducer } from './components/state/attemptsReducer';
import { key, confirm, correct, error, mission_complete, mission_complete_banner } from './media';
import useAudio from './components/useAudio';
import './App.css';

function App() {
  const [state, dispatch] = useReducer(attemptsReducer, { attempts: [], currentAttempt: [] });
  const [isCheckSuccessful, setIsCheckSuccessful] = useState(false);

  const playKey = useAudio(key);
  const playConfirm = useAudio(confirm);
  const playCorrect = useAudio(correct);
  const playError = useAudio(error);
  const playMissionComplete = useAudio(mission_complete);

  useEffect(() => {
    const app = document.querySelector('.App');
    if (app) {
      app.focus();
    }
  }, []);

  const handleKeyDown = async (event) => {
    if (event.key.startsWith('Arrow')) {
      playKey();
      dispatch({ type: 'SET_CURRENT_ATTEMPT', payload: [...state.currentAttempt, event.key.replace('Arrow', '').toLowerCase()] });
    } else if (event.key === 'Enter' && state.currentAttempt.length > 0) {
      playConfirm();
      checkCombination();
      
    }
  };

  const checkCombination = async () => {
    try {
      const response = await axios.post('http://localhost:8000/check', {
        user_combination: state.currentAttempt,
      });
      dispatch({
        type: 'ADD_ATTEMPT',
        payload: { id: new Date().getTime(), attempt: state.currentAttempt, results: response.data.results },
      });
      
      if (response.data.success) {
        playCorrect();
        playMissionComplete();
        setIsCheckSuccessful(response.data.success);
      } else {
        playError();
      }

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
        <div className="image-container">
          {isCheckSuccessful && <img src={mission_complete_banner} alt="Mission Completed Banner" />}
        </div>
        <div id="current-input">
          {state.currentAttempt.map((arrow, index) => (
              <span key={index} className="arrow">
                {getArrowIcon(arrow)}
              </span>
          ))}
        </div>
        {state.attempts.slice(0).reverse().map((attemptObj, index) => (
            <div key={attemptObj.id} className={`attempt ${attemptObj.id === state.attempts[state.attempts.length - 1].id ? 'animate-new-attempt' : ''}`} style={{opacity: calculateOpacity(index, state.attempts.length)}}>
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

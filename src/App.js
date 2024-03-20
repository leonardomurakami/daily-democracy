import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [userCombination, setUserCombination] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const app = document.querySelector('.App');
    if (app) {
      app.focus();
    }
  }, []);

  const handleKeyDown = (event) => {
    if (event.key.startsWith('Arrow')) {
      setUserCombination([...userCombination, event.key.replace('Arrow', '').toLowerCase()]);
    } else if (event.key === 'Enter' && userCombination.length > 0) {
      checkCombination();
    }
  };

  const checkCombination = async () => {
    try {
      // Use Axios to send the userCombination to the backend
      const response = await axios.post('http://localhost:8000/check', {
        user_combination: userCombination,
      });

      // Set the results with the response from the backend
      setResults(response.data.results);
    } catch (error) {
      console.error('There was a problem with the Axios operation:', error);
      // Log error.response.data if the error comes from the backend
      if (error.response) {
        console.error('Error response data:', error.response.data);
      }
    }
    setUserCombination([]); // Reset for the next input
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
        <div id="arrow-inputs">
          {userCombination.map((arrow, index) => (
              <span key={index} className={`arrow ${results[index] || ''}`}>
            {getArrowIcon(arrow)}
          </span>
          ))}
        </div>
      </div>
  );
}

export default App;

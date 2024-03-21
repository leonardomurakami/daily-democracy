export const attemptsReducer = (state, action) => {
    switch (action.type) {
      case 'ADD_ATTEMPT':
        return {
          ...state,
          attempts: [...state.attempts, action.payload],
          currentAttempt: [],
        };
      case 'SET_CURRENT_ATTEMPT':
        return {
          ...state,
          currentAttempt: action.payload,
        };
      default:
        return state;
    }
  };
  
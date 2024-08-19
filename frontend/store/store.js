import { createStore } from 'redux';

const initialState = {
  isLoading: false,
  isLoggedIn: false,
  userData: null
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_IS_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_IS_LOGGED_IN':
      return {
        ...state,
        isLoggedIn: action.payload,
      };
    case 'SET_USER_DATA':
      return {
        ...state,
        userData: action.payload,
      };
    case 'UPDATE_HABIT':
      return {
        ...state,
        userData: {
          ...state.userData,
          habits: state.userData.habits.map(habit =>
            habit.name === action.payload.name ? action.payload : habit
          )
        }
      };  
    case 'UPDATE_COMMITS_DATA':
      return {
        ...state,
        userData: {
          ...state.userData,
          commitsData: action.payload,
        }
      };  
    default:
      return state;
  }
}
  
const store = createStore(reducer);

export default store;
  

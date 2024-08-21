import { createStore } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  isLoading: false,
  isLoggedIn: false,
  userData: null
};

const getUserDataFromLocalStorage = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    if (!keys.includes('userData')) {
      const initialUserData = JSON.stringify({});
      await AsyncStorage.setItem('userData', initialUserData);
      return JSON.parse(initialUserData);
    } else {
      const userData = await AsyncStorage.getItem('userData');
      console.log('userData', userData);
      return JSON.parse(userData);
    }
  } catch (error) {
    console.error("Error retrieving user data from storage: ", error);
    return null;
  }
};

async function updateUserDataInStorage(userData) {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
    console.log("UserData updated in storage");
  } catch (error) {
    console.error("Error updating UserData in storage: ", error);
  }
}

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
    case 'ADD_HABIT':
      const newHabits = state.userData?.habits ? [...state.userData.habits, action.payload] : [action.payload];
      const updatedUserDataWithNewHabit = {
        ...state.userData,
        habits: newHabits,
      };

      updateUserDataInStorage(updatedUserDataWithNewHabit);
      return {
        ...state,
        userData: updatedUserDataWithNewHabit,
      };  
    case 'UPDATE_HABIT':
      const updatedHabits = state.userData.habits.map(habit =>
        habit.name === action.payload.name ? action.payload : habit
      );
      const updatedUserDataWithHabits = {
        ...state.userData,
        habits: updatedHabits,
      };

      updateUserDataInStorage(updatedUserDataWithHabits);
      return {
        ...state,
        userData: updatedUserDataWithHabits,
      };
    case 'UPDATE_HABIT_NAME':
      const updatedHabitNames = state.userData.habits.map(habit =>
        habit.name === action.selectedItem.name ? action.payload : habit
      );
      const updatedUserDataWithHabitNames = {
        ...state.userData,
        habits: updatedHabitNames,
      };

      updateUserDataInStorage(updatedUserDataWithHabitNames);
      return {
        ...state,
        userData: updatedUserDataWithHabitNames,
      };
    case 'DELETE_HABIT':
      const filteredHabits = state.userData.habits.filter(
        habit => habit.name !== action.payload.name
      );
      const updatedUserDataWithDeletedHabit = {
        ...state.userData,
        habits: filteredHabits,
      };

      updateUserDataInStorage(updatedUserDataWithDeletedHabit);
      return {
        ...state,
        userData: updatedUserDataWithDeletedHabit,
      };  
    case 'UPDATE_COMMITS_DATA':
      const updatedUserDataWithCommits = {
        ...state.userData,
        commitsData: action.payload,
      };

      updateUserDataInStorage(updatedUserDataWithCommits);
      return {
        ...state,
        userData: updatedUserDataWithCommits,
      };
    case 'UPDATE_USER_DATA':
      const updatedUserData = {
        ...state.userData,
        ...action.payload,
      };
    
      updateUserDataInStorage(updatedUserData);
      return {
        ...state,
        userData: updatedUserData,
      };        
    case 'UPDATE_COINS':
      const updatedUserDataWithCoins = {
        ...state.userData,
        coins: action.payload,
      };

      updateUserDataInStorage(updatedUserDataWithCoins);
      return {
        ...state,
        userData: updatedUserDataWithCoins,
      };  
    default:
      return state;
  }
}
  
const initializeStore = async () => {
  const userData = await getUserDataFromLocalStorage();
  const preloadedState = {
    ...initialState,
    userData,
  };
  return createStore(reducer, preloadedState);
};

export default initializeStore;

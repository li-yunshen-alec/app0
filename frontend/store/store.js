import { createStore } from 'redux';
import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

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
    case 'ADD_HABIT':
      const newHabits = [...state.userData.habits, action.payload];
      const updatedUserDataWithNewHabit = {
        ...state.userData,
        habits: newHabits,
      };

      updateUserDataInFirestore(updatedUserDataWithNewHabit);
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

      updateUserDataInFirestore(updatedUserDataWithHabits);
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

      updateUserDataInFirestore(updatedUserDataWithHabitNames);
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

      updateUserDataInFirestore(updatedUserDataWithDeletedHabit);
      return {
        ...state,
        userData: updatedUserDataWithDeletedHabit,
      };  
    case 'UPDATE_COMMITS_DATA':
      const updatedUserDataWithCommits = {
        ...state.userData,
        commitsData: action.payload,
      };

      updateUserDataInFirestore(updatedUserDataWithCommits);
      return {
        ...state,
        userData: updatedUserDataWithCommits,
      };
    case 'UPDATE_USER_DATA':
      const updatedUserData = {
        ...state.userData,
        ...action.payload,
      };
    
      updateUserDataInFirestore(updatedUserData);
      return {
        ...state,
        userData: updatedUserData,
      };        
    case 'UPDATE_COINS':
      const updatedUserDataWithCoins = {
        ...state.userData,
        coins: action.payload,
      };

      updateUserDataInFirestore(updatedUserDataWithCoins);
      return {
        ...state,
        userData: updatedUserDataWithCoins,
      };  
    default:
      return state;
  }
}
  
const store = createStore(reducer);

function updateUserDataInFirestore(userData) {
  const userDocRef = doc(db, 'users', auth.currentUser.uid); // Assuming userId is part of userData
  setDoc(userDocRef, userData)
    .then(() => console.log("UserData updated in Firestore"))
    .catch(error => console.error("Error updating UserData: ", error));
}

export default store;
  

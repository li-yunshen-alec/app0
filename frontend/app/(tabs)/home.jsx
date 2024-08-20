import { View, Text, FlatList, Image, RefreshControl, Alert, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import { getAllPosts, getLatestPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useDispatch, useSelector } from 'react-redux'
import { auth, db } from '../../lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import HabitForm from '../../components/HabitForm'
import General from '../../components/General'
import ProgressGraph from '../../components/ProgressGraph'
import ContributionGraph from '../../components/CalendarHeatmap'
import CalendarHeatmap from '../../components/CalendarHeatmap'

const useFetchUserData = (userData) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;

        if (currentUser) {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userSnapshot = await getDoc(userDocRef);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            console.log(userData);
            dispatch({ type: 'SET_USER_DATA', payload: userData });
          }
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    if (!userData && auth.currentUser) fetchUserData();
  }, [auth.currentUser, dispatch]);
};

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }

  const userData = useSelector(state => state.userData);

  useFetchUserData(userData);

  const [habitFormOpen, setHabitFormOpen] = useState(false);
  const [generalOpen, setGeneralOpen] = useState(false);

  const dispatch = useDispatch();

  const handleIncrement = (item) => {
    const habits = userData?.habits;
    let commitsData = userData?.commitsData || [];
  
    if (!habits) return;
  
    const habit = habits.find(habit => habit.name === item.name);
    const currentDate = new Date().toISOString().split('T')[0];
      
    if (habit) {
      if (habit?.lastIncremented === currentDate) {
        console.log('Habit has already been incremented today.');
      } else {
        const updatedHabit = {
          ...habit,
          count: habit.count + 1,
          lastIncremented: currentDate
        };
        dispatch({ type: 'UPDATE_HABIT', payload: updatedHabit });

        const existingCommit = commitsData.find(commit => commit.date === currentDate);
        if (existingCommit) {
          existingCommit.count += 1;
        } else {
          commitsData.push({ date: currentDate, count: 1 });
        }

        dispatch({ type: 'UPDATE_COMMITS_DATA', payload: commitsData });
      }
    } else {
      console.log('Habit not found.');
    }
  };
  
  return (
    <SafeAreaView className='bg-primary'>
      <ScrollView>
        { habitFormOpen  && <HabitForm setHabitFormOpen={setHabitFormOpen} userData={userData} />}
        { generalOpen  && <General setGeneralOpen={setGeneralOpen} userData={userData} />}
        <View className='mt-6 px-4 space-y-6'>
          <View className='justify-between items-start flex-row mb-6'>
            <View>
              <Text className='font-pmedium text-sm text-gray-100'>Monday</Text>
              <Text className='text-2xl font-psemibold text-white'>Aug 12</Text>
            </View>

            <View className='mt-1.5'>
              <View className='flex flex-row items-center justify-center bg-stone-800 px-2 rounded-full'>
                <Icon name="attach-money" color="#fbbf24" size={26} />
                <Text className='font-pregular text-white text-2xl mt-1 mr-1'>126</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="m-4 mx-6">
          <Text className='text-white font-psemibold'>
            George
          </Text>
          <Text className='text-white text-base'>
            Hey! You've kept all your promises for 12 days now. Good work!
          </Text>
        </View>

        <CalendarHeatmap />

        { userData && (
          <>
            <View className=' m-4'>
              <View className='justify-between items-center flex-row mb-2'>
                <Text className='ml-1 text-xl font-plight text-white'>My Promises</Text>

                <TouchableOpacity onPress={() => {}} className='flex flex-row items-center justify-center bg-stone-800 p-1 rounded-full'>
                  <View className='p-1 bg-amber-900 rounded-full'>
                    <Icon name="question-mark" color="white" size={20} />
                  </View>
                </TouchableOpacity>

              </View>
              
              {userData.habits.map((item, index) => (
                <TouchableOpacity key={index} onPress={() => handleIncrement(item)} className="my-2 bg-amber-900 rounded-xl flex flex-row items-center justify-between space-x-4 p-2">
                  <View className='flex flex-row items-center space-x-4'>
                    <View className='w-14 h-14 bg-amber-950 rounded-xl flex flex-col justify-end items-center'>
                      <Icon name="local-fire-department" color="#fbbf24" size={20} />
                      <Text className='font-pregular text-white text-lg'>{item.count}</Text>
                    </View>
                    <Text className="text-white font-medium text-base">{item.name}</Text>
                  </View>
                  <TouchableOpacity>
                    <Icon name='more-vert' color="white" size={20} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}

              <View className='justify-end items-center flex-row mb-2'>

                <TouchableOpacity onPress={() => setHabitFormOpen(true)} className='flex flex-row items-center justify-center bg-stone-800 px-2 py-1 rounded-full'>
                  <Icon name="add-circle-outline" color="white" size={20} />
                  <Text className='font-pregular text-white text-base mt-0.5 mx-1'>Promise</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
        <TouchableOpacity onPress={() => setGeneralOpen(true)} className="m-4 flex flex-row items-center space-x-4 rounded-md border border-white p-4">
          <Icon name="add-circle-outline" color="white" size={26} />
          <View className="flex-1 space-y-1">
            <Text className="text-sm font-medium leading-none text-white">
              Hey! Need general tips/advice?
            </Text>
            <Text className="text-sm text-muted-foreground text-white">
              Open up DMs with George.
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home
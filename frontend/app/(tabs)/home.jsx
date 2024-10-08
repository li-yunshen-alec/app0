import { View, Text, FlatList, Image, RefreshControl, Alert, TouchableOpacity, ScrollView, Button } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
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
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { router, useNavigation } from 'expo-router'
import Modal from "react-native-modal"
import AsyncStorage from '@react-native-async-storage/async-storage'

const Home = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }

  const userData = useSelector(state => state.userData);

  const [habitFormOpen, setHabitFormOpen] = useState(false);
  const [generalOpen, setGeneralOpen] = useState(false);
  const [promiseOptionsOpen, setPromiseOptionsOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();

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

        const updatedHabits = habits.map(h => h.name === item.name ? updatedHabit : h);

        const existingCommit = commitsData.find(commit => commit.date === currentDate);
        if (existingCommit) {
          existingCommit.count += 1;
        } else {
          commitsData.push({ date: currentDate, count: 1 });
        }

        dispatch({ type: 'UPDATE_COMMITS_DATA', payload: commitsData });

        const allHabitsIncremented = updatedHabits.every(
          habit => habit.lastIncremented === currentDate
        );  

        if (allHabitsIncremented) {
          const rewardCoins = 50;
          const updatedCoins = (userData.coins || 0) + rewardCoins;
          
          dispatch({ type: 'UPDATE_COINS', payload: updatedCoins });
  
          Alert.alert(
            'Congratulations!',
            `You've kept all your promises today! 🎉\nYou've earned ${rewardCoins} coins! 💰`,
            [{ text: 'Awesome!', style: 'default' }]
          );
        }  
      }
    } else {
      console.log('Habit not found.');
    }
  };

  const bottomSheetRef = useRef(null);

  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleSheetOpen = () => bottomSheetRef.current.expand();

  const handleEditPressed = () => {
    setIsEditing(true);
    setHabitFormOpen(true);
  }

  const handleDeletePressed = () => {
    dispatch({
      type: 'DELETE_HABIT',
      payload: selectedItem
    });

    setSelectedItem(null);
  }


  const [prompts, setPrompts] = useState([]);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const storedPrompts = await AsyncStorage.getItem('prompts');
        if (storedPrompts) {
          setPrompts(JSON.parse(storedPrompts));
        }
      } catch (error) {
        console.error('Failed to fetch prompts:', error);
      }
    };

    fetchPrompts();
  }, []);

  const handlePromptPress = (index) => {
    router.push(`/edit/${index}`);
  };
  
  return (
    <SafeAreaView className='bg-primary h-full'>
      { habitFormOpen ? (
        <HabitForm setHabitFormOpen={setHabitFormOpen} userData={userData} isEditing={isEditing} selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
      ) : generalOpen ? (
        <General setGeneralOpen={setGeneralOpen} userData={userData} />
      ) : (
        <>
          <ScrollView>
            <View className='mt-6 px-4 space-y-6'>
              <View className='justify-between items-start flex-row mb-6'>
                <View>
                  <Text className='font-pmedium text-sm text-gray-100'>Monday</Text>
                  <Text className='text-2xl font-psemibold text-white'>Aug 12</Text>
                </View>

                <View className='mt-1.5'>
                  <View className='flex flex-row items-center justify-center bg-stone-800 px-2 rounded-full'>
                    <Icon name="attach-money" color="#fbbf24" size={26} />
                    <Text className='font-pregular text-white text-2xl mt-1 mr-1'>{userData && userData.coins}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View className="m-4">
              <View className='justify-between items-center flex-row mb-2'>
                <Text className='ml-1 text-xl font-plight text-white'>My Entries</Text>

                <TouchableOpacity onPress={toggleModal} className='flex flex-row items-center justify-center bg-stone-800 p-1 rounded-full'>
                  <View className='p-1 bg-amber-900 rounded-full'>
                    <Icon name="question-mark" color="white" size={20} />
                  </View>
                </TouchableOpacity>

              </View>

              {prompts.length > 0 ? (
                prompts.map((item, index) => (
                  <TouchableOpacity key={index} onPress={() => handlePromptPress(index)} className='w-full bg-stone-800 rounded-lg p-4 my-2'>
                    <Text className='text-white font-psemibold'>
                      {item.title}
                    </Text>
                    <Text className='text-white'>{item.content}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text className='text-white'>No prompts available</Text>
              )}

              <View className='justify-end items-center flex-row mb-2'>
                <TouchableOpacity onPress={() => setHabitFormOpen(true)} className='flex flex-row items-center justify-center bg-stone-800 px-2 py-1 rounded-full'>
                  <Icon name="add-circle-outline" color="white" size={20} />
                  <Text className='font-pregular text-white text-base mt-0.5 mx-1'>Promise</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity onPress={() => setGeneralOpen(true)} className="m-4 flex flex-row items-center space-x-4 rounded-lg border bg-amber-900 p-4">
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

          <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
            <View className="m-4 mx-6">
              <View className='w-full bg-stone-800 rounded-md p-4'>
                <Text className='text-white text-lg font-psemibold mb-2'>
                  Promises
                </Text>

                <Text className='text-white text-base'>
                  The promises you make here are non-negotiable. Check off a promise once per day.
                </Text>

                <TouchableOpacity
                  onPress={toggleModal}
                  activeOpacity={0.7}
                  className={`bg-secondary rounded-xl h-12 justify-center items-center`}
                >
                  <Text className={`text-primary font-psemibold text-lg`}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <BottomSheet
            ref={bottomSheetRef}
            onChange={handleSheetChanges}
            snapPoints={['30%']}
            enablePanDownToClose
            onClose={() => {
              setPromiseOptionsOpen(false);
              navigation.setOptions({ tabBarStyle: {
                backgroundColor: '#161622',
                borderTopWidth: 1,
                borderTopColor: '#232533',
                height: 84
              } });
            }}
            index={-1}
            backgroundStyle={{ backgroundColor: '#161622'}}
            handleIndicatorStyle={{ backgroundColor: '#FF9C01'}}
          >
            <BottomSheetView style={{ padding: 8 }}>
              <TouchableOpacity onPress={handleEditPressed} className=" flex flex-row items-center space-x-4 p-2">
                <View className='w-14 h-12 rounded-xl flex flex-col justify-center items-center'>
                  <Icon name="edit" color="#fff" size={30} />
                </View>
                <Text className="text-white font-medium text-base">Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleDeletePressed} className=" flex flex-row items-center space-x-4 p-2">
                <View className='w-14 h-12 rounded-xl flex flex-col justify-center items-center'>
                  <Icon name="delete-outline" color="#f87171" size={30} />
                </View>
                <Text className="text-red-400 font-medium text-base">Delete</Text>
              </TouchableOpacity>
            </BottomSheetView>
          </BottomSheet>
        </>
      )}
    </SafeAreaView>
  )
}

export default Home
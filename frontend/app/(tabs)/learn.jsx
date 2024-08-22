import { View, Text, Image, FlatList, TouchableOpacity, Modal, SectionList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { images } from '../../constants';
import { lessonData } from '../../data';
import DuolingoButton from '../../components/DuolingoButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { sectionedData } from '../../data/sectionedData';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Learn = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [progressData, setProgressData] = useState({});

  const userData = useSelector(state => state.userData);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const storedProgress = await AsyncStorage.getItem('@progress_store');
        if (storedProgress) {
          setProgressData(JSON.parse(storedProgress));
        }
      } catch (error) {
        console.error('Failed to fetch progress data:', error);
      }
    };

    fetchProgressData();
  }, []);

  const handleItemPress = (item) => {
    const isLocked = !userData.unlockedLessonIds.includes(item.id);
    if (isLocked) {
      setSelectedItem(item);
      setModalVisible(true);
    } else {
      router.push(`/lesson/${item.id}`);
    }
  };

  const handleUnlock = () => {
    if (userData.coins >= 100) {
      const updatedCoins = userData.coins - 100;
      const updatedUnlockedLessonIds = [...userData.unlockedLessonIds, selectedItem.id];

      dispatch({
        type: 'UPDATE_USER_DATA',
        payload: {
          coins: updatedCoins,
          unlockedLessonIds: updatedUnlockedLessonIds,
        }
      });

      setModalVisible(false);
      router.push(`/lesson/${selectedItem.id}`);
    } else {
      alert("You don't have enough coins to unlock this lesson.");
    }
  };

  return (
    <SafeAreaView className='bg-primary h-full flex flex-col space-between'>
      <SectionList 
        ListHeaderComponent={() => (
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
        )}        
        sections={sectionedData}
        keyExtractor={(item, index) => `${item.title}_${index.toString()}`}
        renderItem={({ item }) => {
          const isLocked = !userData.unlockedLessonIds.includes(item.id);
          const progress = progressData[item.id] || 0; 

          return (
            <View className='relative w-full flex-row justify-center mb-8 px-5'>
              <DuolingoButton 
                item={item} 
                isLocked={isLocked} 
                onPress={() => handleItemPress(item)}
              />
              <View className='absolute right-2 top-4 bg-stone-800 p-2 rounded-full'>
                { !isLocked ? (
                  <Text className='text-white text-sm'>
                    {progress.toFixed(0)}%
                  </Text>
                ) : (
                  <View className='flex flex-row justify-center items-center'>
                    <Icon name="attach-money" color="#fbbf24" size={20} />
                    <Text className='text-white text-sm'>
                      100
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
        }}
        renderSectionHeader={({section}) => (
          <View className="m-4 mx-6">
            <Text className='text-white text-lg font-psemibold mb-2'>
              {section.title}
            </Text>
          </View>
        )}  
      />

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className='flex-1 justify-center items-center bg-black bg-opacity-50'>
          <View className='bg-white m-4 p-4 rounded-lg shadow-lg'>
            <Text className='text-lg font-semibold mb-4'>Unlock {selectedItem?.title}</Text>
            <Text className='mb-4'>You need 100 coins to unlock this item.</Text>
            <View className='flex-row justify-between'>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)} 
                className='bg-gray-200 px-4 py-2 rounded'>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleUnlock} 
                className='bg-amber-600 px-4 py-2 rounded'>
                <Text className='text-white'>Pay 100 Coins</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Learn;

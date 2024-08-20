import { View, Text, Image, FlatList, TouchableOpacity, Modal } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { images } from '../../constants';
import { lessonData } from '../../data';
import DuolingoButton from '../../components/DuolingoButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';

const Learn = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const userData = useSelector(state => state.userData);
  const dispatch = useDispatch();

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
      <FlatList 
        ListHeaderComponent={() => (
          <View className='my-6 px-4 space-y-6'>
            <View className='justify-between items-start flex-row mb-6'>
              <View>
                <Text className='font-pmedium text-sm text-gray-100'>Welcome Back</Text>
                <Text className='text-2xl font-psemibold text-white'>name</Text>
              </View>

              <View className='mt-1.5'>
                <Image
                  source={images.logoSmall} 
                  className='w-9 h-10'
                  resizeMode='contain'
                />
              </View>
            </View>
          </View>
        )}        
        data={lessonData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          const isLocked = !userData.unlockedLessonIds.includes(item.id);
          return (
            <View className='w-full flex-row justify-center mb-10 px-5'>
              <DuolingoButton 
                item={item} 
                isLocked={isLocked} 
                onPress={() => handleItemPress(item)}
              />
            </View>
          );
        }}
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

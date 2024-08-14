import { View, Text, FlatList, Image, RefreshControl, Alert, TouchableOpacity } from 'react-native'
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

  return (
    <SafeAreaView className='bg-primary h-full'>
      { habitFormOpen  && <HabitForm setHabitFormOpen={setHabitFormOpen} userData={userData} />}
      { generalOpen  && <General setGeneralOpen={setGeneralOpen} userData={userData} />}
      { userData && (
        <FlatList 
          ListHeaderComponent={() => (
            <View className='my-6 px-4 space-y-6'>
              <View className='justify-between items-start flex-row mb-6'>
                <View>
                  <Text className='font-pmedium text-sm text-gray-100'>Welcome Back</Text>
                  <Text className='text-2xl font-psemibold text-white'>asdjfk</Text>
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
          data={userData.habits}
          keyExtractor={(item, index) => index}
          renderItem={({ item, index }) => (
            <View key={index} className="m-4 flex flex-row items-center space-x-4 rounded-md border border-white p-4">
              <Text className="text-white">{item.name}</Text>
            </View>
          )}
          ListFooterComponent={() => (
            <TouchableOpacity onPress={() => setHabitFormOpen(true)} className="m-4 flex flex-row items-center space-x-4 rounded-md border border-white p-4">
              <Icon name="add-circle-outline" color="white" size={26} />
              <View className="flex-1 space-y-1">
                <Text className="text-sm font-medium leading-none text-white">
                  Push Notifications
                </Text>
                <Text className="text-sm text-muted-foreground text-white">
                  Send notifications to device.
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
      <TouchableOpacity onPress={() => setGeneralOpen(true)} className="m-4 flex flex-row items-center space-x-4 rounded-md border border-white p-4">
        <Icon name="add-circle-outline" color="white" size={26} />
        <View className="flex-1 space-y-1">
          <Text className="text-sm font-medium leading-none text-white">
            Push Notifications
          </Text>
          <Text className="text-sm text-muted-foreground text-white">
            Send notifications to device.
          </Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default Home
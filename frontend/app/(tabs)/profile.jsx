import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Pie from '../../components/Pie'
import { useDispatch } from 'react-redux'

const Profile = () => {
  const dispatch = useDispatch();

  const handleResetUserData = () => {
    dispatch({ type: 'RESET_USER_DATA' });
  };

  return (
    <SafeAreaView className='bg-primary'>
      <ScrollView className='h-full'>
        <View className="m-4 mx-6">
          <Text className='text-white text-lg font-psemibold mb-2'>
            Account
          </Text>
          <View className='w-full bg-stone-800 rounded-md p-4'>
            <View className='flex flex-row gap-2'>
              <View className='w-12 h-12 bg-green-600 rounded-full'></View>

              <View className="m-4 mx-6">
                <Text className='text-white font-psemibold'>
                  Guest
                </Text>
                <Text className='text-white text-sm'>
                  User ID: 348199
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleResetUserData}
              activeOpacity={0.7}
              className={`bg-secondary rounded-xl h-12 justify-center items-center`}
            >
              <Text className={`text-primary font-psemibold text-lg`}>Reset data</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="m-4 mx-6">
          <Text className='text-white text-lg font-psemibold mb-2'>
            My records
          </Text>
          <View className='flex flex-row space-between gap-2'>
            <View className='flex-1 h-28 bg-stone-800 rounded-md p-4'>
              <Text className='text-white font-psemibold'>
                Recorded days
              </Text>
              <Text className='text-white text-base'>
                1
              </Text>
            </View>

            <View className='flex-1 h-28 bg-stone-800 rounded-md p-4'>
              <Text className='text-white font-psemibold'>
                Longest streak
              </Text>
              <Text className='text-white text-base'>
                1
              </Text>
            </View>
          </View>
        </View>

        <View className="m-4 mx-6">
          <Text className='text-white text-lg font-psemibold mb-2'>
            Total repetitions
          </Text>
          
          <Pie />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile

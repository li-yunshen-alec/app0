import { View, Text, FlatList, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import DuolingoButton from '../../components/DuolingoButton'
import { images } from '../../constants'
import Lesson from '../../components/Lesson'

import { lessonData } from '../../data'

const Learn = () => {
  const [activeLesson, setActiveLesson] = useState(undefined);

  return (
    <SafeAreaView className='bg-primary h-full'>
      {activeLesson !== undefined && <Lesson activeLesson={activeLesson} setActiveLesson={setActiveLesson} />}
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
        data={lessonData}
        keyExtractor={(item) => item.$id}
        renderItem={({ item, index }) => (
          <View key={index} className='w-full flex-row justify-center mb-10 px-5'>
            <DuolingoButton item={item} setActiveLesson={setActiveLesson} />
          </View>
        )}
      />
    </SafeAreaView>
  )
}

export default Learn
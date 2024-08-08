import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const DuolingoButton = ({ item, setActiveLesson }) => {
  return (
    <TouchableOpacity
      className='bg-secondary w-full h-20 rounded-md relative'
      onPress={() => setActiveLesson(item.id)}
    >
      <View className='justify-center flex-1 ml-3 gap-y-1'>
        <Text className='text-sm text-white font-psemibold'>{item.title && item.title}</Text>
        <Text className='text-white text-xs font-pregular' numberOfLines={1}>
          {item.id !== undefined && `Day ${item.id}`}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default DuolingoButton
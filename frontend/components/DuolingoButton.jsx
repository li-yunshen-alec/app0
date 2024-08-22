import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import Icon from 'react-native-vector-icons/MaterialIcons';

const DuolingoButton = ({ item, isLocked, onPress }) => {
  return (
    <TouchableOpacity
      className={`bg-secondary w-full h-20 rounded-md relative ${isLocked ? 'opacity-50' : ''}`}
      onPress={onPress}
    >
      <View className='justify-center flex-1 ml-3 gap-y-1'>
        <Text className='text-sm text-white font-psemibold'>{item.title && item.title}</Text>
        <Text className='text-white text-xs font-pregular' numberOfLines={1}>
          {item.id !== undefined && `Day ${item.id}`}
        </Text>
      </View>
      {isLocked && (
        <Icon 
          name="lock" 
          size={20} 
          color="white" 
          style={{ position: 'absolute', right: 20, bottom: 15 }} 
        />
      )}
    </TouchableOpacity>
  )
}

export default DuolingoButton;

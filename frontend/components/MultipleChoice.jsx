import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'

const MultipleChoice = ({ item, index }) => {

  const [selectedOption, setSelectedOption] = useState(undefined);

  const handleClick = (option) => {
    setSelectedOption(option.name);
    console.log(option, 'clicked')
  }

  return (
    <View key={index} className="m-4 mx-6">
      <Text className='text-white font-psemibold'>
        George
      </Text>
      {item.content && (
        <Text key={index} className='text-white text-base'>
          {item.content}
        </Text>
      )}
      <View className="py-4 mx-auto grid w-full items-start grid-cols-2 gap-4">
        {item.options.map((option, index) => (
          <TouchableOpacity
            key={index} 
            className={`flex items-center justify-center w-full rounded-xl h-20 border-2 border-b-4 border-gray-400 ${selectedOption === option.name ? 'border-secondary' : ''}`} 
            onPress={() => handleClick(option)}
          >
            <View className="flex flex-row gap-4 items-center w-full">
              {option.icon}
              <Text className={`text-lg text-white ${selectedOption === option.name ? 'border-secondary text-secondary' : ''}`}>{option.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      { item.slideNumber && (
        <Text className='text-white text-base'>
          {item.slideNumber}
        </Text>
      )}
    </View>
  )
}

export default MultipleChoice

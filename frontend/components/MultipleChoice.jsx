import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const MultipleChoice = ({ item, index }) => {

  const [selectedOption, setSelectedOption] = useState(undefined);
  const [answerFeedback, setAnswerFeedback] = useState(undefined);

  const dispatch = useDispatch();
  const userData = useSelector(state => state.userData);

  const handleClick = (option) => {
    setSelectedOption(option);
    console.log(option, 'clicked')
  }

  const handleSubmit = () => {
    if (selectedOption) {
      const isCorrect = selectedOption.name === item.answer;

      if (isCorrect) {
        const rewardCoins = 10;
        const updatedCoins = (userData.coins || 0) + rewardCoins;

        dispatch({ type: 'UPDATE_COINS', payload: updatedCoins });

        Alert.alert(
          'Well Done!',
          `Correct answer! You've earned ${rewardCoins} coins! 💰`,
          [{ text: 'Awesome!', style: 'default' }]
        );

        setAnswerFeedback(
          <Text className='text-white text-base'>
            Correct! {selectedOption.feedback}
          </Text>
        );
      }
      else {
        setAnswerFeedback(
          <Text className='text-white text-base'>
            Wrong! {selectedOption.feedback}
          </Text>
        );
      }
    }
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
            className={`flex items-center justify-center w-full rounded-xl h-20 border-2 border-b-4 border-gray-400 ${selectedOption?.name === option.name ? 'border-secondary' : ''}`} 
            onPress={() => handleClick(option)}
          >
            <View className="flex flex-row gap-4 items-center w-full">
              {option.icon}
              <Text className={`text-lg text-white ${selectedOption?.name === option.name ? 'border-secondary text-secondary' : ''}`}>{option.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>      
      {answerFeedback ? answerFeedback : (
        <TouchableOpacity onPress={handleSubmit} className="w-20 bg-transparent hover:bg-secondary-border-secondary-200 text-secondary font-semibold hover:text-white py-2 px-4 border border-secondary-200 hover:border-transparent rounded">
          <Text className="bg-transparent hover:bg-secondary-border-secondary-200 text-secondary font-semibold hover:text-white">
            Submit
          </Text>
        </TouchableOpacity>
      )}
      { item.slideNumber && (
        <Text className='text-white text-base'>
          {item.slideNumber}
        </Text>
      )}
    </View>
  )
}

export default MultipleChoice

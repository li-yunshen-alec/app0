import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Writing = ({ item, index }) => {
  const [value, setValue] = useState('');

  const handleSubmit = async () => {
    try {
      const newEntry = {
        title: item.title || 'Untitled',
        content: value,
      };
      
      // Fetch existing stored data
      const existingEntries = await AsyncStorage.getItem('prompts');
      const parsedEntries = existingEntries ? JSON.parse(existingEntries) : [];

      // Add new entry
      const updatedEntries = [...parsedEntries, newEntry];

      // Store the updated array
      await AsyncStorage.setItem('prompts', JSON.stringify(updatedEntries));

      Alert.alert('Success', 'Prompt submitted!');
      setValue(''); // Clear the text input
    } catch (error) {
      Alert.alert('Error', 'Failed to submit the prompt');
    }
  };

  return (
    <View key={index} className="m-4 mx-6">
      <Text className='text-white font-psemibold'>
        George
      </Text>
      {item.title && (
        <Text className='text-white font-pmedium text-lg'>
          {item.title}
        </Text>
      )}
      {item.content && (
        <Text className='text-white text-base'>
          {item.content}
        </Text>
      )}
      <View className='my-4 border-2 border-black-200 w-full px-4 bg-black-100 rounded-2xl focus:border-secondary'>
        <TextInput
          editable
          multiline
          numberOfLines={4}
          maxLength={400}
          onChangeText={text => setValue(text)}
          value={value}
          className='text-white text-base'
        />
      </View>      
      <TouchableOpacity onPress={handleSubmit} className="w-20 bg-transparent hover:bg-secondary-border-secondary-200 text-secondary font-semibold hover:text-white py-2 px-4 border border-secondary-200 hover:border-transparent rounded">
        <Text className="bg-transparent hover:bg-secondary-border-secondary-200 text-secondary font-semibold hover:text-white">
          Submit
        </Text>
      </TouchableOpacity>
      { item.slideNumber && (
        <Text className='text-white text-base'>
          {item.slideNumber}
        </Text>
      )}
    </View>
  )
}

export default Writing

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'

const WrittenResponse = ({ item, index }) => {

  const [form, setForm] = useState({
    name: '',
  });
  const [answerFeedback, setAnswerFeedback] = useState(undefined);

  const handleSubmit = () => {
    if (form.name) {
      console.log(form.name, 'submitted');
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

      <FormField 
        title='Name'
        value={form.name}
        handleChangeText={(e) => setForm({ ...form, name: e })}
        otherStyles='mt-7'
      />

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

export default WrittenResponse

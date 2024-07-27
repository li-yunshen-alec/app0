import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GoogleGenerativeAI } from "@google/generative-ai"
import { icons, images } from '../../constants';

import { lessonData } from '../../data'
import DuolingoButton from '../../components/DuolingoButton';

import Icon from 'react-native-vector-icons/MaterialIcons'; 

const genAI = new GoogleGenerativeAI("AIzaSyAEAh4mufNHAh_FiMwD_4nE8xng8Elll6w");
let model;
let chat;

async function run(prompt) {
  try {
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log(text, chat);
    return chat._history;
  } catch (error) {
    console.log(error);
    return error;
  }
}

const Profile = () => {
  const [activeLesson, setActiveLesson] = useState(undefined);
  const [lessonSlide, setLessonSlide] = useState(0);

  const [value, setValue] = useState('');
  const [result, setResult] = useState([]);

  useEffect(() => {
    if (activeLesson !== undefined) {
      console.log(lessonData[activeLesson]);
      const firstSlide = lessonData[activeLesson].content[0];

      const history = [
        {
          role: 'user',
          parts: [{ text: 'You are a fat-loss expert. You are currently trying to guide me through a lesson on how to lose weight. Start the lesson immediately.' }]
        },
        {
          role: 'model',
          parts: [{ text: firstSlide.isCover ? lessonData[activeLesson].content[1].content : firstSlide.content }]
        }
      ];
      
      setResult(history);
      
      model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
      chat = model.startChat({
        history,
        generationConfig: {
          maxOutputTokens: 100,
        },
      });  
    }
  }, [activeLesson]);

  const handleChangeText = (text) => {
    setValue(text);
  }
  
  const handleNext = () => {
    if (lessonSlide !== lessonData[activeLesson].content.length - 1) {
      const history = [
        ...result,
        {
          role: 'user',
          parts: [{ text: 'Continue.' }]
        },
        {
          role: 'model',
          parts: [{ text: lessonData[activeLesson].content[lessonSlide + 1].content }]
        }
      ];

      setResult(history);

      model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
      chat = model.startChat({
        history,
        generationConfig: {
          maxOutputTokens: 100,
        },
      });
      
      setLessonSlide(prev => prev + 1);
    }
  }
  
  const submitPrompt = async () => {
    const result = await run(value);
    setResult(result);
    setValue('');
  }

  const renderItem = ({ item, index }) => (
    <View key={index} className="m-4 space-x-4 rounded-md border border-white p-4">
      <Text className='text-white'>
        {`${item.role === 'user' ? 'You:' : 'George:' }`}
      </Text>
      {item.parts.map((item, index) => (
        <Text className='text-white'>
          {item.text}
        </Text>
      ))}
    </View>
  );

  return (
    <SafeAreaView className='bg-primary h-full flex flex-col space-between'>
      {activeLesson !== undefined ? (
        <>
          <FlatList
            data={result}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={() => (
              <View className='px-4'>
                <TouchableOpacity className='z-50' onPress={() => setActiveLesson(undefined)}>
                  <Icon name='arrow-back' size={20} color='#FF9C01' />
                </TouchableOpacity>
              </View>
            )}
          />
          <View className='flex flex-row gap-2 p-2'>
            <TouchableOpacity onPress={handleNext} className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
              <Text className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white">
                Next
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
              <Text className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white">
                Option 1
              </Text>
            </TouchableOpacity>
          </View>
          <View className='border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row space-x-4'>
            <TextInput
              className='flex-1 text-white font-pregular text-base mt-0.5'
              value={value}
              placeholder='Enter prompt'
              placeholderTextColor='#7b7b8b'
              onChangeText={handleChangeText}
            />
            
            <TouchableOpacity onPress={submitPrompt}>
              <Image
                source={icons.search}
                className='w-5 h-5'
                resizeMode='contain'
              />
            </TouchableOpacity>
          </View>
        </>
      ) : (
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
      )}
    </SafeAreaView>
  )
}

export default Profile
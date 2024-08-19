import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { icons, images } from '../../constants';
import { lessonData } from '../../data';
import DuolingoButton from '../../components/DuolingoButton';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook
import MultipleChoice from '../../components/MultipleChoice';
import Lesson from '../../components/Lesson';

const genAI = new GoogleGenerativeAI("AIzaSyAEAh4mufNHAh_FiMwD_4nE8xng8Elll6w");
let model;
let chat;

function isExternalLink(uri) {
  const regex = /^(http|https):\/\//;
  return regex.test(uri);
}

const Learn = () => {
  const [slideshowMode, setSlideshowMode] = useState(false);

  const navigation = useNavigation(); // Use the useNavigation hook
  const [activeLesson, setActiveLesson] = useState(undefined);
  const [lessonSlide, setLessonSlide] = useState(0);

  const [value, setValue] = useState('');
  const [result, setResult] = useState([]);
  const [cleanResult, setCleanResult] = useState([]);
  const [options, setOptions] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  async function run(prompt) {
    try {
      console.log('chat history before msg', chat._history);
      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('chat history after msg', chat._history);
      return chat._history;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  
  async function getOptions(history) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: "You are a fat-loss expert. You communicate through brief text conversations where you provide the best advice in short but sweet messages that are 50 tokens or less. Your current task is, given a conversation history, provide a list of the 3 best questions the patient could ask about your most recent response where your potential answers to these questions would help them best understand your most recent response.",
        generationConfig: { responseMimeType: "application/json" }
      });
  
      const prompt = `Based on this chat history, provide a list of the 3 best questions the patient could ask about your most recent response where your potential answers to these questions would help them best understand your most recent response. Use this JSON schema: { "options": [] }. This is the chat history: ${JSON.stringify(history)}`;
  
      console.log(prompt);
      const result = await model.generateContent(prompt);
      setOptions(JSON.parse(result.response.text()).options);
  } catch (error) {
      console.log(error);
      return error;
    }
  }  

  // Create a ref for the chat
  const chatRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of the FlatList whenever result changes
    if (chatRef.current) {
      chatRef.current.scrollToEnd();
    }
  }, [result]);

  const formatData = (item) => {
    switch (item.type) {
      case 'MULTIPLE_CHOICE':
        return {
          ...item,
          role: 'model',
          parts: [{ text: item.content }]
        };
      default:
        return {
          role: 'model',
          parts: [{ text: item.content }],
          image: item?.image,
          slideNumber: lessonSlide + 1
        }
    }
  }

  useEffect(() => {
    if (activeLesson !== undefined) {
      const firstSlide = lessonData[activeLesson].content[0];

      const history = [
        {
          role: 'user',
          parts: [{ text: 'You are a fat-loss expert. You are currently trying to guide me through a lesson on how to lose weight. Start the lesson immediately.' }]
        },
        formatData(firstSlide)
      ];
      
      setResult(history);

      const cleanHistory = [
        {
          role: 'user',
          parts: [{ text: 'You are a fat-loss expert. You are currently trying to guide me through a lesson on how to lose weight. Start the lesson immediately.' }]
        },
        {
          role: 'model',
          parts: [{ text: firstSlide.content }]
        },
      ];

      setCleanResult(cleanHistory);
      
      model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: "You are a fat-loss expert. You communicate through brief text conversations where you provide the best advice in short but sweet messages that are 50 tokens or less."
      });
      chat = model.startChat({
        history: cleanHistory,
        generationConfig: {
          maxOutputTokens: 100,
        },
      });  

      navigation.setOptions({ tabBarStyle: { display: 'none' } }); // Hide the tab bar

      setLessonSlide(prev => prev + 1);
    } 
    else { // Clicked off active lesson
      navigation.setOptions({ tabBarStyle: {
        backgroundColor: '#161622',
        borderTopWidth: 1,
        borderTopColor: '#232533',
        height: 84
      } }); // Show the tab bar

      setLessonSlide(0);
      setValue('');
      setResult([]);
      setOptions([]);
      setIsTyping(false);    
    }
  }, [activeLesson]);

  const handleChangeText = (text) => {
    setValue(text);
  }
  
  const handleNext = () => {
    if (lessonSlide !== lessonData[activeLesson].content.length - 1) {
      let history;
      let cleanHistory;

      switch (lessonData[activeLesson].content[lessonSlide].type) {
        case 'MULTIPLE_CHOICE':
          history = [
            ...result,
            {
              role: 'user',
              parts: [{ text: 'Continue.' }]
            },
            {
              ...lessonData[activeLesson].content[lessonSlide],
              role: 'model',
              parts: [{ text: lessonData[activeLesson].content[lessonSlide].content }]
            }
          ];

          setResult(history);

          cleanHistory = [
            ...cleanResult,
            {
              role: 'user',
              parts: [{ text: 'Continue.' }]
            },
            {
              role: 'model',
              parts: [{ text: lessonData[activeLesson].content[lessonSlide].content }]
            }
          ];

          setCleanResult(cleanHistory);

          break;          
        default:
          history = [
            ...result,
            {
              role: 'user',
              parts: [{ text: 'Continue.' }]
            },
            {
              role: 'model',
              parts: [{ text: lessonData[activeLesson].content[lessonSlide].content }],
            }
          ];

          delayedUpdate(history, lessonData[activeLesson].content[lessonSlide].content, lessonData[activeLesson].content[lessonSlide]?.image, lessonSlide + 1);
          
          cleanHistory = [
            ...cleanResult,
            {
              role: 'user',
              parts: [{ text: 'Continue.' }]
            },
            {
              role: 'model',
              parts: [{ text: lessonData[activeLesson].content[lessonSlide].content }],
            }
          ];

          setCleanResult(cleanHistory);
      }

      chat = model.startChat({
        history: cleanHistory,
        generationConfig: {
          maxOutputTokens: 100,
        },
      });
      
      setLessonSlide(prev => prev + 1);
    }
  }
  
  const delayedUpdate = (history, text, image, slideNumber) => {
    setIsTyping(true);

    getOptions(history);
    let result = [...history];
    result[result.length - 1].parts[0].text = "";
  
    const paragraphs = text.split('\n\n');
    let currentParagraphIndex = 0;
  
    const updateParagraph = () => {
      const newResult = [...result];
      const lastItem = newResult[newResult.length - 1];

      if (currentParagraphIndex < paragraphs.length) {
  
        if (lastItem.parts[0].text) {
          lastItem.parts[0].text += '\n\n' + paragraphs[currentParagraphIndex];
        } else {
          lastItem.parts[0].text = paragraphs[currentParagraphIndex];
        }
        
        result = newResult; // Update the local result variable
        setResult(newResult);

        currentParagraphIndex++;
        setTimeout(updateParagraph, 2000); // Update every 2000 ms
      } 
      else {
        if (image) {
          lastItem.image = image;
        }
        if (slideNumber) {
          lastItem.slideNumber = slideNumber
        }
        setResult(newResult);
        setIsTyping(false);
      }
    };
  
    updateParagraph();
  };
    
  const submitPrompt = async () => {
    const result = await run(value);
    const latestResponse = result[result.length - 1];
    delayedUpdate(result, latestResponse.parts[0].text);
    setValue('');
  }

  const submitOption = async (prompt) => {
    const result = await run(prompt);
    const latestResponse = result[result.length - 1];
    delayedUpdate(result, latestResponse.parts[0].text);
    setValue('');
  }

  const renderItem = ({ item, index }) => {
    switch (item.type) {
      case 'MULTIPLE_CHOICE':
        return <MultipleChoice item={item} index={index} />
      default:
        return (
          <View key={index} className="m-4 mx-6">
            <Text className='text-white font-psemibold'>
              {`${item.role === 'user' ? 'You' : 'George' }`}
            </Text>
            {item.parts.map((item, index) => (
              <Text key={index} className='text-white text-base'>
                {item.text}
              </Text>
            ))}
            { item.image && (
              <Image 
                source={isExternalLink(item.image) ? {uri: item.image} : item.image}
                className='h-60 my-4'
                resizeMode='contain'
              />
            )}
            { item.slideNumber && (
              <Text className='text-white text-base'>
                {item.slideNumber}
              </Text>
            )}
          </View>
        )
    }
  };

  return (
    <SafeAreaView className='bg-primary h-full flex flex-col space-between'>
      {activeLesson !== undefined ? (
        <>
          <View className='px-4 pb-4 flex flex-row items-center justify-between'>
            <TouchableOpacity className='z-50' onPress={() => setActiveLesson(undefined)}>
              <Icon name='arrow-back' size={20} color='#FF9C01' />
            </TouchableOpacity>

            { !slideshowMode ? (
              <TouchableOpacity onPress={() => setSlideshowMode(true)} className='flex flex-row items-center justify-center bg-stone-800 px-2 py-1 rounded-full'>
                <Text className='font-pregular text-white text-base mt-0.5 mx-1'>Slideshow</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setSlideshowMode(false)} className='flex flex-row items-center justify-center bg-stone-800 px-2 py-1 rounded-full'>
                <Text className='font-pregular text-white text-base mt-0.5 mx-1'>Chat</Text>
              </TouchableOpacity>
            )}
          </View>
          { !slideshowMode ? (
            <>
              <FlatList
                ref={chatRef}
                data={result}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}

              />
              { isTyping && (
                <Text className='text-white text-base pl-4'>
                  Typing...
                </Text>
              )}
              <View className='h-30'>
                <ScrollView horizontal>
                  <View className='flex flex-row gap-2 p-2'>
                    <TouchableOpacity onPress={handleNext} className="bg-transparent hover:bg-secondary-border-secondary-200 text-secondary font-semibold hover:text-white py-2 px-4 border border-secondary-200 hover:border-transparent rounded">
                      <Text className="bg-transparent hover:bg-secondary-border-secondary-200 text-secondary font-semibold hover:text-white">
                        Next
                      </Text>
                    </TouchableOpacity>
                    { options && options.map((option, index) => (
                      <TouchableOpacity key={index} onPress={() => submitOption(option)} className="bg-transparent hover:bg-secondary-border-secondary-200 text-secondary font-semibold hover:text-white py-2 px-4 border border-secondary-200 hover:border-transparent rounded">
                        <Text className="bg-transparent hover:bg-secondary-border-secondary-200 text-secondary font-semibold hover:text-white">
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
                <View className='w-full p-2'>
                  <View className='border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row space-x-4'>
                    <TextInput
                      className='flex-1 text-white font-pregular text-base mt-0.5'
                      value={value}
                      placeholder='Enter prompt'
                      placeholderTextColor='#7b7b8b'
                      onChangeText={handleChangeText}
                    />
                    
                    <TouchableOpacity onPress={submitPrompt}>
                      <Icon name='send' size={20} color='#FF9C01' />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </>
          ) : (
            <Lesson activeLesson={activeLesson} setActiveLesson={setActiveLesson} setSlideshowMode={setSlideshowMode} />
          )}
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

export default Learn;

import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { icons, images } from '../../constants';
import { lessonData } from '../../data';
import DuolingoButton from '../../components/DuolingoButton';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook
import MultipleChoice from '../../components/MultipleChoice';
import Lesson from '../../components/Lesson';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Markdown from 'react-native-markdown-display';
import Writing from '../../components/Writing';

const genAI = new GoogleGenerativeAI("AIzaSyAEAh4mufNHAh_FiMwD_4nE8xng8Elll6w");
let model;
let chat;

function isExternalLink(uri) {
  const regex = /^(http|https):\/\//;
  return regex.test(uri);
}

const Chat = () => {
  const { activeLesson } = useLocalSearchParams();

  const [slideshowMode, setSlideshowMode] = useState(false);

  const navigation = useNavigation(); // Use the useNavigation hook
  const [lessonSlide, setLessonSlide] = useState(0);

  const [value, setValue] = useState('');
  const [result, setResult] = useState([]);
  const [cleanResult, setCleanResult] = useState([]);
  const [options, setOptions] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    const loadConversation = async () => {
      try {
        const savedData = await AsyncStorage.getItem(`@conversation_data_${activeLesson}`);
  
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setResult(parsedData.result);
          setCleanResult(parsedData.cleanResult);
          setLessonSlide(parsedData.lessonSlide);
          setOptions(parsedData.options);
        }
      } catch (error) {
        console.error('Failed to load conversation:', error);
      }
    };
  
    // loadConversation();
  }, [activeLesson]);
    
  useEffect(() => {
    const saveConversation = async () => {
      try {
        const dataToSave = {
          result,
          cleanResult,
          lessonSlide,
          options,
        };
        
        await AsyncStorage.setItem(`@conversation_data_${activeLesson}`, JSON.stringify(dataToSave));
        
        const totalSlides = lessonData[activeLesson].content.length;
        const progress = (lessonSlide / totalSlides) * 100;
        
        const storedProgress = await AsyncStorage.getItem('@progress_store');
        const progressStore = storedProgress ? JSON.parse(storedProgress) : {};
  
        progressStore[activeLesson] = progress;
  
        await AsyncStorage.setItem('@progress_store', JSON.stringify(progressStore));  
      } 
      catch (error) {
        console.error('Failed to save conversation:', error);
      }
    };
  
    // saveConversation();
  }, [result, cleanResult, lessonSlide, options, activeLesson]);
  
  const resetConversation = async () => {
    try {
      await AsyncStorage.removeItem(`@conversation_data_${activeLesson}`);
      
      setResult([]);
      setCleanResult([]);
      setLessonSlide(0);
      setValue('');
      setOptions([]);
      setIsTyping(false);
  
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
  
      // getOptions(cleanHistory);
    } catch (error) {
      console.error('Failed to reset conversation:', error);
    }
  };
    
  async function run(prompt) {
    try {
      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      const text = response.text();

      console.log('this is the text', text);
      
      return chat._history;
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
        {
          role: 'model',
          parts: [{ text: JSON.stringify(
            {
              response: firstSlide.content,
              options: firstSlide.options,
              image: firstSlide?.image,
              slideNumber: lessonSlide + 1
            }
          ) }]
        },
      ];

      console.log('firstSlide?.image', firstSlide?.image)
      
      setResult(history);

      setOptions(firstSlide.options);

      console.log('fdafdsafdsa')
      console.log('schematype', SchemaType)

      const schema = {
        description: "Response that contains not only the actual content of the response, but also a list of the 2-3 best questions the user could ask about the content of the response",
        type: "OBJECT",
        properties: {
          response: {
            type: "STRING",
            description: "Content of the response",
            nullable: false,
          },
          questions: {
            type: "ARRAY",          
            description: "List of the 2-3 best questions the user could ask about the content of your response",
            items: {
              type: "STRING",
              description: "The question in as few words as possible",
              nullable: false,
            },
          },
          type: {
            type: "STRING",
            description: "Type of response",
            nullable: true,
            format: "enum",
            enum: ["MULTIPLE_CHOICE", "WRITING"],
          },
          image: {
            type: "STRING",
            description: "Optional image",
            nullable: true,
          },
          slideNumber: {
            type: "INTEGER",
            description: "Optional indicator of the current slide number",
            nullable: true,
          }
        },
        required: ["response", "questions"],
      };

      console.log('schema', schema);
      
      model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: 
`You are a fat-loss expert. You communicate through brief text conversations where you provide the best advice in short but sweet messages that are 50 tokens or less.

Your responses contain not only the actual content of your response, but also a list of the 2-3 best questions the patient could ask about the content of your response.`,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: schema,
        },
      });
      chat = model.startChat({
        history: history,
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
    if (lessonSlide < lessonData[activeLesson].content.length) {
      let history;
      const currentSlide = lessonData[activeLesson].content[lessonSlide];

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

          break;
        case 'WRITING':
          history = [
            ...result,
            {
              role: 'user',
              parts: [{ text: 'Continue.' }]
            },
            {
              role: 'model',
              parts: [{ text: JSON.stringify(currentSlide) }]
            }
          ];

          setResult(history);

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
              parts: [{ text: JSON.stringify(
                {
                  response: currentSlide.content,
                  options: currentSlide.options,
                }
              ) }]
            },
          ];

          delayedUpdate(history, currentSlide.content, currentSlide?.image, currentSlide.options, lessonSlide + 1);
      }

      chat = model.startChat({
        history: history,
        generationConfig: {
          maxOutputTokens: 100,
        },
      });
      
      setLessonSlide(prev => prev + 1);
    }
  }
  
  const delayedUpdate = (history, text, image, options, slideNumber) => {
    setOptions([]);
    setIsTyping(true);

    let result = history;
  
    const paragraphs = text.split('\n\n');
    let currentParagraphIndex = 0;

    const newResult = [...result];
    const lastItem = newResult[newResult.length - 1];
    lastItem.parts[0].text = JSON.stringify({ response: "", options: [] });
    result = newResult;
    setResult(newResult);
  
    const updateParagraph = () => {
      const newResult = [...result];
      const lastItem = newResult[newResult.length - 1];

      if (currentParagraphIndex < paragraphs.length) {
        let lastItemText = JSON.parse(lastItem.parts[0].text);
        lastItemText.response += (lastItemText.response ? '\n\n' : '') + paragraphs[currentParagraphIndex];
        lastItem.parts[0].text = JSON.stringify(lastItemText);
        
        result = newResult; // Update the local result variable
        setResult(newResult);

        currentParagraphIndex++;
        setTimeout(updateParagraph, 1000); // Update every 2000 ms
      } 
      else {
        let lastItemText = JSON.parse(lastItem.parts[0].text);
        if (image) {
          lastItemText.image = image;
        }
        if (slideNumber) {
          lastItemText.slideNumber = slideNumber;
        }
        if (options) {
          lastItemText.options = options;
        }
        lastItem.parts[0].text = JSON.stringify(lastItemText);
        
        setResult(newResult);
        setIsTyping(false);
        setOptions(options);
      }
    };
  
    updateParagraph();
  };
  
  const submitPrompt = async () => {
    const prompt = value;
    setValue('');

    const res = await run(prompt);
    const latestResponse = res[res.length - 1];
    const responseObj = JSON.parse(latestResponse.parts[0].text);
    delayedUpdate(res, responseObj.response, responseObj.image, responseObj.options, responseObj.slideNumber);
  }

  const submitOption = async (option) => {
    console.log('submitOption', option);

    if (option.response) {
      history = [
        ...result,
        {
          role: 'user',
          parts: [{ text: option.question }]
        },
        {
          role: 'model',
          parts: [{ text: JSON.stringify(
            {
              response: option.response,
            }
          ) }]
        },
      ];

      delayedUpdate(history, option.response, option?.image, option.options);

    } else {
      const res = await run(option.question);
      const latestResponse = res[res.length - 1];
      console.log('latestResponse', latestResponse)
      const responseObj = JSON.parse(latestResponse.parts[0].text);
      console.log('responseObj', responseObj);
      delayedUpdate(res, responseObj.response, responseObj.image, responseObj.options, responseObj.slideNumber);
    }
  }

  const renderItem = ({ item, index }) => {
    const isAI = item.role === 'model';
    if (isAI) {
      const responseObj = JSON.parse(item.parts[0].text);

      console.log('responseObj', responseObj);

      switch (responseObj.type) {
        case 'MULTIPLE_CHOICE':
          return <MultipleChoice item={responseObj} index={index} />
        case 'WRITING':
          return <Writing item={responseObj} index={index} />
        default:
          return (
            <View key={index} className="m-4 mx-6">
              <Text className='text-white font-psemibold'>
                George
              </Text>
              <Markdown style={{ body: { color: 'white', fontSize: 16, lineHeight: 26 } }}>
                {responseObj.response}
              </Markdown>  
              { responseObj.image && (
                <Image 
                  source={isExternalLink(responseObj.image) ? {uri: responseObj.image} : images[responseObj.image]}
                  className='h-60 w-full my-4'
                  resizeMode='contain'
                />
              )}
              { responseObj.slideNumber && (
                <Text className='text-white text-base mt-2'>
                  {`${responseObj.slideNumber} of ${lessonData[activeLesson].content.length}`}
                </Text>
              )}
            </View>
          )
      }
    } else {
      return (
        <View key={index} className="m-4 mx-6">
          <Text className='text-white font-psemibold'>
            You
          </Text>
          {item.parts.map((item, index) => (
            <Text key={index} className='text-white text-base'>
              {item.text}
            </Text>
          ))}
        </View>
      )
    }
  };

  return (
    <SafeAreaView className='bg-primary h-full flex flex-col space-between'>
      <View className='px-4 pb-4 flex flex-row items-center justify-between'>
        <TouchableOpacity className='z-50' onPress={() => router.replace('/learn')}>
          <Icon name='arrow-back' size={20} color='#FF9C01' />
        </TouchableOpacity>

        <View className='flex flex-row items-center justify-end gap-2'>
          <TouchableOpacity onPress={resetConversation} className='flex flex-row items-center justify-center bg-red-600 px-2 py-1 rounded-full'>
            <Text className='font-pregular text-white text-base mt-0.5 mx-1'>Reset</Text>
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
          <View className=''>
            <View className='flex flex-row justify-end flex-wrap gap-2 p-2'>
              { options && options.map((option, index) => (
                <TouchableOpacity key={index} onPress={() => submitOption(option)} className="bg-transparent hover:bg-secondary-border-secondary-200 text-secondary font-semibold hover:text-white py-2 px-4 border border-secondary-200 hover:border-transparent rounded">
                  <Text className="bg-transparent hover:bg-secondary-border-secondary-200 text-secondary font-semibold hover:text-white">
                    {option.question}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={handleNext} className="bg-transparent hover:bg-secondary-border-secondary-200 text-secondary font-semibold hover:text-white py-2 px-4 border border-secondary-200 hover:border-transparent rounded">
                <Text className="bg-transparent hover:bg-secondary-border-secondary-200 text-secondary font-semibold hover:text-white">
                  Next
                </Text>
              </TouchableOpacity>
            </View>
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
        <Lesson activeLesson={activeLesson} setSlideshowMode={setSlideshowMode} />
      )}
    </SafeAreaView>
  )
}

export default Chat
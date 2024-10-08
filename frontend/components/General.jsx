import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook

const genAI = new GoogleGenerativeAI("AIzaSyAEAh4mufNHAh_FiMwD_4nE8xng8Elll6w");
let model;
let chat;

function isExternalLink(uri) {
  const regex = /^(http|https):\/\//;
  return regex.test(uri);
}

const General = ({ setGeneralOpen }) => {
  const navigation = useNavigation(); // Use the useNavigation hook

  const [value, setValue] = useState('');
  const [result, setResult] = useState([]);
  const [options, setOptions] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

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
      console.log('options', JSON.parse(result.response.text()).options);
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

  useEffect(() => {
    const history = [
      {
        role: 'user',
        parts: [{ text: 'You are a fat-loss expert. You are currently hearing me out as part of a general conversation, where you might ask me questions, or provide advice to me.' }]
      },
      {
        role: 'model',
        parts: [{ text: 'Hello! Is there anything in particular you would like to talk about?' }],
      }
    ];
    
    setResult(history);
    
    model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "You are a fat-loss expert. You communicate through brief text conversations where you provide the best advice in short but sweet messages that are 50 tokens or less."
    });
    chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 100,
      },
    });  

    navigation.setOptions({ tabBarStyle: { display: 'none' } }); // Hide the tab bar
  }, []);

  const handleChangeText = (text) => {
    setValue(text);
  }
  
  const delayedUpdate = (history, text, image, slideNumber) => {
    setIsTyping(true);

    console.log('history', JSON.stringify(history));
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
        
        console.log(currentParagraphIndex, JSON.stringify(newResult));
  
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
    console.log(JSON.stringify(result));
    const latestResponse = result[result.length - 1];
    delayedUpdate(result, latestResponse.parts[0].text);
    setValue('');
  }

  const submitOption = async (prompt) => {
    const result = await run(prompt);
    console.log(JSON.stringify(result));
    const latestResponse = result[result.length - 1];
    delayedUpdate(result, latestResponse.parts[0].text);
    setValue('');
  }

  const renderItem = ({ item, index }) => (
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
  );

  const handleChatClose = () => {
    navigation.setOptions({ tabBarStyle: {
      backgroundColor: '#161622',
      borderTopWidth: 1,
      borderTopColor: '#232533',
      height: 84
    } }); // Show the tab bar

    setGeneralOpen(false);
  }

  return (
    <SafeAreaView className='bg-primary h-full flex flex-col space-between'>
      <FlatList
        ref={chatRef}
        data={result}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={() => (
          <View className='px-4'>
            <TouchableOpacity className='z-50' onPress={handleChatClose}>
              <Icon name='arrow-back' size={20} color='#FF9C01' />
            </TouchableOpacity>
          </View>
        )}
      />
      { isTyping && (
        <Text className='text-white text-base pl-4'>
          Typing...
        </Text>
      )}
      <View className='h-30'>
        <ScrollView horizontal>
          <View className='flex flex-row gap-2 p-2'>
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
    </SafeAreaView>
  )
}

export default General;

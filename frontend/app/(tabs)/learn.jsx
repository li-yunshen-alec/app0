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

const Learn = () => {

  return (
    <SafeAreaView className='bg-primary h-full flex flex-col space-between'>
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
            <DuolingoButton item={item} />
          </View>
        )}
      />
    </SafeAreaView>
  )
}

export default Learn;

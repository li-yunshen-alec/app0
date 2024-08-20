import { View, Text, Modal, TouchableOpacity, Image, Button, FlatList, Animated } from 'react-native'
import React, { useRef, useState } from 'react'
import { icons } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context';

import { lessonData } from '../data'; 
import { LinearGradient } from 'expo-linear-gradient';

import Icon from 'react-native-vector-icons/MaterialIcons'; 
import { ScalingDot } from 'react-native-animated-pagination-dots';
import { router } from 'expo-router';

function isExternalLink(uri) {
  const regex = /^(http|https):\/\//;
  return regex.test(uri);
}

const Lesson = ({ activeLesson, setSlideshowMode }) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const renderItem = ({ item, index }) => (
    <View className='h-[100vh] w-[100vw] pt-12'>
      { item.isCover ? (
        <View className='h-full'>
          
          <Image 
            source={isExternalLink(item.image) ? {uri: item.image} : item.image}
            className='w-full h-3/5 mb-4'
            resizeMode='cover'
          />

          <View className='bg-primary'>
            <View className='w-full flex justify-center pl-4 pt-4'>
              <Text className="text-white font-psemibold text-3xl">
                {item.title}
              </Text>
            </View>

            <View className='w-full flex-row justify-between items-center pl-4 pr-2'>
              <Text className='font-pmedium text-base text-white'>{item.content}</Text>
              <Icon name="arrow-right-alt" color="white" size={56} />
            </View>
          </View>
        </View>
      ) : (
        <>
          { item.image && (
            <View className='w-full h-1/3 mb-10'>
              <Image 
                source={{uri: item.image}}
                className='w-full h-full'
                resizeMode='contain'
              />
            </View>
          )}
    
          <View className='my-4 px-6'>
            <Text className='font-pmedium text-lg text-white'>{item.content}</Text>
          </View>
        </>
      )}      
    </View>
  );

  return (
    <Modal>
      <SafeAreaView className='relative bg-primary w-full h-full border-r-emerald-950'>
        <View className='absolute top-0 left-0 z-50 px-4 pb-4 w-full flex flex-row items-center justify-between'>
          <TouchableOpacity className='' onPress={() => router.replace('/learn')}>
            <Icon name='arrow-back' size={20} color='#FF9C01' />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setSlideshowMode(false)} className='flex flex-row items-center justify-center bg-stone-800 px-2 py-1 rounded-full'>
            <Text className='font-pregular text-white text-base mt-0.5 mx-1'>Chat</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={lessonData[activeLesson].content}
          renderItem={renderItem}
          pagingEnabled
          decelerationRate={'normal'}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {
              useNativeDriver: false,
            },
          )}  
        />
      </SafeAreaView>
    </Modal>
  )
}

export default Lesson

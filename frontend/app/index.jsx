import { Link, Redirect, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants';
import CustomButton from '../components/CustomButton';
import { useSelector } from 'react-redux';
import { auth } from '../lib/firebase';

export default function App() {
  const isLoading = useSelector(state => state.isLoading);

  if (!isLoading && auth.currentUser) return <Redirect href={'/home'} />

  return (
    <>
      { auth.currentUser ? <Redirect href={'/home'} /> :
        <SafeAreaView className='bg-primary h-full'>
          <ScrollView contentContainerStyle={{ height: '100%' }}>
            <View className='w-full h-full justify-center items-center px-4'>
              <Image
                source={images.logo}
                className="w-[130px] h-[84px]"
                resizeMode='contain'
              />

              <Image 
                source={images.cards}
                className='max-w-[380px] w-full h-[300px]'
                resizeMode='contain'
              />

              <View className='relative mt-5'>
                <Text className='text-3xl text-white font-bold text-center'>Make lasting weight transformations with <Text className='text-secondary-200'>AI</Text></Text>
                <Image 
                  source={images.path}
                  className='w-[136px] h-[15px] absolute -bottom-2 -right-8'
                  resizeMode='contain'
                />
              </View>
              
              <Text className='text-sm text-gray-100 mt-7 text-center'>Sign up to chat with George, your personal fitness coach</Text>
            
              <CustomButton 
                title='Continue with email'
                handlePress={() => router.push('/sign-in')}
                containerStyles='w-full mt-7'
              />
            </View>
          </ScrollView>

          <StatusBar backgroundColor='#161622' style='light' />
        </SafeAreaView>
      }
    </>
  );
}

import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants'
import FormField from '../../components/FormField'

import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { auth, db } from '../../lib/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

const SignUp = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (!form.username || !form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all the fields')
    }
    
    setIsSubmitting(true);
    
    try {
      createUserWithEmailAndPassword(auth, form.email, form.password)
        .then((userCredential) => {
          // Signed up
          const signUp = async () => {
            const user = userCredential.user;
            
            const userDocRef = doc(db, "users", user.uid);

            const userData = {
              username: form.username,
              habits: {}
            };
            
            await setDoc(userDocRef, userData);
          }

          signUp();
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          
          console.log(error);
        });

      router.replace('/home')
    } catch (error) {
      Alert.alert('Error', error.message)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full justify-center min-h-[85vh] px-4 my-6'>
          <Image 
            source={images.logo}
            className='w-[115px] h-[35px]'
            resizeMode='contain'
          />

          <Text className='text-2xl text-white text-semibold mt-10 font-psemibold'>
            Sign up
          </Text>

          <FormField 
            title='Username'
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles='mt-7'
          />
          <FormField 
            title='Email'
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles='mt-7'
            keyboardType='email-address'
          />
          <FormField 
            title='Password'
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles='mt-7'
          />

          <CustomButton 
            title='Sign up'
            handlePress={submit}
            containerStyles='mt-7'
            isLoading={isSubmitting}
          />

          <View className='justify-center pt-5 flex-row gap-2'>
            <Text className='text-lg text-gray-100 font-pregular'>
              Have an account already?
            </Text>
            <Link href={'/sign-in'} className='text-lg font-psemibold text-secondary'>Log in</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp
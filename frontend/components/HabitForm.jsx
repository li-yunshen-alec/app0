import { Modal, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from './FormField';
import CustomButton from './CustomButton';
import { useDispatch } from 'react-redux';


const HabitForm = ({ setHabitFormOpen, userData }) => {
  const [form, setForm] = useState({
    name: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();

  const submit = async () => {
    dispatch({
      type: 'ADD_HABIT',
      payload: { name: form.name, count: 0 }
    });
  
    setHabitFormOpen(false);
  };
  
  return (
    <Modal>
      <SafeAreaView className='bg-primary w-full h-full border-r-emerald-950'>
        <View className='w-full min-h-[85vh] px-4 my-6'>
          <Text className='text-2xl text-white text-semibold mt-10 font-psemibold'>
            Create a promise
          </Text>
          
          <FormField 
            title='Name'
            value={form.name}
            handleChangeText={(e) => setForm({ ...form, name: e })}
            otherStyles='mt-7'
          />

          <CustomButton 
            title='Submit'
            handlePress={submit}
            containerStyles='mt-7'
            isLoading={isSubmitting}
          />
        </View>
      </SafeAreaView>
    </Modal>
  )
}

export default HabitForm
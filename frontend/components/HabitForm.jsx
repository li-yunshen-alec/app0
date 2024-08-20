import { Modal, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from './FormField';
import CustomButton from './CustomButton';
import { useDispatch } from 'react-redux';


const HabitForm = ({ setHabitFormOpen, userData, isEditing, selectedItem, setSelectedItem }) => {
  const [form, setForm] = useState({
    name: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedItem) setForm(selectedItem);
  }, [selectedItem]);

  const dispatch = useDispatch();

  const submit = async () => {
    if (selectedItem) {
      dispatch({
        type: 'UPDATE_HABIT_NAME',
        payload: form,
        selectedItem
      })
    }
    else {
      dispatch({
        type: 'ADD_HABIT',
        payload: { name: form.name, count: 0 }
      });
    }
  
    setSelectedItem(null);
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
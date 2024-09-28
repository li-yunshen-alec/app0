import { View, Text } from 'react-native'
import React from 'react'
import Modal from "react-native-modal";

const InfoModal = ({ visible, onClose, content }) => {
  return (
    <Modal isVisible={visible}>
      <View className="m-4 mx-6">
        <View className='w-full bg-stone-800 rounded-md p-4'>
          <Text className='text-white text-lg font-psemibold mb-2'>
            Promises
          </Text>

          <Text className='text-white text-base'>
            The promises you make here are non-negotiable. Check off a promise once per day.
          </Text>

        </View>
      </View>
    </Modal>
  )
}

export default InfoModal
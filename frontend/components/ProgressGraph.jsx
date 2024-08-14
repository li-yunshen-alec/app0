import { View, Text } from 'react-native'
import React from 'react'
import { Calendar } from 'react-native-calendars';

const ProgressGraph = () => {
  return (
    <View className='w-full px-2'>
      <Calendar
        theme={{
          backgroundColor: '#161622',
          calendarBackground: '#161622',
          textSectionTitleColor: '#b6c1cd',
          textSectionTitleDisabledColor: '#d9e1e8',
          selectedDayBackgroundColor: '#00adf5',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#00adf5',
          dayTextColor: '#d9e1e8',
          textDisabledColor: '#2d4150',
          dotColor: '#00adf5',
          selectedDotColor: '#ffffff',
          arrowColor: '#FF9C01',
          disabledArrowColor: '#d9e1e8',
          monthTextColor: '#FF9C01',
          indicatorColor: 'FF9C01',
          textDayFontFamily: 'monospace',
          textMonthFontFamily: 'monospace',
          textDayHeaderFontFamily: 'monospace',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16
        }}        
      />
    </View>
  )
}

export default ProgressGraph
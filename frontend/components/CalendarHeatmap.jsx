import React, { useEffect, useState } from 'react';
import { View, Dimensions } from 'react-native';
import { ContributionGraph } from 'react-native-chart-kit';
import { useSelector } from 'react-redux';

const CalendarHeatmap = () => {
  const [containerWidth, setContainerWidth] = useState(Dimensions.get("window").width);
  const userData = useSelector(state => state.userData);

  const onLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  useEffect(() => {
    console.log('userData', userData)
  }, [userData]);

  return (
    <View onLayout={onLayout} className='m-4'>
      <ContributionGraph
        values={userData?.commitsData || []}
        endDate={new Date()}
        numDays={90}
        width={containerWidth}
        height={220}
        chartConfig={{
          backgroundGradientFromOpacity: 0,
          backgroundGradientToOpacity: 0,
          labelColor: (opacity = 1) => `rgba(256,256,256, ${opacity})`,
          color: (opacity = 1) => `rgba(146, 146, 146, ${opacity})`,
          strokeWidth: 2, // optional, default 3
          barPercentage: 0.5,
          useShadowColorFromDataset: false // optional
        }}
      />
    </View>
  );
};

export default CalendarHeatmap;

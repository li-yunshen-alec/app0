import React, { useState } from 'react';
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

  return (
    <View onLayout={onLayout} className='m-4'>
      <ContributionGraph
        values={userData?.commitsData || []}
        endDate={new Date()}
        numDays={105}
        width={containerWidth}
        height={220}
        chartConfig={{
          backgroundGradientFrom: "#1E2923",
          backgroundGradientFromOpacity: 0,
          backgroundGradientTo: "#08130D",
          backgroundGradientToOpacity: 0.5,
          color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
          strokeWidth: 2, // optional, default 3
          barPercentage: 0.5,
          useShadowColorFromDataset: false // optional
        }}
      />
    </View>
  );
};

export default CalendarHeatmap;

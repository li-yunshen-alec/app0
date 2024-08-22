import { Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

const Pie = () => {
  const pieData = [
  {
    value: 1,
    color: '#009FFF',
    gradientCenterColor: '#006DFF',
  },
  {value: 1, color: '#93FCF8', gradientCenterColor: '#3BE9DE'},
  {value: 1, color: '#BDB2FA', gradientCenterColor: '#8F80F3'},
  {value: 1, color: '#FFA5BA', gradientCenterColor: '#FF7F97'},
];

const renderDot = color => {
  return (
    <View
      style={{
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: color,
        marginRight: 10,
      }}
    />
  );
};

const renderLegendComponent = () => {
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: 20,
          marginBottom: 10,
        }}
      >
        {renderDot('#006DFF')}
        <Text style={{color: 'white'}}>10-min walk after dinner: 1</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: 20,
          marginBottom: 10,
        }}
      >
        {renderDot('#8F80F3')}
        <Text style={{color: 'white'}}>Replace soda with water: 1</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: 20,
          marginBottom: 10,
        }}
      >
        {renderDot('#3BE9DE')}
        <Text style={{color: 'white'}}>Replace chips with fruits: 1</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: 20,
          marginBottom: 10,
        }}
      >
        {renderDot('#FF7F97')}
        <Text style={{color: 'white'}}>No more fast food: 1</Text>
      </View>
    </>
  );
};

return (
    <View
      style={{
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#292524',
        width: '100%'
      }}>
      <Text style={{color: 'white'}} className='font-psemibold'>
        Performance
      </Text>
      <View style={{padding: 20, alignItems: 'center'}}>
        <PieChart
          data={pieData}
          donut
          showGradient
          sectionAutoFocus
          radius={90}
          innerRadius={60}
          innerCircleColor={'#57534e'}
        />
      </View>
      {renderLegendComponent()}
    </View>
  );
}

export default Pie

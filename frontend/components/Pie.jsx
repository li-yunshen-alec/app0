import { Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

const Pie = () => {
  const pieData = [
  {
    value: 19,
    color: '#009FFF',
    gradientCenterColor: '#006DFF',
  },
  {value: 25, color: '#93FCF8', gradientCenterColor: '#3BE9DE'},
  {value: 25, color: '#BDB2FA', gradientCenterColor: '#8F80F3'},
  {value: 31, color: '#FFA5BA', gradientCenterColor: '#FF7F97', focused: true},
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
          justifyContent: 'center',
          marginBottom: 10,
          gap: 2
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: 120,
            marginRight: 20,
          }}>
          {renderDot('#006DFF')}
          <Text style={{color: 'white'}}>10-min walk after dinner: 3</Text>
        </View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', width: 120}}>
          {renderDot('#8F80F3')}
          <Text style={{color: 'white'}}>Replace soda with water: 4</Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'center', gap: 2}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: 120,
            marginRight: 20,
          }}>
          {renderDot('#3BE9DE')}
          <Text style={{color: 'white'}}>Replace chips with fruits: 4</Text>
        </View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', width: 120}}>
          {renderDot('#FF7F97')}
          <Text style={{color: 'white'}}>No more fast food: 5</Text>
        </View>
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
          centerLabelComponent={() => {
            return (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text
                  style={{fontSize: 22, color: 'white', fontWeight: 'bold'}}>
                  31%
                </Text>
                <Text style={{fontSize: 14, color: 'white', maxWidth: 75 }}>No more fast food</Text>
              </View>
            );
          }}
        />
      </View>
      {renderLegendComponent()}
    </View>
  );
}

export default Pie

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Building, Home, Menu, User } from 'lucide-react-native';
import MenuScreen from './MenuScreen';
import HomeScreen from './HomeScreen';
import ErpScreen from './ErpScreen';
import UserScreen from './UserScreen';

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ color, size }) => {
          if (route.name === '메뉴') return <Menu color={color} size={size} />;
          if (route.name === '홈') return <Home color={color} size={size} />;
          if (route.name === 'ERP')
            return <Building color={color} size={size} />;
          if (route.name === '유저') return <User color={color} size={size} />;
          return null;
        },
      })}
    >
      <Tab.Screen name="메뉴" component={MenuScreen} />
      <Tab.Screen name="홈" component={HomeScreen} />
      <Tab.Screen name="ERP" component={ErpScreen} />
      <Tab.Screen name="유저" component={UserScreen} />
    </Tab.Navigator>
  );
}

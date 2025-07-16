import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-gesture-handler';

import LoginScreen from './src/screens/auth/LoginScreen';
import MainScreen from './src/screens/main/MainScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
            gestureEnabled: false, // 스와이프 뒤로가기 비활성화
          }}
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="Main"
            component={MainScreen}
            options={{
              gestureEnabled: false,
              headerLeft: () => null, // 헤더 뒤로가기 버튼 제거
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;

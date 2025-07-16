import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-gesture-handler';

import LoginScreen from './src/screens/auth/LoginScreen';
import MainNavigator from './src/screens/main/MainNavigator';
import { authStorage } from './src/services/storage/authStorage';

const Stack = createStackNavigator();

function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await authStorage.getAccessToken();
      setAccessToken(token);
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {accessToken ? (
            <Stack.Screen name="MainTabs">
              {() => <MainNavigator />}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="Login">
              {props => (
                <LoginScreen
                  {...props}
                  onLoginSuccess={token => setAccessToken(token)}
                />
              )}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;

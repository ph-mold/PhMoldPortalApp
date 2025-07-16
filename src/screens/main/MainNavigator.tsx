import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { authStorage } from '../../services/storage/authStorage';
import WebViewScreen from './WebViewScreen';
import { Building, Home, Menu, User } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

const WEB_URLS = {
  menu: 'http://portal.phmold.co.kr/',
  home: 'http://portal.phmold.co.kr/',
  erp: 'http://portal.phmold.co.kr/#/erp',
  user: 'http://portal.phmold.co.kr/#/user',
};

export default function MainNavigator() {
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
      <Tab.Screen
        name="메뉴"
        children={() => (
          <WebViewScreen url={WEB_URLS.menu} accessToken={accessToken} />
        )}
      />
      <Tab.Screen
        name="홈"
        children={() => (
          <WebViewScreen url={WEB_URLS.home} accessToken={accessToken} />
        )}
      />
      <Tab.Screen
        name="ERP"
        children={() => (
          <WebViewScreen url={WEB_URLS.erp} accessToken={accessToken} />
        )}
      />
      <Tab.Screen
        name="유저"
        children={() => (
          <WebViewScreen url={WEB_URLS.user} accessToken={accessToken} />
        )}
      />
    </Tab.Navigator>
  );
}

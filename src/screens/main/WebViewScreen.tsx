import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import CookieManager from '@react-native-cookies/cookies';
import Config from 'react-native-config';

const WEBVIEW_URL = Config.WEBVIEW_URL || 'phmold.co.kr';
const DOMAIN_URL = Config.DOMAIN_URL || 'phmold.co.kr';
interface WebViewScreenProps {
  url: string;
}

const WebViewScreen: React.FC<WebViewScreenProps> = ({ url }) => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    CookieManager.set(WEBVIEW_URL, {
      name: 'platform',
      value: 'app',
      domain: DOMAIN_URL,
      path: '/',
      version: '1',
      expires: '2050-12-31T23:59:59.00+00:00',
    });
  }, []);

  const handleLoadEnd = () => {
    console.log('웹뷰 로딩 완료');
    setIsLoading(false);
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.warn('WebView error:', nativeEvent);

    // 401 에러나 인증 관련 에러인 경우 로그인 화면으로 이동
    if (nativeEvent.url && nativeEvent.url.includes('login')) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' as never }],
      });
    }
  };

  const handleMessage = (event: any) => {
    console.log('WebView 메시지:', event.nativeEvent.data);
  };

  return (
    <>
      <WebView
        source={{ uri: url }}
        style={{ flex: 1 }}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        onMessage={handleMessage}
        onHttpError={syntheticEvent => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView HTTP error:', nativeEvent);

          // 401 에러인 경우 로그인 화면으로 이동
          if (nativeEvent.statusCode === 401) {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' as never }],
            });
          }
        }}
      />
      {isLoading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.5)',
          }}
        >
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}
    </>
  );
};

export default WebViewScreen;

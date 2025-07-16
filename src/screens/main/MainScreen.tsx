import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { authStorage } from '../../services/storage/authStorage';
import { getAuthBridgeScript } from '../../services/webview/authBridge';

const MainScreen = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [_refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [_webViewLoaded, setWebViewLoaded] = useState(false);
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    loadTokens();
  }, []);

  const loadTokens = async () => {
    try {
      const [access, refresh] = await Promise.all([
        authStorage.getAccessToken(),
        authStorage.getRefreshToken(),
      ]);
      console.log('토큰 로드 완료:', {
        hasAccessToken: !!access,
        hasRefreshToken: !!refresh,
      });
      setAccessToken(access);
      setRefreshToken(refresh);
    } catch (error) {
      console.error('토큰 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // authBridge 스크립트 사용
  const injectedJavaScript = accessToken
    ? getAuthBridgeScript(accessToken)
    : '';

  // 웹뷰 로딩 완료 후 추가 JavaScript 실행
  const onLoadEnd = () => {
    console.log('웹뷰 로딩 완료');
    setWebViewLoaded(true);

    // 추가로 토큰이 있는지 확인하고 주입
    if (accessToken && webViewRef.current) {
      const additionalScript = `
        (function() {
          const token = '${accessToken}';
          if (token && !localStorage.getItem('accessToken')) {
            localStorage.setItem('accessToken', token);
            console.log('추가 토큰 주입 완료');
          }
        })();
      `;
      webViewRef.current.injectJavaScript(additionalScript);
    }
  };

  // 액세스 토큰을 URL 파라미터로 전달
  const webViewUrl = accessToken
    ? `http://portal.phmold.co.kr?token=${accessToken}`
    : 'http://portal.phmold.co.kr';

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>토큰 로딩 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: webViewUrl }}
        style={styles.webview}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        injectedJavaScript={injectedJavaScript}
        onLoadEnd={onLoadEnd}
        onMessage={event => {
          console.log('웹뷰 메시지:', event.nativeEvent.data);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainScreen;

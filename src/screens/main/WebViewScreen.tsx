import React, { useEffect, useRef, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { getAuthBridgeScript } from '../../services/webview/authBridge';

interface WebViewScreenProps {
  url: string;
  accessToken: string | null;
}

const WebViewScreen: React.FC<WebViewScreenProps> = ({ url, accessToken }) => {
  const navigation = useNavigation();
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' as never }],
      });
    }
  }, [accessToken, navigation]);

  if (!accessToken) {
    return null;
  }

  const injectedJavaScript = getAuthBridgeScript(accessToken);

  return (
    <>
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        style={{ flex: 1 }}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        injectedJavaScript={injectedJavaScript}
        onLoadEnd={() => setIsLoading(false)}
        onMessage={() => {
          // 필요시 메시지 처리
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

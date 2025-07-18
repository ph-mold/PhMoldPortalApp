import Config from 'react-native-config';
import React from 'react';
import WebViewScreen from './WebViewScreen';

export default function HomeScreen() {
  return <WebViewScreen url={`${Config.WEBVIEW_URL}/`} />;
}

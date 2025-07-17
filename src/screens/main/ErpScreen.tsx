import Config from 'react-native-config';
import React from 'react';
import WebViewScreen from './WebViewScreen';

export default function ErpScreen() {
  return <WebViewScreen url={`${Config.WEBVIEW_URL}/erp`} />;
}

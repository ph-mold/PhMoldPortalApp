/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { SafeAreaView, View } from 'react-native';
import { WebView } from 'react-native-webview';

function App() {
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <WebView
          source={{ uri: 'http://portal.phmold.co.kr' }}
          style={{ flex: 1 }}
          sharedCookiesEnabled={true}
          thirdPartyCookiesEnabled={true}
        />
      </SafeAreaView>
    </View>
  );
}

export default App;

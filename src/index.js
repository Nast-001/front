import { AppRegistry } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './App';
import { name as appName } from './app.json';

const App = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <AppNavigator />
  </GestureHandlerRootView>
);

AppRegistry.registerComponent(appName, () => App); 
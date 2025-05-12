import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { LogBox, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MainTabNavigator from './main/navigation/MainTabNavigator';
import AchievementsScreen from './main/screens/AchievementsScreen';
import CreateWorkoutScreen from './main/screens/CreateWorkoutScreen';
import CustomWorkoutDetailsScreen from './main/screens/CustomWorkoutDetailsScreen';
import EditProfileScreen from './main/screens/EditProfileScreen';
import FavoriteLessonsScreen from './main/screens/FavoriteLessonsScreen';
import LastLesson from './main/screens/LastLesson';
import NewsDetailScreen from './main/screens/NewsDetailScreen.tsx';
import NewsScreen from './main/screens/NewsScreen.tsx';
import ProfileScreen from './main/screens/ProfileScreen';
import SettingsScreen from './main/screens/SettingsScreen';
import WorkoutDetailsScreen from './main/screens/WorkoutDetailsScreen';
import BodyAreasScreen from './registration/body.tsx';
import BreathScreen from './registration/breath.tsx';
import EnduranceScreen from './registration/endurance.tsx';
import FlexibilityScreen from './registration/flexibility.tsx';
import GoalsScreen from './registration/goal.tsx';
import HelloScreen from './registration/hello.tsx';
import InfoScreen from './registration/info.tsx';
import LoadingScreen from './registration/loading.tsx';
import MotivationScreen from './registration/motivation.tsx';
import { RootStackParamList } from './registration/navigationTypes';
import NotificationPage from './registration/noitfication.tsx';
import GoalFormationScreen from './registration/program.tsx';
import RegistPage from './registration/reg.tsx';
import RestrictionsScreen from './registration/restrictions.tsx';
import SkillScreen from './registration/skill.tsx';
import TimeScreen from './registration/time.tsx';

// Игнорируем предупреждения о react-native-video
LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
]);

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator<RootStackParamList>();

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const AppNavigator = () => {
  const [fontsLoaded] = useFonts({
    'Lora': require('./assets/fonts/Lora.ttf'),
    'Lora-Italic': require('./assets/fonts/Lora-Italic.ttf'),
  });

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Hello"
              screenOptions={{ 
                headerShown: false,
                gestureEnabled: true,
                animationEnabled: true,
                cardStyle: { backgroundColor: '#FFFFFF' }
              }}
            >
              <Stack.Screen name="Hello" component={HelloScreen} />
              <Stack.Screen name="Reg" component={RegistPage} />
              <Stack.Screen name="Regist" component={RegistPage} />
              <Stack.Screen name="Info" component={InfoScreen} />
              <Stack.Screen name="Time" component={TimeScreen} />
              <Stack.Screen name="GoalsScreen" component={GoalsScreen} />
              <Stack.Screen name="BodyAreas" component={BodyAreasScreen} />
              <Stack.Screen name="Motivation" component={MotivationScreen} />
              <Stack.Screen name="Loading" component={LoadingScreen} />
              <Stack.Screen name="GoalFormation" component={GoalFormationScreen} />
              <Stack.Screen name="Skill" component={SkillScreen} />
              <Stack.Screen name="Flexibility" component={FlexibilityScreen} />
              <Stack.Screen name="Endurance" component={EnduranceScreen} />
              <Stack.Screen name="Breath" component={BreathScreen} />
              <Stack.Screen name="Restrictions" component={RestrictionsScreen} />
              <Stack.Screen name="Notification" component={NotificationPage} />
              <Stack.Screen name="MainTab" component={MainTabNavigator} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="EditProfile" component={EditProfileScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
              <Stack.Screen name="LastLesson" component={LastLesson} />
              <Stack.Screen name="Achievements" component={AchievementsScreen} />
              <Stack.Screen name="CreateWorkout" component={CreateWorkoutScreen} />
              <Stack.Screen name="WorkoutDetails" component={WorkoutDetailsScreen} />
              <Stack.Screen name="CustomWorkoutDetails" component={CustomWorkoutDetailsScreen} />
              <Stack.Screen name="NewsDetail" component={NewsDetailScreen} />
              <Stack.Screen name="NewsScreen" component={NewsScreen} />
              <Stack.Screen 
                name="FavoriteLessonsScreen" 
                component={FavoriteLessonsScreen}
                options={{
                  headerShown: false
                }}
              />
            </Stack.Navigator>
            <StatusBar style="auto" />
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default AppNavigator;
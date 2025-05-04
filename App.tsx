import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import MainTabNavigator from './main/navigation/MainTabNavigator';
import BodyAreasScreen from './registration/body';
import BreathScreen from './registration/breath';
import EnduranceScreen from './registration/endurance';
import FlexibilityScreen from './registration/flexibility';
import GoalsScreen from './registration/goal';
import HelloScreen from './registration/hello';
import InfoScreen from './registration/info';
import LoadingScreen from './registration/loading';
import MotivationScreen from './registration/motivation';
import { RootStackParamList } from './registration/navigationTypes';
import NotificationPage from './registration/noitfication';
import GoalFormationScreen from './registration/program';
import RegistPage from './registration/reg';
import RestrictionsScreen from './registration/restrictions';
import SkillScreen from './registration/skill';
import TimeScreen from './registration/time';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Hello"
          screenOptions={{ 
            headerShown: false,
            gestureEnabled: false // Отключаем свайп-назад
          }}
        >
          <Stack.Screen name="Hello" component={HelloScreen} />
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen name="Reg" component={RegistPage} />
          <Stack.Screen name="GoalsScreen" component={GoalsScreen} />
          <Stack.Screen name="BodyAreas" component={BodyAreasScreen} />
          <Stack.Screen name="Motivation" component={MotivationScreen} />
          <Stack.Screen name="Loading" component={LoadingScreen} />
          <Stack.Screen name="Skill" component={SkillScreen} />
          <Stack.Screen name="Flexibility" component={FlexibilityScreen} />
          <Stack.Screen name="Endurance" component={EnduranceScreen} />
          <Stack.Screen name="Breath" component={BreathScreen} />
          <Stack.Screen name="Restrictions" component={RestrictionsScreen} />
          <Stack.Screen name="Info" component={InfoScreen} />
          <Stack.Screen name="Time" component={TimeScreen} />
          <Stack.Screen name="GoalFormation" component={GoalFormationScreen} />
          <Stack.Screen name="Notification" component={NotificationPage} />
          {/* цель,skill,flexibility,endurance,breath,restrictions,info*/}

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default AppNavigator;
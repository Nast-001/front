import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RegistPage from './registration/reg';
import GoalsScreen from './registration/goal';
import BodyAreasScreen from './registration/body';
import MotivationScreen from './registration/motivation';
import LoadingScreen from './registration/loading';
import SkillScreen from './registration/skill';
import FlexibilityScreen from './registration/flexibility';
import EnduranceScreen from './registration/endurance';
import BreathScreen from './registration/breath';
import RestrictionsScreen from './registration/restrictions';
import InfoScreen from './registration/info';
import { RootStackParamList } from './registration/navigationTypes';
import TimeScreen from './registration/time';
import GoalFormationScreen from './registration/program';
import NotificationPage from './registration/noitfication';
const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Regist"
          screenOptions={{ 
            headerShown: false,
            gestureEnabled: false // Отключаем свайп-назад
          }}
        >
          <Stack.Screen name="Regist" component={RegistPage} />
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
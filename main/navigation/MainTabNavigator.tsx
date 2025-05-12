import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MainTabParamList } from '../navigationTypes';
import CategoryScreen from '../screens/CategoryScreen';
import HomeScreen from '../screens/HomeScreen';
import LessonScreen from '../screens/LessonScreen';
import NewsDetailScreen from '../screens/NewsDetailScreen';
import NewsScreen from '../screens/NewsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CreateWorkoutScreen from '../screens/CreateWorkoutScreen';

import HomeIcon from '../../assets/home.svg';
import NewspaperIcon from '../../assets/newspaper.svg';
import AccountIcon from '../../assets/account.svg';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#F7F7F7',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarItemStyle: {
          padding: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#666666',
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTitleStyle: {
          color: '#333333',
          fontSize: 20,
          fontWeight: '600',
        },
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <HomeIcon width={28} height={28} fill={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="NewsScreen"
        component={NewsScreen}
        options={{
          title: 'Новости',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <NewspaperIcon width={28} height={28} fill={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Профиль',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <AccountIcon width={28} height={28} fill={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="CategoryScreen"
        component={CategoryScreen}
        options={{
          title: 'Категория',
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="LessonScreen"
        component={LessonScreen}
        options={{
          title: 'Урок',
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="NewsDetail"
        component={NewsDetailScreen}
        options={{
          title: 'Новость',
          tabBarButton: () => null,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: '#F7F7F7',
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainTabNavigator; 
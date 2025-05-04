import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MainTabParamList } from '../navigationTypes';
import CategoryScreen from '../screens/CategoryScreen';
import CreateWorkoutScreen from '../screens/CreateWorkoutScreen';
import HomeScreen from '../screens/HomeScreen';
import LessonScreen from '../screens/LessonScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarItemStyle: {
          padding: 4,
          marginRight: -70,
        },
        tabBarLabelStyle: {
          marginRight: -15,
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
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Главная',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="home" size={28} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="CreateWorkout"
        component={CreateWorkoutScreen}
        options={{
          title: 'Создать',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="plus-circle-outline" size={28} color={color} />
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
              <MaterialCommunityIcons name="account" size={28} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="CategoryScreen"
        component={CategoryScreen}
        options={{
          title: 'Категория',
          tabBarButton: () => null, // Скрываем вкладку из таб-бара
        }}
      />
      <Tab.Screen
        name="LessonScreen"
        component={LessonScreen}
        options={{
          title: 'Урок',
          tabBarButton: () => null, // Скрываем вкладку из таб-бара
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainTabNavigator; 
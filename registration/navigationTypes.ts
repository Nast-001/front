import { NavigatorScreenParams } from '@react-navigation/native';
import { MainTabParamList } from '../main/navigationTypes';

export type RootStackParamList = {
  Hello: undefined;
  MainTab: NavigatorScreenParams<MainTabParamList>;
  Reg: {
    formData?: {
      email: string;
      password: string;
      password2: string;
    };
  };
  Regist: {
    formData?: {
      email: string;
      password: string;
      password2: string;
    };
    gender?: 'M' | 'F' | 'N' | 'prefer_not_to_say';
  };
  Info: {
    formData?: {
      email: string;
      password: string;
      password2: string;
    };
    gender?: 'M' | 'F' | 'N' | 'prefer_not_to_say';
    name?: string;
    age?: string;
    height?: string;
    weight?: string;
  };
  Time: {
    formData?: {
      email: string;
      password: string;
      password2: string;
    };
    gender?: 'M' | 'F' | 'N' | 'prefer_not_to_say';
    name?: string;
    age?: string;
    height?: string;
    weight?: string;
    workout_duration?: 'short' | 'medium' | 'long';
  };
  GoalsScreen: {
    formData?: {
      email: string;
      password: string;
      password2: string;
    };
    gender?: 'M' | 'F' | 'N' | 'prefer_not_to_say';
  };
  BodyAreas: { 
    selectedGoals: string[];
    formData?: {
      email: string;
      password: string;
      password2: string;
    };
    gender?: 'M' | 'F' | 'N' | 'prefer_not_to_say';
  };
  Motivation: { 
    selectedGoals: string[];
    formData?: {
      email: string;
      password: string;
      password2: string;
    };
    gender?: 'M' | 'F' | 'N' | 'prefer_not_to_say';
    body_parts?: string[];
  };
  Loading: { 
    selectedGoals: string[];
    selectedMotivations: string[];
    formData?: {
      email: string;
      password: string;
      password2: string;
    };
    gender?: 'M' | 'F' | 'N' | 'prefer_not_to_say';
    body_parts?: string[];
  };
  GoalFormation: {
    formData?: {
      email: string;
      password: string;
      password2: string;
    };
    gender?: 'M' | 'F' | 'N' | 'prefer_not_to_say';
    name?: string;
    age?: string;
    height?: string;
    weight?: string;
    workout_duration?: 'short' | 'medium' | 'long';
  };
  Skill: {
    formData?: {
      email: string;
      password: string;
      password2: string;
    };
    gender?: 'M' | 'F' | 'N' | 'prefer_not_to_say';
    name?: string;
    age?: string;
    height?: string;
    weight?: string;
    workout_duration?: 'short' | 'medium' | 'long';
  };
  Flexibility: {
    formData?: {
      email: string;
      password: string;
      password2: string;
    };
    gender?: 'M' | 'F' | 'N' | 'prefer_not_to_say';
    name?: string;
    age?: string;
    height?: string;
    weight?: string;
    workout_duration?: 'short' | 'medium' | 'long';
  };
  Endurance: {
    formData?: {
      email: string;
      password: string;
      password2: string;
    };
    gender?: 'M' | 'F' | 'N' | 'prefer_not_to_say';
    name?: string;
    age?: string;
    height?: string;
    weight?: string;
    workout_duration?: 'short' | 'medium' | 'long';
  };
  Breath: {
    formData?: {
      email: string;
      password: string;
      password2: string;
    };
    gender?: 'M' | 'F' | 'N' | 'prefer_not_to_say';
    name?: string;
    age?: string;
    height?: string;
    weight?: string;
    workout_duration?: 'short' | 'medium' | 'long';
  };
  Restrictions: {
    formData?: {
      email: string;
      password: string;
      password2: string;
    };
    gender?: 'M' | 'F' | 'N' | 'prefer_not_to_say';
    name?: string;
    age?: string;
    height?: string;
    weight?: string;
    workout_duration?: 'short' | 'medium' | 'long';
  };
  Notification: {
    formData?: {
      email: string;
      password: string;
      password2: string;
    };
    gender?: 'M' | 'F' | 'N' | 'prefer_not_to_say';
    name?: string;
    age?: string;
    height?: string;
    weight?: string;
    workout_duration?: 'short' | 'medium' | 'long';
  };
  Profile: undefined;
  EditProfile: undefined;
  Settings: undefined;
  LastLesson: undefined;
  Achievements: { date: string };
  CreateWorkout: undefined;
  WorkoutDetails: { workoutId: string };
  CustomWorkoutDetails: { workoutId: string };
  NewsDetail: { newsId: number };
  NewsScreen: undefined;
  FavoriteLessonsScreen: undefined;
};
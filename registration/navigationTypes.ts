import { NavigatorScreenParams } from '@react-navigation/native';
import { MainTabParamList } from '../main/navigationTypes';

export type RootStackParamList = {
  Hello: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
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
    experience?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'pro';
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
    experience?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'pro';
    flexibility?: 'very_poor' | 'poor' | 'average' | 'good' | 'excellent';
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
    experience?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'pro';
    flexibility?: 'very_poor' | 'poor' | 'average' | 'good' | 'excellent';
    plank_time?: 'less_30' | '30_60' | '1_2' | '2_5' | 'DK';
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
    experience?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'pro';
    flexibility?: 'very_poor' | 'poor' | 'average' | 'good' | 'excellent';
    plank_time?: 'less_30' | '30_60' | '1_2' | '2_5' | 'DK';
    breathing?: 'good' | 'middle' | 'bad';
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
    experience?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'pro';
    flexibility?: 'very_poor' | 'poor' | 'average' | 'good' | 'excellent';
    plank_time?: 'less_30' | '30_60' | '1_2' | '2_5' | 'DK';
    breathing?: 'good' | 'middle' | 'bad';
    limitations?: string[];
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
    experience?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'pro';
    flexibility?: 'very_poor' | 'poor' | 'average' | 'good' | 'excellent';
    plank_time?: 'less_30' | '30_60' | '1_2' | '2_5' | 'DK';
    breathing?: 'good' | 'middle' | 'bad';
    limitations?: string[];
    goals?: string[];
    body_parts?: string[];
    motivations?: string[];
  };
};
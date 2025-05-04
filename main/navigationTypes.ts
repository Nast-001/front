import { NavigatorScreenParams } from '@react-navigation/native';

type Lesson = {
  id: string;
  title: string;
  description: string;
  duration: string;
  duration_minutes: number;
  calories: number;
  video_file: string;
  preview_image: string;
};

export type MainTabParamList = {
  Home: undefined;
  CategoryScreen: {
    categoryId: string;
    categoryTitle: string;
    lessons: Lesson[];
  };
  LessonScreen: {
    lesson: Lesson;
  };
  Profile: undefined;
  CreateWorkout: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  // Здесь можно добавить другие экраны, которые не входят в tab navigation
}; 
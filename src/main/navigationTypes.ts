import { Lesson } from './types';

export type MainTabParamList = {
  Home: undefined;
  CategoryScreen: {
    categoryId: string;
    categoryTitle: string;
    lessons: Lesson[];
  };
  LessonScreen: {
    lesson: Lesson;
    fromHistory?: boolean;
    returnScreen?: string;
  };
  Profile: undefined;
  CreateWorkout: undefined;
  NewsDetail: {
    newsId: number;
  };
  NewsScreen: undefined;
  LastLesson: undefined;
};

export type RootStackParamList = {
  Home: undefined;
  Workouts: undefined;
  Profile: undefined;
  LessonScreen: { lesson: Lesson; fromHistory?: boolean };
  LastLesson: undefined;
  NewsDetail: { newsId: number };
  NewsScreen: undefined;
  FavoriteLessonsScreen: undefined;
  WorkoutDetails: { workoutId: string };
  CustomWorkoutDetails: { workoutId: string };
}; 
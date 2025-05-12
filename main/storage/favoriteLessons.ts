import AsyncStorage from '@react-native-async-storage/async-storage';
import { Lesson } from '../types';

const FAVORITE_LESSONS_KEY = '@favorite_lessons';

export const saveFavoriteLesson = async (lesson: Lesson) => {
  try {
    const existingFavorites = await getFavoriteLessons();
    const updatedFavorites = [...existingFavorites, lesson];
    await AsyncStorage.setItem(FAVORITE_LESSONS_KEY, JSON.stringify(updatedFavorites));
    return true;
  } catch (error) {
    console.error('Error saving favorite lesson:', error);
    return false;
  }
};

export const removeFavoriteLesson = async (lessonId: string) => {
  try {
    const existingFavorites = await getFavoriteLessons();
    const updatedFavorites = existingFavorites.filter(lesson => lesson.id !== lessonId);
    await AsyncStorage.setItem(FAVORITE_LESSONS_KEY, JSON.stringify(updatedFavorites));
    return true;
  } catch (error) {
    console.error('Error removing favorite lesson:', error);
    return false;
  }
};

export const getFavoriteLessons = async (): Promise<Lesson[]> => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITE_LESSONS_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error getting favorite lessons:', error);
    return [];
  }
};

export const isLessonFavorite = async (lessonId: string): Promise<boolean> => {
  try {
    const favorites = await getFavoriteLessons();
    return favorites.some(lesson => lesson.id === lessonId);
  } catch (error) {
    console.error('Error checking if lesson is favorite:', error);
    return false;
  }
};

export const clearFavoriteLessons = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(FAVORITE_LESSONS_KEY);
    console.log('Favorite lessons cleared successfully');
  } catch (error) {
    console.error('Error clearing favorite lessons:', error);
    throw error;
  }
}; 
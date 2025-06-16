import AsyncStorage from '@react-native-async-storage/async-storage';
import { Lesson } from '../types';

const STORAGE_KEY = 'lessonHistory';

export interface SavedLesson {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  calories: number;
  completedAt: string;
  preview_image: string;
  video_file: string;
}

export const saveLessonToHistory = async (lesson: Lesson): Promise<void> => {
  try {
    console.log('Saving lesson to history:', lesson);

    const historyJson = await AsyncStorage.getItem(STORAGE_KEY);
    console.log('Current history from storage:', historyJson);

    let history: SavedLesson[] = [];
    if (historyJson) {
      try {
        history = JSON.parse(historyJson);
        console.log('Parsed history:', history);
      } catch (parseError) {
        console.error('Error parsing history:', parseError);
        history = [];
      }
    }

    const newLesson: SavedLesson = {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      duration_minutes: lesson.duration_minutes,
      calories: lesson.calories,
      completedAt: new Date().toISOString(),
      preview_image: lesson.preview_image,
      video_file: lesson.video_file,
    };
    console.log('New lesson to save:', newLesson);

    const newHistory = [newLesson, ...history];
    console.log('New history to save:', newHistory);

    const newHistoryJson = JSON.stringify(newHistory);
    await AsyncStorage.setItem(STORAGE_KEY, newHistoryJson);

    const verifyJson = await AsyncStorage.getItem(STORAGE_KEY);
    const verifyHistory = verifyJson ? JSON.parse(verifyJson) : [];
    console.log('Verified history after save:', verifyHistory);

    if (verifyHistory.length !== newHistory.length) {
      throw new Error('History verification failed: saved length does not match');
    }

    console.log('Lesson saved and verified successfully');
  } catch (error) {
    console.error('Error saving lesson to history:', error);
    throw error;
  }
};

export const getLessonHistory = async (): Promise<SavedLesson[]> => {
  try {
    const historyJson = await AsyncStorage.getItem(STORAGE_KEY);
    console.log('Getting history from storage:', historyJson);
    if (!historyJson) {
      console.log('No history found in storage');
      return [];
    }
    const history = JSON.parse(historyJson);
    console.log('Parsed history:', history);
    return history;
  } catch (error) {
    console.error('Error getting lesson history:', error);
    return [];
  }
};

export const clearLessonHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log('History cleared successfully');
  } catch (error) {
    console.error('Error clearing lesson history:', error);
    throw error;
  }
};
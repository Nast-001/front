import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://192.168.1.100:8000/api/register/'; // Измените на ваш URL API

// Интерфейсы для типизации данных
interface UserData {
  email: string;
  name: string;
  password: string;
  password2: string; 
  height?: number;
  weight?: number;
  age?: number;
  gender?: 'M' | 'F' | 'N' | 'prefer_not_to_say';
  experience?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'pro';
  flexibility?: 'very_poor' | 'poor' | 'average' | 'good' | 'excellent';
  plank_time?: 'less_30' | '30_60' | '1_2' | '2_5' | 'DK';
  breathing?: 'good' | 'middle' | 'bad';
  workout_duration?: 'short' | 'medium' | 'long';
  goals?: string[];
  body_parts?: string[];
  motivations?: string[];
  limitations?: string[];
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: UserData;
}

// Функция для входа пользователя
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/login/`, {
      email,
      password,
    });
    
    if (response.data.token) {
      await AsyncStorage.setItem('userToken', response.data.token);
      await saveUserData(response.data.user);
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Функция для регистрации пользователя
export const register = async (userData: UserData): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/register/`, userData);
    
    if (response.data.token) {
      await AsyncStorage.setItem('userToken', response.data.token);
      await saveUserData(response.data.user);
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Функция для сохранения данных пользователя
export const saveUserData = async (userData: UserData): Promise<boolean> => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Ошибка при сохранении данных пользователя:', error);
    return false;
  }
};

// Функция для получения данных пользователя
export const getUserData = async (): Promise<UserData | null> => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error);
    return null;
  }
};

// Функция для выхода пользователя
export const logout = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    return true;
  } catch (error) {
    console.error('Ошибка при выходе пользователя:', error);
    return false;
  }
};

// Функция для проверки авторизации
export const checkAuth = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return !!token;
  } catch (error) {
    console.error('Ошибка при проверке авторизации:', error);
    return false;
  }
};

// Функция для получения токена
export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('userToken');
  } catch (error) {
    console.error('Ошибка при получении токена:', error);
    return null;
  }
};
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const API_URL = 'http://192.168.0.176:8000/api'; // Измените на ваш URL API

// Типы для Django полей
type EmailField = string;
type CharField = string;

// Интерфейсы для типизации данных
interface UserData {
  email: EmailField;
  name?: CharField;
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
  email: EmailField;
  password: string;
}

interface AuthResponse {
  token: string;
  user: UserData;
}

// Функция для входа пользователя
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/login/`, {
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
    // Убедимся, что обязательные поля присутствуют
    const requiredFields = {
      email: userData.email,
      password: userData.password,
      password2: userData.password2,
      name: userData.email.split('@')[0] // Используем часть email как имя по умолчанию
    };

    // Проверим наличие обязательных полей
    if (!requiredFields.email || !requiredFields.password || !requiredFields.password2) {
      throw new Error('Отсутствуют обязательные поля');
    }

    // Отправляем необходимые поля на сервер
    const response = await axios.post<AuthResponse>(`${API_URL}/register/`, {
      email: userData.email,
      password: userData.password,
      password2: userData.password2,
      name: requiredFields.name
    });
    
    if (response.data.token) {
      await AsyncStorage.setItem('userToken', response.data.token);
      await saveUserData(response.data.user);
    }
    
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Функция для сохранения данных пользователя
export const saveUserData = async (userData: UserData): Promise<boolean> => {
  try {
    // Получаем существующие данные
    const existingDataStr = await AsyncStorage.getItem('userData');
    const existingData = existingDataStr ? JSON.parse(existingDataStr) : {};

    // Объединяем существующие данные с новыми
    const mergedData = {
      ...existingData,
      ...userData
    };

    console.log('Сохраняем объединенные данные:', {
      email: mergedData.email,
      name: mergedData.name,
      hasPassword: !!mergedData.password,
      hasPassword2: !!mergedData.password2
    });

    // Проверяем обязательные поля
    if (!mergedData.email || !mergedData.password || !mergedData.password2) {
      console.error('Попытка сохранить неполные данные:', {
        email: mergedData.email ? 'присутствует' : 'отсутствует',
        password: mergedData.password ? 'присутствует' : 'отсутствует',
        password2: mergedData.password2 ? 'присутствует' : 'отсутствует'
      });
      return false;
    }

    const jsonValue = JSON.stringify(mergedData);
    await AsyncStorage.setItem('userData', jsonValue);
    
    // Проверяем, что данные действительно сохранились
    const savedData = await AsyncStorage.getItem('userData');
    if (!savedData) {
      console.error('Данные не сохранились в AsyncStorage');
      return false;
    }

    const parsedData = JSON.parse(savedData);
    console.log('Данные успешно сохранены:', {
      email: parsedData.email,
      name: parsedData.name,
      hasPassword: !!parsedData.password,
      hasPassword2: !!parsedData.password2
    });

    return true;
  } catch (error) {
    console.error('Ошибка при сохранении данных пользователя:', error);
    return false;
  }
};

// Функция для получения данных пользователя
export const getUserData = async (): Promise<UserData | null> => {
  try {
    // Сначала пробуем получить данные из authData
    const authData = await AsyncStorage.getItem('authData');
    if (authData) {
      const parsedAuthData = JSON.parse(authData);
      console.log('Получены данные авторизации:', {
        email: parsedAuthData.email,
        hasPassword: !!parsedAuthData.password,
        hasPassword2: !!parsedAuthData.password2
      });
      return parsedAuthData;
    }

    // Если нет authData, пробуем получить из userData
    const userData = await AsyncStorage.getItem('userData');
    if (!userData) {
      console.error('Данные пользователя не найдены в AsyncStorage');
      return null;
    }

    const parsedData = JSON.parse(userData);
    console.log('Получены данные пользователя:', {
      email: parsedData.email,
      name: parsedData.name,
      hasPassword: !!parsedData.password,
      hasPassword2: !!parsedData.password2,
      gender: parsedData.gender,
      age: parsedData.age
    });

    return parsedData;
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

// Функция для отправки данных регистрации на бэкенд
export const sendRegistrationData = async (): Promise<AuthResponse> => {
  try {
    // Получаем данные из обоих источников
    const [authDataStr, userDataStr] = await Promise.all([
      AsyncStorage.getItem('authData'),
      AsyncStorage.getItem('userData')
    ]);

    const authData = authDataStr ? JSON.parse(authDataStr) : {};
    const userData = userDataStr ? JSON.parse(userDataStr) : {};

    // Объединяем данные, приоритет отдаем authData для email и паролей
    const registrationData: UserData = {
      ...userData,  // Сначала берем все данные пользователя
      ...authData,  // Затем перезаписываем email и пароли из authData
      name: userData.name || authData.email?.split('@')[0] // Используем имя из userData или часть email
    };

    console.log('Подготовленные данные для регистрации:', {
      email: registrationData.email,
      name: registrationData.name,
      hasPassword: !!registrationData.password,
      hasPassword2: !!registrationData.password2,
      age: registrationData.age,
      height: registrationData.height,
      weight: registrationData.weight
    });

    // Проверяем наличие обязательных полей
    if (!registrationData.email || !registrationData.password || !registrationData.password2) {
      throw new Error('Отсутствуют обязательные поля для регистрации');
    }

    // Отправляем данные на сервер
    const response = await axios.post<AuthResponse>(`${API_URL}/register/`, registrationData);
    
    if (response.data.token) {
      await AsyncStorage.setItem('userToken', response.data.token);
      await saveUserData(response.data.user);
    }
    
    return response.data;
  } catch (error) {
    console.error('Ошибка при отправке данных регистрации:', error);
    throw error;
  }
};
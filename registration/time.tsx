import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { register, saveUserData } from './api/auth';
import { RootStackParamList } from './navigationTypes';

type TimeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Time'>;
type TimeScreenRouteProp = RouteProp<RootStackParamList, 'Time'>;

const TimeScreen = () => {
  const [selectedTime, setSelectedTime] = useState<'short' | 'medium' | 'long' | ''>('');
  const [loading, setLoading] = useState(false);
  
  const navigation = useNavigation<TimeScreenNavigationProp>();
  const route = useRoute<TimeScreenRouteProp>();
  
  const formData = route.params?.formData || { email: '', password: '', password2: '' };
  const gender = route.params?.gender;
  const name = route.params?.name;
  const age = route.params?.age;
  const height = route.params?.height;
  const weight = route.params?.weight;

  const timeOptions = [
    { label: '10 мин', value: 'short' as const },
    { label: '20-30 мин', value: 'medium' as const },
    { label: '30+ мин', value: 'long' as const },
  ];

  const handleContinue = async () => {
    if (selectedTime) {
      try {
        setLoading(true);
        
        // Подготавливаем данные для отправки на сервер
        if (!name) {
          Alert.alert('Ошибка', 'Имя пользователя обязательно');
          return;
        }

        const userData = {
          email: formData.email,
          password: formData.password,
          password2: formData.password2,
          name: name,
          gender: gender,
          age: age ? parseInt(age) : undefined,
          height: height ? parseInt(height) : undefined,
          weight: weight ? parseInt(weight) : undefined,
          workout_duration: selectedTime,
          // Другие поля будут добавлены позже
        };
        
        // Сохраняем данные пользователя локально
        await saveUserData(userData);
        
        // Отправляем данные на сервер
        const response = await register(userData);
        
        // Если регистрация успешна, переходим на следующий экран
        navigation.navigate('GoalFormation', {
          ...formData,
          gender,
          name,
          age,
          height,
          weight,
          workout_duration: selectedTime
        });
      } catch (error: any) {
        console.error('Ошибка регистрации:', error);
        console.error('Данные запроса:', userData);
        
        let errorMessage = 'Произошла ошибка при регистрации. Пожалуйста, попробуйте еще раз.';
        
        if (error.response) {
          // Сервер ответил с ошибкой
          console.error('Ответ сервера:', error.response.data);
          errorMessage = error.response.data.message || errorMessage;
        } else if (error.request) {
          // Запрос был сделан, но ответа не получено
          console.error('Нет ответа от сервера:', error.request);
          errorMessage = 'Не удалось подключиться к серверу. Проверьте подключение к интернету.';
        } else {
          // Что-то пошло не так при настройке запроса
          console.error('Ошибка запроса:', error.message);
        }
        
        Alert.alert('Ошибка регистрации', errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, styles.completedProgressBar]} />
        <View style={[styles.progressBar, styles.completedProgressBar]} />
        <View style={[styles.progressBar, styles.activeProgressBar]} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          Комфортная длительность{'\n'}тренировки для вас?
        </Text>

        <View style={styles.optionsContainer}>
          {timeOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton,
                selectedTime === option.value && styles.selectedOption,
              ]}
              onPress={() => setSelectedTime(option.value)}
            >
              <Text style={[
                styles.optionText,
                selectedTime === option.value && styles.selectedOptionText
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            (!selectedTime || loading) && styles.disabledContinueButton,
          ]}
          onPress={handleContinue}
          disabled={!selectedTime || loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.continueButtonText}>Продолжить</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECE9E4',
  },
  progressContainer: {
    flexDirection: 'row',
    padding: 20,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  completedProgressBar: {
    backgroundColor: '#ACACAC',
  },
  activeProgressBar: {
    backgroundColor: '#4CAF50',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 40,
    lineHeight: 32,
  },
  optionsContainer: {
    marginTop: 40,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedOption: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'left',
    paddingLeft: 10,
  },
  selectedOptionText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  continueButton: {
    backgroundColor: '#4D4D4D',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
  },
  disabledContinueButton: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TimeScreen; 
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { saveUserData } from './api/auth';
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

        // Подготавливаем данные для сохранения локально
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
          age: age && !isNaN(Number(age)) ? parseInt(age) : undefined,
          height: height && !isNaN(Number(height)) ? parseInt(height) : undefined,
          weight: weight && !isNaN(Number(weight)) ? parseInt(weight) : undefined,
          workout_duration: selectedTime,
        };

        // Сохраняем данные пользователя локально
        await saveUserData(userData);

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
        console.error('Ошибка при сохранении данных:', error);
        Alert.alert('Ошибка', 'Произошла ошибка при сохранении данных. Пожалуйста, попробуйте еще раз.');
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
    fontFamily: 'Lora',

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
    color: '#333',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 40,
    lineHeight: 32,
    fontFamily: 'Lora-Bold',

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
    fontFamily: 'Lora',

  },
  selectedOptionText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontFamily: 'Lora',

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
    fontFamily: 'Lora',

  },
});

export default TimeScreen;
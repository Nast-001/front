import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from './navigationTypes';

type InfoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Info'>;
type InfoScreenRouteProp = RouteProp<RootStackParamList, 'Info'>;

const InfoScreen = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('70');
  const [bmi, setBmi] = useState<number | null>(null);
  const [displayHeight, setDisplayHeight] = useState('170');
  const [displayWeight, setDisplayWeight] = useState('70');
  
  const navigation = useNavigation<InfoScreenNavigationProp>();
  const route = useRoute<InfoScreenRouteProp>();
  
  const formData = route.params?.formData || {};
  const gender = route.params?.gender;

  useEffect(() => {
    if (height && weight) {
      const heightInMeters = Number(height) / 100;
      const weightInKg = Number(weight);
      const bmiValue = weightInKg / (heightInMeters * heightInMeters);
      setBmi(Number(bmiValue.toFixed(1)));
    }
  }, [height, weight]);

  const validateAge = (ageValue: string) => {
    const ageNum = Number(ageValue);
    if (ageNum > 100) {
      Alert.alert('Ошибка', 'Пожалуйста, введите корректный возраст (до 100 лет)');
      return false;
    }
    if (ageNum < 1) {
      Alert.alert('Ошибка', 'Пожалуйста, введите корректный возраст (от 1 года)');
      return false;
    }
    return true;
  };

  const handleAgeChange = (text: string) => {
    if (text === '' || /^\d+$/.test(text)) {
      setAge(text);
    }
  };

  const handleContinue = async () => {
    if (name && age && height && weight) {
      try {
        // Получаем данные авторизации
        const authDataStr = await AsyncStorage.getItem('authData');
        const authData = authDataStr ? JSON.parse(authDataStr) : {};
        
        // Создаем полный объект данных
        const userData = {
          ...authData, // Сначала берем данные авторизации (email, password)
          ...formData, // Затем данные из route.params
          gender,      // Пол из route.params
          name,        // Имя из локального состояния
          age: Number(age),
          height: Number(height),
          weight: Number(weight)
        };
        
        // Сохраняем объединенные данные
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        console.log('Объединенные данные сохранены:', userData);
        
        // Переходим на следующий экран
        navigation.navigate('Time', userData);
      } catch (error) {
        console.error('Ошибка при сохранении данных:', error);
        Alert.alert('Ошибка', 'Не удалось сохранить данные. Попробуйте еще раз.');
      }
    }
  };

  const getBmiCategory = (bmiValue: number) => {
    if (bmiValue < 18.5) return 'Недостаточный вес';
    if (bmiValue < 25) return 'Нормальный вес';
    if (bmiValue < 30) return 'Избыточный вес';
    return 'Ожирение';
  };

  return (
    <View style={styles.container}>      
      {/* Прогресс-бар (1/3) */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, styles.completedProgressBar]} />
        <View style={[styles.progressBar, styles.completedProgressBar]} />
        <View style={[styles.progressBar, styles.activeProgressBar]} />
      </View>
      
      <View style={styles.formContainer}>
        {/* Имя */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Имя</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Введите ваше имя"
          />
        </View>
        
        {/* Возраст */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Возраст</Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={handleAgeChange}
            keyboardType="numeric"
            placeholder="Введите ваш возраст"
            maxLength={2}
          />
        </View>
        
        {/* Рост */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Рост: {displayHeight} см</Text>
          <Slider
            style={styles.slider}
            minimumValue={140}
            maximumValue={220}
            step={1}
            value={Number(height)}
            onValueChange={(value) => setDisplayHeight(String(Math.round(value)))}
            onSlidingComplete={(value) => setHeight(String(Math.round(value)))}
            minimumTrackTintColor="#4CAF50"
            maximumTrackTintColor="#E0E0E0"
            thumbTintColor="#4CAF50"
          />
        </View>
        
        {/* Вес */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Вес: {displayWeight} кг</Text>
          <Slider
            style={styles.slider}
            minimumValue={30}
            maximumValue={150}
            step={1}
            value={Number(weight)}
            onValueChange={(value) => setDisplayWeight(String(Math.round(value)))}
            onSlidingComplete={(value) => setWeight(String(Math.round(value)))}
            minimumTrackTintColor="#4CAF50"
            maximumTrackTintColor="#E0E0E0"
            thumbTintColor="#4CAF50"
          />
        </View>

        {bmi !== null && (
          <View style={styles.bmiContainer}>
            <Text style={styles.bmiLabel}>Индекс массы тела (ИМТ):</Text>
            <Text style={styles.bmiValue}>{bmi}</Text>
            <Text style={styles.bmiCategory}>{getBmiCategory(bmi)}</Text>
          </View>
        )}
      </View>
      
      <TouchableOpacity
        style={[
          styles.continueButton,
          (!name || !age || !height || !weight) && styles.disabledContinueButton
        ]}
        onPress={handleContinue}
        disabled={!name || !age || !height || !weight}
      >
        <Text style={styles.continueButtonText}>Продолжить</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ECE9E4',
    justifyContent: 'center',
    fontFamily: 'Lora',

  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'Lora',

    color: '#333',
  },
  progressContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  activeProgressBar: {
    backgroundColor: '#4CAF50',
  },
  completedProgressBar: {
    backgroundColor: '#ACACAC', 
  },
  formContainer: {
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
    fontFamily: 'Lora',

  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    fontFamily: 'Lora',

  },
  continueButton: {
    backgroundColor: '#4D4D4D',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledContinueButton: {
    backgroundColor: '#4D4D4D',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Lora',

  },
  slider: {
    width: '100%',
    height: 40,
    fontFamily: 'Lora',

  },
  bmiContainer: {
    backgroundColor: '#FAFAFA',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  bmiLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    fontFamily: 'Lora',

  },
  bmiValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  bmiCategory: {
    fontFamily: 'Lora',
    fontSize: 16,
    color: '#666',
  },
});

export default InfoScreen;
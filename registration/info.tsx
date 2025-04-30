import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './navigationTypes';
import { useNavigation } from '@react-navigation/native';

type InfoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Info'>;

const InfoScreen = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const navigation = useNavigation<InfoScreenNavigationProp>();

  const handleContinue = () => {
    if (name && age && height && weight) {
      navigation.navigate('GoalsScreen');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Информация</Text>
      
      {/* Прогресс-бар (1/3) */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, styles.completedProgressBar]} />
        <View style={[styles.progressBar, styles.inactiveProgressBar]} />
        <View style={[styles.progressBar, styles.inactiveProgressBar]} />
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
            onChangeText={setAge}
            keyboardType="numeric"
            placeholder="Введите ваш возраст"
          />
        </View>
        
        {/* Рост */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Рост (см)</Text>
          <TextInput
            style={styles.input}
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
            placeholder="Введите ваш рост"
          />
        </View>
        
        {/* Вес */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Вес (кг)</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            placeholder="Введите ваш вес"
          />
        </View>
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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  progressBar: {
    height: 4,
    width: 60,
    marginHorizontal: 5,
    borderRadius: 2,
  },
  completedProgressBar: {
    backgroundColor: '#4CAF50',
  },
  inactiveProgressBar: {
    backgroundColor: '#E0E0E0',
  },
  formContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledContinueButton: {
    backgroundColor: '#E0E0E0',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default InfoScreen;
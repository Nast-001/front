import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './navigationTypes';
import { useNavigation } from '@react-navigation/native';
import { Checkbox } from 'expo-checkbox';

type SkillScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Skill'>;

const SkillScreen = () => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const navigation = useNavigation<SkillScreenNavigationProp>();
  
  const options = [
    { id: 1, label: 'Да, регулярно занимаюсь йогой' },
    { id: 2, label: 'Да, пробовал(а) несколько раз' },
    { id: 3, label: 'Нет, но очень хочу попробовать' },
    { id: 4, label: 'Нет, не интересовался(ась) йогой раньше' },
    { id: 5, label: 'Да, но давно и не регулярно' }
  ];

  const handleContinue = () => {
    if (selectedOption) {
      navigation.navigate('Flexibility');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Skill</Text>
      
      {/* Прогресс-бар из 3 полосок */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, styles.activeProgressBar]} />
        <View style={[styles.progressBar, styles.inactiveProgressBar]} />
        <View style={[styles.progressBar, styles.inactiveProgressBar]} />
      </View>
      
      <Text style={styles.questionText}>Вы уже когда-нибудь 
      пробовали йогу?</Text>
      
      {/* 5 вариантов выбора */}
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.optionContainer}
            onPress={() => setSelectedOption(option.id)}
          >
            <Checkbox
              value={selectedOption === option.id}
              onValueChange={() => setSelectedOption(option.id)}
              color={selectedOption === option.id ? '#4CAF50' : undefined}
            />
            <Text style={[
              styles.optionText,
              selectedOption === option.id && styles.selectedOptionText
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Кнопка Продолжить */}
      <TouchableOpacity
        style={[
          styles.continueButton,
          !selectedOption && styles.disabledContinueButton
        ]}
        onPress={handleContinue}
        disabled={!selectedOption}
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
  activeProgressBar: {
    backgroundColor: '#4CAF50',
  },
  inactiveProgressBar: {
    backgroundColor: '#E0E0E0',
  },
  questionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  optionsContainer: {
    marginBottom: 40,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  selectedOptionText: {
    color: '#2E7D32',
    fontWeight: '500',
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledContinueButton: {
    backgroundColor: '#BDBDBD',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SkillScreen;
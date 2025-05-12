import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './navigationTypes';
import { useNavigation } from '@react-navigation/native';

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

  const handleOptionPress = (optionId: number) => {
    if (selectedOption === optionId) {
      setSelectedOption(null);
    } else {
      setSelectedOption(optionId);
    }
  };

  const handleContinue = () => {
    if (selectedOption) {
      navigation.navigate('Flexibility');
    }
  };

  return (
    <View style={styles.container}>
      {/* Индикатор прогресса */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, styles.activeProgressBar]} />
        <View style={[styles.progressBar, styles.completedProgressBar]} />
        <View style={[styles.progressBar, styles.completedProgressBar]} />
      </View>
      
      <Text style={styles.questionText}>Вы уже когда-нибудь пробовали йогу?</Text>
      
      {/* Варианты выбора без чекбоксов */}
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionContainer,
              selectedOption === option.id && styles.selectedOptionContainer
            ]}
            onPress={() => handleOptionPress(option.id)}
          >
            <Text style={[
              styles.optionText,
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
    backgroundColor: '#ECE9E4',
    fontFamily: 'Lora',

  },
  progressContainer: {
    flexDirection: 'row',
    marginBottom: 30,
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
  questionText: {
    fontSize: 22,
    marginBottom: 10,
    marginTop: 40,
    textAlign: 'center',
    fontFamily: 'Lora-Bold',

  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 30,
  },
  optionContainer: {
    padding: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#F7F7F7',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Lora',

  },
 
  selectedOptionContainer: {
    backgroundColor: '#87D0B2',
    borderColor: '#87D0B2',
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
    opacity: 0.5,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Lora',

  },
});

export default SkillScreen;
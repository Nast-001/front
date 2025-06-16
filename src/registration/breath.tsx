import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './navigationTypes';
import { Checkbox } from 'expo-checkbox';
import { useNavigation } from '@react-navigation/native';

type BreathScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Breath'>;

const BreathScreen = () => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const navigation = useNavigation<BreathScreenNavigationProp>();

  const options = [
    { id: 1, text: "Я хорошо контролирую свое дыхание и использую техники дыхания в практике" },
    { id: 2, text: "Я иногда теряю контроль над дыханием, особенно во время интенсивных упражнений" },
    { id: 3, text: "Я не умею контролировать дыхание и хотел(а) бы научиться" }
  ];

  const handleContinue = () => {
    if (selectedOption) {
      navigation.navigate('Restrictions');
    }
  };

  return (
    <View style={styles.container}>      
      {/* Прогресс-бар (2/3) */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, styles.completedProgressBar]} />
        <View style={[styles.progressBar, styles.activeProgressBar]} />
        <View style={[styles.progressBar, styles.completedProgressBar]} />
      </View>
      
      <Text style={styles.questionText}>Как ваше управление дыханием?</Text>
      
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionButton,
              selectedOption === option.id && styles.selectedOptionButton
            ]}
            onPress={() => setSelectedOption(option.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.optionText}>{option.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
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
    justifyContent: 'space-between',
    fontFamily: 'Lora',

  },

  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
    fontFamily: 'Lora-Bold',

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
    fontSize: 28,
    textAlign: 'center',
    marginTop: 40,
    fontFamily: 'Lora-Bold',

  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 20,
  },
  optionButton: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  selectedOptionButton: {
    backgroundColor: '#87D0B2',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Lora',

  },
  continueButton: {
    backgroundColor: '#4D4D4D',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledContinueButton: {
    backgroundColor: '#4D4D4D',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Lora',

  },
});

export default BreathScreen;
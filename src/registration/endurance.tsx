import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './navigationTypes';
import { useNavigation } from '@react-navigation/native';

type EnduranceScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Endurance'>;

const EnduranceScreen = () => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const navigation = useNavigation<EnduranceScreenNavigationProp>();

  const options = [
    { id: 1, text: "Менее 30 секунд" },
    { id: 2, text: "30-60 секунд" },
    { id: 3, text: "1-2 минуты" },
    { id: 4, text: "Более 2 минут" },
    { id: 5, text: "Не знаю" }
  ];

  const handleContinue = () => {
    if (selectedOption) {
      navigation.navigate('Breath');
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
      
      <Text style={styles.questionText}>Как долго вы можете 
      держать планку?</Text>
      
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
    textAlign: 'center',
    color: '#333',
    fontFamily: 'Lora-Bold',

  },
  progressContainer: {
    flexDirection: 'row',
    marginBottom: 60,
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
    fontSize: 24,
    fontFamily: 'Lora-Bold',

    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  selectedOptionButton: {
    backgroundColor: '#87D0B2',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    fontFamily: 'Lora',

  },
  continueButton: {
    backgroundColor: '#4D4D4D',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
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

export default EnduranceScreen;
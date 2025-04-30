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
    { id: 1, text: "Регулярно практикую дыхательные упражнения" },
    { id: 2, text: "Иногда делаю дыхательные практики" },
    { id: 3, text: "Не занимаюсь дыхательными практиками" }
  ];

  const handleContinue = () => {
    if (selectedOption) {
      navigation.navigate('Restrictions');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Дыхание</Text>
      
      {/* Прогресс-бар (2/3) */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, styles.completedProgressBar]} />
        <View style={[styles.progressBar, styles.completedProgressBar]} />
        <View style={[styles.progressBar, styles.inactiveProgressBar]} />
      </View>
      
      <Text style={styles.questionText}>Как часто вы практикуете дыхательные упражнения?</Text>
      
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
            <Checkbox
              value={selectedOption === option.id}
              onValueChange={() => setSelectedOption(option.id)}
              color={selectedOption === option.id ? '#4CAF50' : undefined}
            />
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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  progressBar: {
    height: 4,
    flex: 1,
    marginHorizontal: 2,
  },
  completedProgressBar: {
    backgroundColor: '#4CAF50',
  },
  inactiveProgressBar: {
    backgroundColor: '#E0E0E0',
  },
  questionText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsContainer: {
    marginBottom: 30,
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
    backgroundColor: '#E8F5E9',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
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

export default BreathScreen;
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './navigationTypes';
import { useNavigation } from '@react-navigation/native';

type TimeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Time'>;

const TimeScreen = () => {
  const [selectedTime, setSelectedTime] = useState<string>('');
  const navigation = useNavigation<TimeScreenNavigationProp>();

  const timeOptions = [
    { label: '10 мин', value: '10' },
    { label: '20-30 мин', value: '20-30' },
    { label: '30+ мин', value: '30+' },
  ];

  const handleContinue = () => {
    if (selectedTime) {
      navigation.navigate('GoalFormation');
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
            !selectedTime && styles.disabledContinueButton,
          ]}
          onPress={handleContinue}
          disabled={!selectedTime}
        >
          <Text style={styles.continueButtonText}>Продолжить</Text>
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
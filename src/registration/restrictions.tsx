import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './navigationTypes';
import { Checkbox } from 'expo-checkbox';
import { useNavigation } from '@react-navigation/native';

type RestrictionsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Restrictions'>;

const RestrictionsScreen = () => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const navigation = useNavigation<RestrictionsScreenNavigationProp>();

  const options = [
    { id: 1, text: "Нет ограничений" },
    { id: 2, text: "Боли в спине" },
    { id: 3, text: "Проблемы с коленями" },
    { id: 4, text: "Чувствительность в суставах" },
    { id: 5, text: "Беременность " },
    { id: 6, text: "Послеродовое состояние" }
  ];

  const handleOptionToggle = (id: number) => {
    if (id === 1) { // "Нет ограничений"
      if (selectedOptions.includes(1)) {
        setSelectedOptions([]);
      } else {
        setSelectedOptions([1]);
      }
    } else {
      if (selectedOptions.includes(1)) {
        setSelectedOptions([id]);
      } else {
        setSelectedOptions(prev => 
          prev.includes(id) ? prev.filter(option => option !== id) : [...prev, id]
        );
      }
    }
  };

  const isOptionDisabled = (id: number) => {
    if (selectedOptions.includes(1)) {
      return id !== 1;
    }
    return false;
  };

  const handleContinue = () => {
    if (selectedOptions.length > 0) {
      navigation.navigate('Info');
    }
  };

  return (
    <View style={styles.container}>      
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, styles.completedProgressBar]} />
        <View style={[styles.progressBar, styles.activeProgressBar]} />
        <View style={[styles.progressBar, styles.completedProgressBar]} />
      </View>
      
      <Text style={styles.questionText}>У вас есть физические 
      ограничения?</Text>
      
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionButton,
              selectedOptions.includes(option.id) && styles.selectedOptionButton,
              isOptionDisabled(option.id) && styles.disabledOptionButton
            ]}
            onPress={() => handleOptionToggle(option.id)}
            activeOpacity={0.7}
            disabled={isOptionDisabled(option.id)}
          >
            <Text style={[
              styles.optionText,
              isOptionDisabled(option.id) && styles.disabledOptionText
            ]}>{option.text}</Text>
            <Checkbox
              value={selectedOptions.includes(option.id)}
              onValueChange={() => handleOptionToggle(option.id)}
              color={selectedOptions.includes(option.id) ? '#4CAF50' : '#519076'}
            />
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity
        style={[
          styles.continueButton,
          selectedOptions.length === 0 && styles.disabledContinueButton
        ]}
        onPress={handleContinue}
        disabled={selectedOptions.length === 0}
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
    fontFamily: 'Lora-Bold',

  },
  progressContainer: {
    flexDirection: 'row',
    marginBottom: 5,
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
    textAlign: 'center',
    color: '#333',
    marginTop: 40,
    fontFamily: 'Lora-Bold',

  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  selectedOptionButton: {
    backgroundColor: '#87D0B2',
  },
  disabledOptionButton: {
    backgroundColor: '#F5F5F5',
    opacity: 0.5,
  },
  optionText: {
    fontFamily: 'Lora',

    fontSize: 16,
  },
  disabledOptionText: {
    color: '#999',
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

export default RestrictionsScreen;

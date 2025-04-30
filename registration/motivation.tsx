// MotivationScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Checkbox } from 'expo-checkbox';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './navigationTypes';

type MotivationRouteProp = RouteProp<RootStackParamList, 'Motivation'>;
type MotivationNavigationProp = StackNavigationProp<RootStackParamList, 'Motivation'>;

type Props = {
  navigation: MotivationNavigationProp;
  route: MotivationRouteProp;
};

const MotivationScreen = ({ navigation, route }: Props) => {
  const [selectedMotivations, setSelectedMotivations] = useState<string[]>([]);

  const motivations = [
    "Хочу улучшить здоровье",
    "Хочу лучше выглядеть",
    "Хочу повысить уверенность в себе",
    "Хочу больше энергии",
    "Хочу справиться со стрессом",
    "Хочу пример для близких"
  ];

  const toggleMotivation = (motivation: string) => {
    setSelectedMotivations(prev => 
      prev.includes(motivation) 
        ? prev.filter(item => item !== motivation)
        : [...prev, motivation]
    );
  };

  return (
    <View style={styles.container}>
      {/* Индикатор прогресса (3 полоски, активна третья) */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, styles.completedProgressBar]} />
        <View style={[styles.progressBar, styles.completedProgressBar]} />
        <View style={[styles.progressBar, styles.activeProgressBar]} />
      </View>

      <Text style={styles.title}>Что вас мотивирует?</Text>
      <Text style={styles.subtitle}>Выберите то, что важно для вас</Text>

      {/* Чекбоксы мотивации */}
      {motivations.map((motivation, index) => (
        <View key={index} style={styles.checkboxWrapper}>
          <Checkbox
            value={selectedMotivations.includes(motivation)}
            onValueChange={() => toggleMotivation(motivation)}
            color={selectedMotivations.includes(motivation) ? '#007AFF' : undefined}
            style={styles.checkbox}
          />
          <Text style={styles.checkboxLabel}>{motivation}</Text>
        </View>
      ))}

      {/* Кнопка продолжения */}
      <TouchableOpacity
        style={[
          styles.button,
          selectedMotivations.length === 0 && styles.disabledButton,
        ]}
        disabled={selectedMotivations.length === 0}
        onPress={() => navigation.navigate('Loading')}
      >
        <Text style={styles.buttonText}>Продолжить</Text>
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
    backgroundColor: '#007AFF',
  },
  completedProgressBar: {
    backgroundColor: '#4CAF50', // Зеленый для завершенных этапов
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    marginRight: 8,
    width: 24,
    height: 24,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 8,
    flex: 1,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#B3E0FF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MotivationScreen;

import { Checkbox } from 'expo-checkbox';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from './navigationTypes';

type GoalsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'GoalsScreen'>;

type Props = {
  navigation: GoalsScreenNavigationProp;
};

const GoalsScreen = ({ navigation }: Props) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const goals = [
    "Похудение",
    "Набор мышечной массы",
    "Поддержание формы",
    "Улучшение выносливости",
    "Реабилитация после травм"
  ];

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(item => item !== goal) 
        : [...prev, goal]
    );
  };

  const handleContinue = () => {
    navigation.navigate('BodyAreas', { selectedGoals });
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, styles.activeProgressBar]} />
        <View style={styles.progressBar} />
        <View style={styles.progressBar} />
      </View>

      <Text style={styles.title}>Какие у вас цели?</Text>
      <Text style={styles.subtitle}>Выберите одну или несколько целей</Text>

      <View style={styles.checkboxContainer}>
        {goals.map((goal, index) => (
          <View key={index} style={styles.checkboxWrapper}>
            <Checkbox
              value={selectedGoals.includes(goal)}
              onValueChange={() => toggleGoal(goal)}
              color={selectedGoals.includes(goal) ? '#007AFF' : undefined}
              style={styles.checkbox}
            />
            <Text style={styles.checkboxLabel}>{goal}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.button, 
          selectedGoals.length === 0 && styles.disabledButton
        ]}
        onPress={handleContinue}
        disabled={selectedGoals.length === 0}
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
  checkboxContainer: {
    marginBottom: 30,
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
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
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

export default GoalsScreen;
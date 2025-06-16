import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Checkbox } from 'expo-checkbox';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from './navigationTypes';
import Goal1Icon from '../assets/goal1.svg';
import Goal2Icon from '../assets/goal2.svg';
import Goal3Icon from '../assets/goal3.svg';
import Goal4Icon from '../assets/goal4.svg';
import Goal5Icon from '../assets/goal5.svg';

type GoalsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'GoalsScreen'>;
type GoalsScreenRouteProp = RouteProp<RootStackParamList, 'GoalsScreen'>;

type Props = {
  navigation: GoalsScreenNavigationProp;
  route: GoalsScreenRouteProp;
};

const GoalsScreen = ({ navigation, route }: Props) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const formData = route.params?.formData || {};
  const gender = route.params?.gender;

  const goals = [
    { text: "Изучение основы йоги", icon: Goal1Icon },
    { text: "Снижение стресса", icon: Goal2Icon },
    { text: "Увеличение силы", icon: Goal3Icon },
    { text: "Снижение веса", icon: Goal4Icon },
    { text: "Улучшение гибкости", icon: Goal5Icon }
  ];

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(item => item !== goal) 
        : [...prev, goal]
    );
  };

  const handleContinue = () => {
    navigation.navigate('BodyAreas', { 
      ...formData,
      gender,
      selectedGoals 
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, styles.activeProgressBar]} />
        <View style={[styles.progressBar,styles.completedProgressBar]} />
        <View style={[styles.progressBar,styles.completedProgressBar]} />
      </View>

      <Text style={styles.title}> Какие цели вы хотите достичь? </Text>
      <Text style={styles.subtitle}>Выберите одну или несколько целей</Text>

      <View style={styles.checkboxContainer}>
        {goals.map((goal, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.checkboxWrapper,
              selectedGoals.includes(goal.text) && styles.selectedWrapper
            ]}
            onPress={() => toggleGoal(goal.text)}
          >
            <View style={styles.iconContainer}>
              <goal.icon width={24} height={24} />
            </View>
            <Text style={styles.checkboxLabel}>{goal.text}</Text>
            <Checkbox
              value={selectedGoals.includes(goal.text)}
              onValueChange={() => toggleGoal(goal.text)}
              color={selectedGoals.includes(goal.text) ? '#519076' : '#519076'}
              style={styles.checkbox}
            />
          </TouchableOpacity>
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
    backgroundColor: '#519076',
  },
  completedProgressBar: {
    backgroundColor: '#ACACAC',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    textAlign: 'center',
    fontFamily: 'Lora-SemiBold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    fontFamily: 'Lora',

  },
  checkboxContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 30,
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F7F7F7',
    borderRadius: 8,
    padding: 16,
    position: 'relative',
  },
  selectedWrapper: {
    backgroundColor: '#87D0B2',
  },
  iconContainer: {
    marginRight: 12,
  },
  icon: {
    width: 24,
    height: 24,
  },
  checkbox: {
    position: 'absolute',
    right: 12,
    width: 24,
    height: 24,
  },
  checkboxLabel: {
    fontSize: 16,
    flex: 1,
    paddingRight: 40,
  },
  button: {
    backgroundColor: '#4D4D4D',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
    
  },
  disabledButton: {
    backgroundColor: '#4D4D4D',
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Lora',
  },
});

export default GoalsScreen;
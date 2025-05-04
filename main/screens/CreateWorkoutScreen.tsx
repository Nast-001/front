import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MainTabParamList } from '../navigationTypes';

type CreateWorkoutScreenNavigationProp = StackNavigationProp<MainTabParamList, 'CreateWorkout'>;

const CreateWorkoutScreen = () => {
  const navigation = useNavigation<CreateWorkoutScreenNavigationProp>();
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');

  const workoutTypes = [
    { id: '1', title: 'Кардио', icon: '🏃‍♂️' },
    { id: '2', title: 'Силовая', icon: '💪' },
    { id: '3', title: 'Йога', icon: '🧘‍♂️' },
    { id: '4', title: 'Растяжка', icon: '🤸‍♂️' },
  ];

  const durations = [
    { id: '1', title: '15 минут' },
    { id: '2', title: '30 минут' },
    { id: '3', title: '45 минут' },
    { id: '4', title: '60 минут' },
  ];

  const levels = [
    { id: '1', title: 'Начальный' },
    { id: '2', title: 'Средний' },
    { id: '3', title: 'Продвинутый' },
  ];

  const handleCreate = () => {
    // Здесь будет логика создания тренировки
    console.log('Создание тренировки:', {
      type: selectedType,
      duration: selectedDuration,
      level: selectedLevel,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Тип тренировки</Text>
        <View style={styles.optionsContainer}>
          {workoutTypes.map(type => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.optionButton,
                selectedType === type.id && styles.selectedOption,
              ]}
              onPress={() => setSelectedType(type.id)}
            >
              <Text style={styles.optionIcon}>{type.icon}</Text>
              <Text style={styles.optionText}>{type.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Длительность</Text>
        <View style={styles.optionsContainer}>
          {durations.map(duration => (
            <TouchableOpacity
              key={duration.id}
              style={[
                styles.optionButton,
                selectedDuration === duration.id && styles.selectedOption,
              ]}
              onPress={() => setSelectedDuration(duration.id)}
            >
              <Text style={styles.optionText}>{duration.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Уровень сложности</Text>
        <View style={styles.optionsContainer}>
          {levels.map(level => (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.optionButton,
                selectedLevel === level.id && styles.selectedOption,
              ]}
              onPress={() => setSelectedLevel(level.id)}
            >
              <Text style={styles.optionText}>{level.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.createButton,
          (!selectedType || !selectedDuration || !selectedLevel) && styles.disabledButton,
        ]}
        onPress={handleCreate}
        disabled={!selectedType || !selectedDuration || !selectedLevel}
      >
        <Text style={styles.createButtonText}>Создать тренировку</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECE9E4',
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionButton: {
    width: '48%',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#4CAF50',
  },
  optionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  createButton: {
    backgroundColor: '#4CAF50',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CreateWorkoutScreen; 
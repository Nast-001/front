import { Checkbox } from 'expo-checkbox';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from './navigationTypes';

type BodyAreasNavigationProp = StackNavigationProp<RootStackParamList, 'BodyAreas'>;

type Props = {
  navigation: BodyAreasNavigationProp;
};

const BodyAreasScreen = ({ navigation }: Props) => {
  const [primaryArea, setPrimaryArea] = useState<string | null>(null);
  const [secondaryAreas, setSecondaryAreas] = useState<string[]>([]);

  const bodyAreas = [
    "Руки", "Ноги", "Спина", "Грудь", "Плечи", "Пресс", "Ягодицы"
  ];

  const togglePrimaryArea = (area: string) => {
    setPrimaryArea(prev => prev === area ? null : area);
    setSecondaryAreas([]);
  };

  const toggleSecondaryArea = (area: string) => {
    if (primaryArea) return;
    
    setSecondaryAreas(prev => 
      prev.includes(area) 
        ? prev.filter(item => item !== area) 
        : [...prev, area]
    );
  };

  const handleContinue = () => {
    navigation.navigate('Motivation', { 
      selectedGoals: primaryArea ? [primaryArea] : secondaryAreas 
    });
  };

  const isAreaSelected = (area: string) => {
    return primaryArea === area || secondaryAreas.includes(area);
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, styles.completedProgressBar]} />
        <View style={[styles.progressBar, styles.activeProgressBar]} />
        <View style={styles.progressBar} />
      </View>

      <Text style={styles.title}>Какие области тела хотите проработать?</Text>
      <Text style={styles.subtitle}>
        {primaryArea 
          ? `Основная зона: ${primaryArea}`
          : secondaryAreas.length > 0 
            ? `Выбрано зон: ${secondaryAreas.length}`
            : "Выберите зоны для работы"}
      </Text>

      <View style={styles.checkboxContainer}>
        {bodyAreas.map((area, index) => (
          <View key={index} style={styles.checkboxWrapper}>
            <Checkbox
              value={isAreaSelected(area)}
              onValueChange={() => 
                primaryArea 
                  ? togglePrimaryArea(area)
                  : toggleSecondaryArea(area)
              }
              color={isAreaSelected(area) ? '#007AFF' : undefined}
              style={styles.checkbox}
              disabled={!!primaryArea && !isAreaSelected(area)}
            />
            <Text style={styles.checkboxLabel}>{area}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, (!primaryArea && secondaryAreas.length === 0) && styles.disabledButton]}
        onPress={handleContinue}
        disabled={!primaryArea && secondaryAreas.length === 0}
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
    backgroundColor: '#4CAF50',
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
  disabledText: {
    color: '#AAA',
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

export default BodyAreasScreen;

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Checkbox } from 'expo-checkbox';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from './navigationTypes';

type MotivationRouteProp = RouteProp<RootStackParamList, 'Motivation'>;
type MotivationNavigationProp = StackNavigationProp<RootStackParamList, 'Motivation'>;

type Props = {
  navigation: MotivationNavigationProp;
  route: MotivationRouteProp;
};

const MotivationScreen = ({ navigation, route }: Props) => {
  const [selectedMotivations, setSelectedMotivations] = useState<string[]>([]);

  const formData = route.params?.formData || {};
  const gender = route.params?.gender;
  const selectedGoals = route.params?.selectedGoals || [];
  const body_parts = route.params?.body_parts || [];

  const motivations = [
    "Оставаться здоровым",
    "Иметь лучшую гибкость",
    "Снижать уровень стресса",
    "Внутреннее спокойствие",
    "Развивать силу",
    "Изучать новые техники"
  ];

  const toggleMotivation = (motivation: string) => {
    setSelectedMotivations(prev => 
      prev.includes(motivation) 
        ? prev.filter(item => item !== motivation) 
        : [...prev, motivation]
    );
  };

  const handleContinue = () => {
    if (selectedMotivations.length > 0) {
      navigation.navigate('Loading', {
        ...formData,
        gender,
        selectedGoals,
        body_parts,
        selectedMotivations
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, styles.completedProgressBar]} />
        <View style={[styles.progressBar, styles.completedProgressBar]} />
        <View style={[styles.progressBar, styles.activeProgressBar]} />
      </View>

      <Text style={styles.title}>Что вас мотивирует?</Text>
      <Text style={styles.subtitle}>Выберите то, что важно для вас</Text>

      <View style={styles.motivationsContainer}>
        {motivations.map((motivation, index) => (
          <View key={index} style={[
            styles.checkboxWrapper,
            selectedMotivations.includes(motivation) && styles.selectedWrapper
          ]}>
            <TouchableOpacity
              style={styles.touchableArea}
              onPress={() => toggleMotivation(motivation)}
            >
              <Checkbox
                value={selectedMotivations.includes(motivation)}
                onValueChange={() => toggleMotivation(motivation)}
                color={selectedMotivations.includes(motivation) ? '#519076' : '#519076'}
                style={styles.checkbox}
              />
              <Text style={styles.checkboxLabel}>{motivation}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          selectedMotivations.length === 0 && styles.disabledButton
        ]}
        onPress={handleContinue}
        disabled={selectedMotivations.length === 0}
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
    marginBottom: 40,
    paddingHorizontal: 20,
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
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Lora',

  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Lora',

  },
  motivationsContainer: {
    flex: 1,
    marginBottom: 20,
    justifyContent: 'center',
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
  },
  selectedWrapper: {
    backgroundColor: '#87D0B2',
    borderColor: '#519076',
  },
  checkbox: {
    marginRight: 12,
  },
  checkboxLabel: {
    fontSize: 16,
    flex: 1,
    color: '#000',
  },
  selectedLabel: {
    color: '#000',
  },
  button: {
    backgroundColor: '#4D4D4D',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Lora',

  },
  touchableArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
});


export default MotivationScreen;
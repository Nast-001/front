import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Checkbox } from 'expo-checkbox';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from './navigationTypes';

type BodyAreasNavigationProp = StackNavigationProp<RootStackParamList, 'BodyAreas'>;
type BodyAreasRouteProp = RouteProp<RootStackParamList, 'BodyAreas'>;

type Props = {
  navigation: BodyAreasNavigationProp;
  route: BodyAreasRouteProp;
};

const BodyAreasScreen = ({ navigation, route }: Props) => {
  const [primaryArea, setPrimaryArea] = useState<string | null>(null);
  const [secondaryAreas, setSecondaryAreas] = useState<string[]>([]);
  
  const formData = route.params?.formData || {};
  const gender = route.params?.gender;
  const selectedGoals = route.params?.selectedGoals || [];

  const bodyAreas = [
    "Всё тело", "Шея и плечи", "Руки и грудь", "Спина", "Пресс и кор", "Ягодицы и Бедра", "Ноги и голени"
  ];
  const togglePrimaryArea = (area: string) => {
    if (area === "Всё тело") {
      setPrimaryArea(prev => prev === area ? null : area);
      setSecondaryAreas([]);
    } else {
      setPrimaryArea(prev => prev === area ? null : area);
      setSecondaryAreas([]);
    }
  };
  
  const toggleSecondaryArea = (area: string) => {
    if (primaryArea === "Всё тело") return;
    
    if (area === "Всё тело") {
      setPrimaryArea("Всё тело");
      setSecondaryAreas([]);
    } else {
      setSecondaryAreas(prev => 
        prev.includes(area) 
          ? prev.filter(item => item !== area) 
          : [...prev, area]
      );
    }
  };

  const isAreaDisabled = (area: string) => {
    if (primaryArea === "Всё тело") {
      return area !== "Всё тело";
    }
    return false;
  };

  const handleContinue = () => {
    navigation.navigate('Motivation', { 
      ...formData,
      gender,
      selectedGoals,
      body_parts: primaryArea ? [primaryArea] : secondaryAreas 
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
        <View style={[styles.progressBar, styles.completedProgressBar]} />
      </View>

      <Text style={styles.title}>Какие области тела хотите проработать?</Text>
      <Text style={styles.subtitle}>
        {primaryArea 
          ? `Основная зона: ${primaryArea}`
          : secondaryAreas.length > 0 
            ? `Выбрано зон: ${secondaryAreas.length}`
            : "Выберите зоны для работы"}
      </Text>

      <View style={styles.contentContainer}>
        <Image 
          source={require('../assets/body.png')} 
          style={styles.bodyImage}
          resizeMode="contain"
        />
        <View style={styles.checkboxContainer}>
          {bodyAreas.map((area, index) => (
            <View key={index} style={[
              styles.checkboxWrapper,
              isAreaSelected(area) && { backgroundColor: '#87D0B2' }
            ]}>
              <TouchableOpacity 
                style={styles.touchableArea}
                onPress={() => 
                  primaryArea 
                    ? togglePrimaryArea(area)
                    : toggleSecondaryArea(area)
                }
                disabled={isAreaDisabled(area)}
              >
                <Text style={styles.checkboxLabel}>{area}</Text>
                <Checkbox
                  value={isAreaSelected(area)}
                  onValueChange={() => {}}
                  color={isAreaSelected(area) ? '#007AFF' : '#519076'}
                  style={styles.checkbox}
                  disabled={isAreaDisabled(area)}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
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
    backgroundColor: '#ECE9E4',
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    flex: 1,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'space-between', 
  },
  bodyImage: {
    width: '40%',
    height: '100%',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  checkboxContainer: {
    flex: 1,
    marginLeft: 20,
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    backgroundColor: '#F7F7F7',
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'space-between',
  },
  checkbox: {
    marginLeft: 8,
    width: 24,
    height: 24,
    
  },
  checkboxLabel: {
    fontSize: 16,
    
  },
  disabledText: {
    color: '#AAA',
  },
  button: {
    backgroundColor: '#4D4D4D',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#4D4D4D',
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  touchableArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default BodyAreasScreen;

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Checkbox } from 'expo-checkbox';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from './navigationTypes';

const bodyImage = require('../assets/body.png');
const allImage = require('../assets/all.png');
const neckImage = require('../assets/neck.png');
const handsImage = require('../assets/hands.png');
const backImage = require('../assets/body_back.png');
const pressImage = require('../assets/press.png');
const hipsImage = require('../assets/hips.png');
const legsImage = require('../assets/legs.png');

type BodyAreasNavigationProp = StackNavigationProp<RootStackParamList, 'BodyAreas'>;
type BodyAreasRouteProp = RouteProp<RootStackParamList, 'BodyAreas'>;

type Props = {
  navigation: BodyAreasNavigationProp;
  route: BodyAreasRouteProp;
};

const BodyAreasScreen = ({ navigation, route }: Props) => {
  const [primaryArea, setPrimaryArea] = useState<string | null>(null);
  const [secondaryAreas, setSecondaryAreas] = useState<string[]>([]);
  const [currentBodyImage, setCurrentBodyImage] = useState(bodyImage);

  const formData = route.params?.formData || {};
  const gender = route.params?.gender;
  const selectedGoals = route.params?.selectedGoals || [];

  const bodyAreas = [
    "Всё тело", "Шея и плечи", "Руки и грудь", "Спина", "Пресс и кор", "Ягодицы и Бедра", "Ноги и голени"
  ];
  const togglePrimaryArea = (area: string) => {
    if (area === "Всё тело") {
      setPrimaryArea(prevArea => {
        setCurrentBodyImage(prevArea === area ? bodyImage : allImage);
        return prevArea === area ? null : area;
      });
      setSecondaryAreas([]);
    } else {
      setPrimaryArea(prevArea => {
        setCurrentBodyImage(bodyImage);
        return prevArea === area ? null : area;
      });
      setSecondaryAreas([]);
    }
  };

  const toggleSecondaryArea = (area: string) => {
    if (primaryArea === "Всё тело") return;

    if (area === "Всё тело") {
      setPrimaryArea("Всё тело");
      setSecondaryAreas([]);
      setCurrentBodyImage(allImage);
    } else {
      setSecondaryAreas(prev => {
        const newAreas = prev.includes(area)
          ? prev.filter(item => item !== area)
          : [...prev, area];

        if (newAreas.length === 0) {
          setCurrentBodyImage(bodyImage);
        } else if (area === "Шея и плечи") {
          setCurrentBodyImage(neckImage);
        } else if (area === "Руки и грудь") {
          setCurrentBodyImage(handsImage);
        } else if (area === "Спина") {
          setCurrentBodyImage(backImage);
        } else if (area === "Ягодицы и Бедра") {
          setCurrentBodyImage(hipsImage);
        } else if (area === "Ноги и голени") {
          setCurrentBodyImage(legsImage);
        } else if (area === "Пресс и кор") {
          setCurrentBodyImage(pressImage);
        }

        return newAreas;
      });
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
          source={currentBodyImage}
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
                  color={isAreaSelected(area) ? '#519076' : '#519076'}
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
    textAlign: 'center',
    fontFamily: 'Lora',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    fontFamily: 'Lora',
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
    position: 'relative',
  },
  checkboxContainer: {
    fontFamily: 'Lora',
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
    fontFamily: 'Lora',
  },
  checkbox: {
    marginLeft: 8,
    width: 24,
    height: 24,
    fontFamily: 'Lora',
  },
  checkboxLabel: {
    fontSize: 16,
  },
  disabledText: {
    color: '#AAA',
    fontFamily: 'Lora',
  },
  button: {
    backgroundColor: '#4D4D4D',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    fontFamily: 'Lora',
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
  touchableArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    fontFamily: 'Lora',
  },

});

export default BodyAreasScreen;

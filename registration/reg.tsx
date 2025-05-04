import { NavigationProp, RouteProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from './navigationTypes';

type Props = {
  navigation: NavigationProp<RootStackParamList, 'Regist'>;
  route: RouteProp<RootStackParamList, 'Regist'>;
};

const RegistPage = ({ navigation, route }: Props) => {
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const formData = route.params?.formData || {};

  const handleGenderSelect = (gender: string) => {
    setSelectedGender(gender);
    
    // Преобразуем пол в формат, который ожидает API
    let apiGender: 'M' | 'F' | 'N' | 'prefer_not_to_say' = 'prefer_not_to_say';
    
    if (gender === 'male') {
      apiGender = 'M';
    } else if (gender === 'female') {
      apiGender = 'F';
    } else if (gender === 'nonbinary') {
      apiGender = 'N';
    }
    
    // Переходим на следующий экран с сохраненными данными
    navigation.navigate('GoalsScreen', {
      ...formData,
      gender: apiGender
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.text}>
          Чтобы мы могли предложить вам наилучшие тренировки, расскажите немного о себе.
        </Text>

        <Image style={styles.image} source={require('../assets/human.png')} resizeMode="contain" />

        <Text style={styles.additionalText}>Выберите пол</Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[styles.button, selectedGender === 'female' && styles.selectedButton]} 
            onPress={() => handleGenderSelect('female')}
          >
            <Text style={styles.buttonText}>Женский</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, selectedGender === 'male' && styles.selectedButton]} 
            onPress={() => handleGenderSelect('male')}
          >
            <Text style={styles.buttonText}>Мужской</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, selectedGender === 'nonbinary' && styles.selectedButton]} 
            onPress={() => handleGenderSelect('nonbinary')}
          >
            <Text style={styles.buttonText}>Небинарный</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.skipButton}
        onPress={() => handleGenderSelect('prefer_not_to_say')}
      >
        <Text style={styles.skipButtonText}>предпочитаю не говорить</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#ECE9E4',
    justifyContent: 'space-between'
  },
  contentContainer: {
    flex: 1
  },
  text: { 
    fontSize: 18, 
    marginBottom: 20, 
    marginTop: 20, 
    textAlign: 'center', 
    color: 'rgba(0, 0, 0, 0.6)' 
  },
  additionalText: { 
    fontSize: 20, 
    marginVertical: 20, 
    textAlign: 'center', 
    color: '#555', 
    fontWeight: 'bold' 
  },
  image: { 
    width: '100%', 
    height: 250, 
    marginBottom: 10, 
    borderRadius: 8, 
  },
  buttonsContainer: { 
    marginTop: 20 
  },
  button: { 
    backgroundColor: '#F7F7F7', 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 10, 
  },
  selectedButton: { 
    backgroundColor: '#87D0B2' 
  },
  buttonText: { 
    color: 'black', 
    fontSize: 16, 
    fontWeight: 'bold', 
    textAlign: 'left' 
  },
  skipButton: { 
    paddingVertical: 10,
    marginBottom: 10
  },
  skipButtonText: { 
    color: 'rgba(0, 0, 0, 0.5)', 
    fontSize: 16, 
    textAlign: 'center',
    textDecorationLine: 'underline'
  },
});

export default RegistPage;

import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from './navigationTypes';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
  navigation: NavigationProp<RootStackParamList, 'Regist'>;
  route: RouteProp<RootStackParamList, 'Regist'>;
};

const RegistPage = ({ navigation, route }: Props) => {
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const formData = route.params?.formData || {};

  const handleGenderSelect = async (gender: string) => {
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
    
    // Сохраняем данные в AsyncStorage
    const userData = {
      ...formData,
      gender: apiGender
    };
    
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      console.log('Данные сохранены в AsyncStorage:', userData);
    } catch (error) {
      console.error('Ошибка при сохранении данных:', error);
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
            <View style={styles.buttonContent}>
              <Icon name="gender-female" size={24} color="black" style={styles.genderIcon} />
              <Text style={styles.buttonText}>Женский</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, selectedGender === 'male' && styles.selectedButton]} 
            onPress={() => handleGenderSelect('male')}
          >
            <View style={styles.buttonContent}>
              <Icon name="gender-male" size={24} color="black" style={styles.genderIcon} />
              <Text style={styles.buttonText}>Мужской</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, selectedGender === 'nonbinary' && styles.selectedButton]} 
            onPress={() => handleGenderSelect('nonbinary')}
          >
            <View style={styles.buttonContent}>
              <Icon name="gender-non-binary" size={24} color="black" style={styles.genderIcon} />
              <Text style={styles.buttonText}>Небинарный</Text>
            </View>
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
    justifyContent: 'space-between',
    fontFamily: 'Lora',

  },
  contentContainer: {
    flex: 1
  },
  text: { 
    fontSize: 18, 
    marginBottom: 20, 
    marginTop: 20, 
    textAlign: 'center', 
    color: 'rgba(0, 0, 0, 0.6)',
    fontFamily: 'Lora',

  },
  additionalText: { 
    fontSize: 20, 
    marginVertical: 20, 
    textAlign: 'center', 
    color: 'black', 
    fontFamily: 'Lora',

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
    fontFamily: 'Lora',
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
    fontFamily: 'Lora',

    textDecorationLine: 'underline'
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    fontFamily: 'Lora',
  },
  genderIcon: {
    marginRight: 15,
    marginLeft: 15,
  },
});

export default RegistPage;
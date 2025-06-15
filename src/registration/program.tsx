import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { sendRegistrationData } from './api/auth';
import { RootStackParamList } from './navigationTypes';

type GoalFormationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'GoalFormation'>;

type Props = {
  navigation: GoalFormationScreenNavigationProp;
};

const GoalFormationScreen = ({ navigation }: Props) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingData, setIsSendingData] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Эффект "дыхания"
  useEffect(() => {
    if (imageLoaded) {
      const breathingAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      breathingAnimation.start();
    }
  }, [imageLoaded, scaleAnim]);

  // Отправка данных на бэкенд и переход на страницу уведомлений
  useEffect(() => {
    const sendDataAndNavigate = async () => {
      try {
        setIsSendingData(true);
        await sendRegistrationData();

        navigation.navigate('Notification', {});
      } catch (error: any) {
        console.error('Ошибка при отправке данных:', error);
        Alert.alert(
          'Ошибка',
          'Не удалось отправить данные на сервер. Пожалуйста, попробуйте еще раз.'
        );
      } finally {
        setIsSendingData(false);
        setIsLoading(false);
      }
    };

    // Задержка для отображения анимации
    const timer = setTimeout(() => {
      sendDataAndNavigate();
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Подбираем индивидуальную программу для вас</Text>

      <View style={styles.imageContainer}>
        <Animated.Image
          style={[
            styles.image,
            {
              opacity: imageLoaded ? 1 : 0,
              transform: [{ scale: scaleAnim }],
            }
          ]}
          source={require('../assets/load.png')}
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <View style={[StyleSheet.absoluteFill, styles.loadingPlaceholder]}>
            <ActivityIndicator size={24} color="#4CAF50" />
          </View>
        )}
      </View>

      <Text style={styles.text_subtitle}>Стать лучшей версией себя</Text>

      {(isLoading || isSendingData) && (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size={12} color="#4CAF50" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    fontFamily: 'Lora',

    backgroundColor: '#ECE9E4',
  },
  text: {
    fontSize: 30,
    marginVertical: 20,
    textAlign: 'center',
    color: '#333',
    fontFamily: 'Lora-Bold',

  },
  imageContainer: {
    width: 300,
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: '180%',
    height: '180%',
    resizeMode: 'contain',
  },
  text_subtitle: {
    fontSize: 18,
    marginVertical: 20,
    textAlign: 'center',
    color: '#333',
    fontFamily: 'Lora',

  },
  loadingPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default GoalFormationScreen;
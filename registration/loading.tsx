import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, Easing, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './navigationTypes';

type LoadingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Loading'>;

type Props = {
  navigation: LoadingScreenNavigationProp;
};

const LoadingScreen = ({ navigation }: Props) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

  // Автоматический переход на Skill через 2.5 секунды
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('Skill');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Формируем цель</Text>
      
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
            <ActivityIndicator size="large" color="#4CAF50" />
          </View>
        )}
      </View>
      
      <Text style={styles.text}>Большие результаты начинаются 
      с маленьких целей</Text>
      
      {isLoading && (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size="small" color="#4CAF50" />
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
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    marginVertical: 20,
    textAlign: 'center',
    color: '#333',
  },
  imageContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
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

export default LoadingScreen;
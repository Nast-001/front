import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from './navigationTypes';

type HelloScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Hello'>;

const HelloScreen = () => {
  const navigation = useNavigation<HelloScreenNavigationProp>();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password2: '',
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (isLogin) {
        // Переходим сразу на HomeScreen без валидации
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTab' }],
        });
      } else {
        // Проверяем пароли при регистрации
        if (formData.password !== formData.password2) {
          Alert.alert('Ошибка', 'Пароли не совпадают');
          return;
        }

        // Сохраняем данные для регистрации
        await AsyncStorage.setItem('authData', JSON.stringify({
          email: formData.email,
          password: formData.password,
          password2: formData.password2,
        }));

        // Переходим на следующий экран согласно последовательности в App.tsx
        navigation.navigate('Reg', { formData });
      }
    } catch (error: any) {
      Alert.alert(
        'Ошибка',
        error?.response?.data?.detail || 'Произошла ошибка при авторизации'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/load.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      
      <Text style={styles.title}>
        {isLogin ? 'Вход' : 'Регистрация'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Пароль"
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
        secureTextEntry
      />

      {!isLogin && (
        <TextInput
          style={styles.input}
          placeholder="Подтвердите пароль"
          value={formData.password2}
          onChangeText={(text) => setFormData({ ...formData, password2: text })}
          secureTextEntry
        />
      )}

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled, isLogin ? styles.greenButton : styles.whiteButton]} 
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={[styles.buttonText, !isLogin && styles.greenText]}>
          {loading 
            ? 'Загрузка...' 
            : isLogin 
              ? 'Войти' 
              : 'Зарегистрироваться'
          }
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.switchButton, isLogin ? styles.whiteButton : styles.greenButton]}
        onPress={() => setIsLogin(!isLogin)}
      >
        <Text style={[styles.buttonText, isLogin && styles.greenText]}>
          {isLogin ? 'Зарегистрироваться' : 'Войти'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    backgroundColor: '#ECE9E4',
    fontFamily: 'Lora',

  },
  logo: {
    width: '100%',
    height: 250,
    marginBottom: 0,
  },
  loadImage: {
    width: '100%',
    height: 250,
    marginBottom: 40,
  },
  title: {
    fontSize: 40,
    fontFamily: 'Lora',
    marginBottom: 30,
    textAlign: 'center',
    
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Lora',
  },
  button: {
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Lora',
    color: '#FFFFFF',
  },
  greenText: {
    color: '#87D0B2',
  },
  greenButton: {
    backgroundColor: '#87D0B2',
  },
  whiteButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#87D0B2',
  },
  switchButton: {
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HelloScreen;
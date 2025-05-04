import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
          routes: [{ name: 'MainTabs' }],
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
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading 
            ? 'Загрузка...' 
            : isLogin 
              ? 'Войти' 
              : 'Зарегистрироваться'
          }
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.switchButton}
        onPress={() => setIsLogin(!isLogin)}
      >
        <Text style={styles.switchButtonText}>
          {isLogin
            ? 'Нет аккаунта? Зарегистрироваться'
            : 'Уже есть аккаунт? Войти'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 20,
  },
  switchButtonText: {
    color: '#007AFF',
    textAlign: 'center',
  },
});

export default HelloScreen;
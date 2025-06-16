import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { globalStyles } from '../../src/styles/globalStyles';
import NotificationService from '../services/NotificationService';

const NotificationPage = () => {
  const navigation = useNavigation();

  const handleEnableNotifications = async () => {
    try {
      await NotificationService.createChannel();
      const hasPermission = await NotificationService.requestUserPermission();
      
      if (hasPermission) {
        await NotificationService.displayNotification(
          'Уведомления включены!',
          'Теперь вы будете получать важные напоминания о тренировках.'
        );
        navigation.goBack();
      } else {
        Alert.alert(
          'Ошибка',
          'Пожалуйста, разрешите уведомления в настройках устройства.'
        );
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
      Alert.alert(
        'Ошибка',
        'Не удалось включить уведомления. Пожалуйста, попробуйте позже.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('../assets/bell-icon.png')}
          style={styles.bellIcon}
        />
        <Text style={styles.title}>Получать уведомления</Text>
        
        <View style={styles.card}>
          <Image
            source={require('../assets/workout-icon.png')}
            style={styles.workoutIcon}
          />
          <Text style={styles.cardTitle}>Время для йоги! 🧘</Text>
          <Text style={styles.cardText}>
            Начинайте каждый тренировку сегодня! Нажмите сюда, чтобы снять напряжение и восстановить энергию.
          </Text>
        </View>

        <Text style={styles.description}>
          Следите за новостями, получайте напоминания о начале тренировок, мотивацию каждый день и будьте в курсе всех акций!
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.skipButtonText}>Не сейчас</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.enableButton}
          onPress={handleEnableNotifications}
        >
          <Text style={styles.enableButtonText}>Включить уведомления</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...globalStyles.text,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  bellIcon: {
    width: 100,
    height: 100,
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    marginBottom: 30,
  },
  workoutIcon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
    color: '#666',
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  skipButton: {
    marginBottom: 15,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    color: '#666',
    textDecorationLine: 'underline',
  },
  enableButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '100%',
  },
  enableButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default NotificationPage; 
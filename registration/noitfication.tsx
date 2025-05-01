import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const NotificationPage = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Request permissions when component mounts
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permissions not granted');
      }
    })();
  }, []);

  const handleEnableNotifications = async () => {
    try {
      // Check current permission status
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus === 'granted') {
        // Show notification
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Ура!',
            body: 'Уведомления успешно включены!',
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: null, // Show immediately
        });
      } else {
        console.log('Permission not granted');
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Image 
          source={require('../assets/bell-icon.png')}
          style={styles.bellIcon}
        />
        <Text style={styles.title}>Получать уведомления</Text>
        
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <Image 
                source={require('../assets/workout-icon.png')}
                style={styles.workoutIcon}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>Время для йоги! 🧘</Text>
              <Text style={styles.cardText}>
                Начинайте каждый тренировку сегодня! Нажмите сюда, чтобы снять напряжение и восстановить энергию.
              </Text>
            </View>
          </View>
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
    backgroundColor: '#ECE9E4',
    padding: 20,
    justifyContent: 'space-between',
  },
  contentContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bellIcon: {
    width: 100,
    height: 100,
    marginTop: 40,
    marginBottom: 50,
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
    padding: 15,
    width: '100%',
    marginBottom: 30,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ECE9E4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  workoutIcon: {
    width: 60,
    height: 60,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  cardText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
    color: '#666',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
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
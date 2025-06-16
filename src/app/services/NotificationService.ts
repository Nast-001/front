import notifee, { AndroidImportance, TriggerType } from '@notifee/react-native';
import { Platform, PermissionsAndroid } from 'react-native';

class NotificationService {
  async requestUserPermission() {
    if (Platform.OS === 'ios') {
      const authStatus = await notifee.requestPermission();
      return authStatus.authorizationStatus >= 0;
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
  }

  async createChannel() {
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });
    }
  }

  async displayNotification(title: string, body: string) {
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: 'default',
        importance: AndroidImportance.HIGH,
      },
    });
  }

  async scheduleNotification(title: string, body: string, timestamp: number) {
    await notifee.createTriggerNotification(
      {
        title,
        body,
        android: {
          channelId: 'default',
          importance: AndroidImportance.HIGH,
        },
      },
      {
        type: TriggerType.TIMESTAMP,
        timestamp,
      },
    );
  }
}

export default new NotificationService(); 
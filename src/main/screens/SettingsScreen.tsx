import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Linking, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../components/CustomText';

const SettingsScreen = ({ navigation }: { navigation: any }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const confirmDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#2d4150" />
        </TouchableOpacity>
        <Text variant="bold" style={styles.headerTitle}>Настройки</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Изменение профиля */}
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <View style={styles.settingLeft}>
            <Feather name="user" size={24} color="#2d4150" />
            <Text style={styles.settingText}>Изменить профиль</Text>
          </View>
          <Feather name="chevron-right" size={24} color="#7f8c8d" />
        </TouchableOpacity>

        {/* Уведомления */}
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Feather name="bell" size={24} color="#2d4150" />
            <Text style={styles.settingText}>Уведомления</Text>
          </View>
          <TouchableOpacity
            style={[styles.toggle, notificationsEnabled && styles.toggleActive]}
            onPress={toggleNotifications}
          >
            <View style={[styles.toggleCircle, notificationsEnabled && styles.toggleCircleActive]} />
          </TouchableOpacity>
        </View>

        {/* Поддержка */}
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => Linking.openURL('https://t.me/ans_sergeeva')}
        >
          <View style={styles.settingLeft}>
            <Feather name="message-circle" size={24} color="#2d4150" />
            <Text style={styles.settingText}>Поддержка</Text>
          </View>
          <Feather name="chevron-right" size={24} color="#7f8c8d" />
        </TouchableOpacity>

        {/* Удаление аккаунта */}
        <TouchableOpacity
          style={[styles.settingItem, styles.deleteButton]}
          onPress={() => setShowDeleteModal(true)}
        >
          <View style={styles.settingLeft}>
            <Feather name="trash-2" size={24} color="#ff3b30" />
            <Text style={[styles.settingText, styles.deleteText]}>Удалить аккаунт</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Модальное окно подтверждения удаления */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text variant="bold" style={styles.modalTitle}>Удалить аккаунт?</Text>
            <Text style={styles.modalText}>
              Вы уверены, что хотите удалить свой аккаунт? Это действие нельзя отменить.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.cancelButtonText}>Нет</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmDeleteButton]}
                onPress={confirmDelete}
              >
                <Text style={styles.deleteButtonText}>Да</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECE9E4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Lora',
    color: '#2d4150',
  },
  content: {
    padding: 16,
  },
  settingItem: {
    margin:3,
    borderRadius: 10,
    padding: 16,
    backgroundColor: '#F7F7F7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    fontFamily: 'Lora',
    color: '#2d4150',
    marginLeft: 12,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#4cd964',
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  toggleCircleActive: {
    transform: [{ translateX: 22 }],
  },
  deleteButton: {
    marginTop: 32,
    borderBottomWidth: 0,
  },
  deleteText: {
    color: '#ff3b30',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Lora',
    color: '#2d4150',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    fontFamily: 'Lora',
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#2d4150',
    fontSize: 16,
    fontFamily: 'Lora',
  },
  confirmDeleteButton: {
    backgroundColor: '#ff3b30',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Lora',
  },
});

export default SettingsScreen;
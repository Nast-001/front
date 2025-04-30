import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';

interface ExitLessonModalProps {
  visible: boolean;
  onClose: () => void;
  onExit: (saveLesson: boolean) => void;
}

const ExitLessonModal: React.FC<ExitLessonModalProps> = ({
  visible,
  onClose,
  onExit,
}) => {
  const [saveLesson, setSaveLesson] = useState(false);

  const handleExit = () => {
    onExit(saveLesson);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Выход из урока</Text>
          <Text style={styles.message}>
            Если вы выйдете сейчас, урок не будет сохранен. Хотите сохранить его в истории?
          </Text>
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Сохранить урок</Text>
            <Switch
              value={saveLesson}
              onValueChange={setSaveLesson}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={saveLesson ? '#2d4150' : '#f4f3f4'}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Отмена</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.exitButton]}
              onPress={handleExit}
            >
              <Text style={[styles.buttonText, styles.exitButtonText]}>Выйти</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d4150',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: '#2d4150',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  exitButton: {
    backgroundColor: '#2d4150',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d4150',
  },
  exitButtonText: {
    color: '#fff',
  },
});

export default ExitLessonModal; 
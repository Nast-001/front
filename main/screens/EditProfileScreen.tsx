import { Feather } from '@expo/vector-icons';
import React, { useState, useEffect, useCallback } from 'react';
import { Image, ImageBackground, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

type ProfileData = {
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  mainGoal: string;
  focusArea: string;
  restrictions: string;
};

const EditProfileScreen = ({ navigation }: { navigation: any }) => {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'Настя',
    age: 23,
    gender: 'Женский',
    height: 165,
    weight: 52,
    mainGoal: 'Изучение основы йоги',
    focusArea: 'Все тело',
    restrictions: 'Нет ограничений',
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState<string>('');
  const [tempValue, setTempValue] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    loadProfileImage();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfileImage();
    }, [])
  );

  const loadProfileImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem('profileImage');
      if (savedImage) {
        setProfileImage(savedImage);
      } else {
        setProfileImage(null);
      }
    } catch (error) {
      console.error('Error loading profile image:', error);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Ошибка', 'Для загрузки фото необходимо разрешение на доступ к галерее');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setProfileImage(imageUri);
      try {
        await AsyncStorage.setItem('profileImage', imageUri);
      } catch (error) {
        console.error('Error saving profile image:', error);
      }
    }
  };

  const goals = [
    "Изучение основы йоги",
    "Снижение стресса",
    "Увеличение силы",
    "Снижение веса",
    "Улучшение гибкости"
  ];

  const focusAreas = [
    "Всё тело", "Шея и плечи", "Руки и грудь", "Спина", "Пресс и кор", "Ягодицы и Бедра", "Ноги и голени"
  ];

  const restrictions = [
    "Нет ограничений",
    "Боли в спине",
    "Проблемы с коленями",
    "Чувствительность в суставах",
    "Беременность",
    "Послеродовое состояние"
  ];

  const genders = [
    "Женский",
    "Мужской",
    "Другой"
  ];

  const handleFieldPress = (field: string, value: string | number) => {
    setCurrentField(field);
    setTempValue(value.toString());
    setModalVisible(true);
  };

  const handleSave = () => {
    if (currentField === 'имя') {
      setProfileData({ ...profileData, name: tempValue });
    } else if (currentField === 'возраст') {
      setProfileData({ ...profileData, age: parseInt(tempValue) });
    } else if (currentField === 'рост') {
      setProfileData({ ...profileData, height: parseInt(tempValue) });
    } else if (currentField === 'вес') {
      setProfileData({ ...profileData, weight: parseInt(tempValue) });
    } else if (currentField === 'главная цель') {
      setProfileData({ ...profileData, mainGoal: tempValue });
    } else if (currentField === 'область фокуса') {
      setProfileData({ ...profileData, focusArea: tempValue });
    } else if (currentField === 'ограничения') {
      setProfileData({ ...profileData, restrictions: tempValue });
    } else if (currentField === 'пол') {
      setProfileData({ ...profileData, gender: tempValue });
    }
    setModalVisible(false);
  };

  const renderField = (label: string, value: string | number) => (
    <TouchableOpacity 
      style={styles.fieldContainer}
      onPress={() => handleFieldPress(label, value)}
    >
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldValueContainer}>
        <Text style={styles.fieldValue}>{value}</Text>
        <Feather name="chevron-right" size={20} color="#7f8c8d" />
      </View>
    </TouchableOpacity>
  );

  const renderModal = () => {
    let options: string[] = [];
    let isTextInput = false;

    switch (currentField) {
      case 'имя':
        isTextInput = true;
        break;
      case 'возраст':
      case 'рост':
      case 'вес':
        isTextInput = true;
        break;
      case 'главная цель':
        options = goals;
        break;
      case 'область фокуса':
        options = focusAreas;
        break;
      case 'ограничения':
        options = restrictions;
        break;
      case 'пол':
        options = genders;
        break;
    }

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{currentField}</Text>
            
            {isTextInput ? (
              <TextInput
                style={styles.input}
                value={tempValue}
                onChangeText={setTempValue}
                keyboardType={currentField === 'имя' ? 'default' : 'numeric'}
                placeholder={`Введите ${currentField}`}
              />
            ) : (
              <ScrollView style={styles.optionsContainer}>
                {options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.optionItem}
                    onPress={() => {
                      setTempValue(option);
                      handleSave();
                    }}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {isTextInput && (
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Сохранить</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/profile-bg.png')}
        style={styles.headerBackground}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <View style={styles.profileImageContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={profileImage ? { uri: profileImage } : require('../../assets/default-avatar.png')}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.changePhotoButton} onPress={pickImage}>
          <Text style={styles.changePhotoText}>Изменить фото</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {renderField('имя', profileData.name)}
        {renderField('возраст', profileData.age)}
        {renderField('пол', profileData.gender)}
        {renderField('рост', profileData.height)}
        {renderField('вес', profileData.weight)}
        {renderField('главная цель', profileData.mainGoal)}
        {renderField('область фокуса', profileData.focusArea)}
        {renderField('ограничения', profileData.restrictions)}
      </View>
      {renderModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    flex: 1,
    backgroundColor: '#ECE9E4',
    fontFamily: 'Lora',
  },
  headerBackground: {
    marginTop: -30,
    height: 170,
    width: '100%',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: -50,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#fff',
  },
  changePhotoButton: {
    marginTop: 8,
  },
  changePhotoText: {
    color: '#2d4150',
    fontSize: 14,
    textDecorationLine: 'underline',
    fontFamily: 'Lora',
  },
  content: {
    backgroundColor: '#ECE9E4',
    margin: 3,
    flex: 1,
    padding: 16,
    borderRadius: 10,
  },
  fieldContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 8,
    backgroundColor: '#ffff',
    borderRadius: 10,
    paddingHorizontal: 16,
  },
  fieldLabel: {
    fontSize: 16,
    color: '#2d4150',
    fontFamily: 'Lora',
  },
  fieldValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldValue: {
    fontSize: 16,
    color: '#2d4150',
    marginRight: 8,
    fontFamily: 'Lora',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Lora',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontFamily: 'Lora',
  },
  optionsContainer: {
    maxHeight: 300,
  },
  optionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Lora',
  },
  saveButton: {
    backgroundColor: '#519076',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Lora',
  },
});

export default EditProfileScreen; 
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const [profileData] = useState<ProfileData>({
    name: 'Настя',
    age: 23,
    gender: 'Женский',
    height: 165,
    weight: 52,
    mainGoal: 'Изучение основы йоги',
    focusArea: 'Все тело',
    restrictions: 'Нет ограничений',
  });

  const renderField = (label: string, value: string | number) => (
    <TouchableOpacity style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldValueContainer}>
        <Text style={styles.fieldValue}>{value}</Text>
        <Feather name="chevron-right" size={20} color="#7f8c8d" />
      </View>
    </TouchableOpacity>
  );

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
        <Image
          source={require('../../assets/default-avatar.png')}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.changePhotoButton}>
          <Text style={styles.changePhotoText}>Изменить фото</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {renderField('Имя', profileData.name)}
        {renderField('Возраст', profileData.age)}
        {renderField('Пол', profileData.gender)}
        {renderField('Рост', profileData.height)}
        {renderField('Вес', profileData.weight)}
        {renderField('Главная цель', profileData.mainGoal)}
        {renderField('Область фокуса', profileData.focusArea)}
        {renderField('Ограничения', profileData.restrictions)}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    flex: 1,
    backgroundColor: '#ECE9E4',
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
    borderRadius:20,
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
  },
  fieldValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldValue: {
    fontSize: 16,
    color: '#2d4150',
    marginRight: 8,
  },
});

export default EditProfileScreen; 
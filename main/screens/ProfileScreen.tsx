import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MainTabParamList } from '../navigationTypes';

type ProfileScreenNavigationProp = StackNavigationProp<MainTabParamList, 'Profile'>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const userData = {
    name: 'Настя',
    age: '23',
    gender: 'Женский',
    height: '165',
    weight: '52',
    mainGoal: 'Изучение основы йоги',
    focusArea: 'Всё тело',
    limitations: 'Нет ограничений',
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100' }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.changePhotoButton}>
            <Text style={styles.changePhotoText}>Изменить фото</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Имя</Text>
            <Text style={styles.infoValue}>{userData.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Возраст</Text>
            <Text style={styles.infoValue}>{userData.age}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Пол</Text>
            <Text style={styles.infoValue}>{userData.gender}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Рост</Text>
            <Text style={styles.infoValue}>{userData.height}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Вес</Text>
            <Text style={styles.infoValue}>{userData.weight}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Главная цель</Text>
            <TouchableOpacity style={styles.expandButton}>
              <Text style={styles.infoValue}>{userData.mainGoal}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Область фокуса</Text>
            <TouchableOpacity style={styles.expandButton}>
              <Text style={styles.infoValue}>{userData.focusArea}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ограничения</Text>
            <TouchableOpacity style={styles.expandButton}>
              <Text style={styles.infoValue}>{userData.limitations}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  changePhotoButton: {
    padding: 5,
  },
  changePhotoText: {
    color: '#666',
    fontSize: 14,
  },
  infoContainer: {
    width: '100%',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#333',
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ProfileScreen; 
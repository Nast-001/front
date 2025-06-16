import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { clearFavoriteLessons, getFavoriteLessons } from '../storage/favoriteLessons';
import { Lesson } from '../types';

type RootStackParamList = {
  LessonScreen: { lesson: Lesson; fromHistory?: boolean };
};

type FavoriteLessonsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const FavoriteLessonsScreen = () => {
  const navigation = useNavigation<FavoriteLessonsScreenNavigationProp>();
  const [favoriteLessons, setFavoriteLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      const favorites = await getFavoriteLessons();
      setFavoriteLessons(favorites);
    };
    loadFavorites();
  }, []);

  const handleClearFavorites = async () => {
    Alert.alert(
      'Очистить избранное',
      'Вы уверены, что хотите удалить все избранные уроки?',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Очистить',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearFavoriteLessons();
              setFavoriteLessons([]);
            } catch (error) {
              console.error('Error clearing favorites:', error);
              Alert.alert('Ошибка', 'Не удалось очистить избранное');
            }
          },
        },
      ],
    );
  };

  const renderLessonItem = ({ item }: { item: Lesson }) => (
    <TouchableOpacity
      style={styles.lessonItem}
      onPress={() => navigation.navigate('LessonScreen', { lesson: item })}
    >
      <View style={styles.lessonInfo}>
        <Text style={styles.lessonTitle}>{item.title}</Text>
        <Text style={styles.lessonDuration}>{item.duration_minutes} мин</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#666" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Избранные уроки</Text>
        {favoriteLessons.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearFavorites}
          >
            <Ionicons name="trash-outline" size={24} color="#333" />
          </TouchableOpacity>
        )}
      </View>

      {favoriteLessons.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={48} color="#666" />
          <Text style={styles.emptyText}>У вас пока нет избранных уроков</Text>
        </View>
      ) : (
        <FlatList
          data={favoriteLessons}
          renderItem={renderLessonItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
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
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Lora',
    color: '#333',
  },
  listContainer: {
    padding: 16,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 12,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontFamily: 'Lora',
    color: '#333',
    marginBottom: 4,
  },
  lessonDuration: {
    fontSize: 14,
    fontFamily: 'Lora',
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Lora',
    color: '#666',
    textAlign: 'center',
  },
  clearButton: {
    marginLeft: 'auto',
    padding: 8,
  },
});

export default FavoriteLessonsScreen; 
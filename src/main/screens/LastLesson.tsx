import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text as CustomText } from '../components/CustomText';
import { clearLessonHistory, getLessonHistory, SavedLesson } from '../storage/lessonHistory';

const BASE_URL = 'http://192.168.0.176:8000';

const LastLesson = ({ navigation }: { navigation: any }) => {
  const [completedLessons, setCompletedLessons] = useState<SavedLesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Функция для обработки URL изображений
  const processImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${BASE_URL}${url}`;
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const history = await getLessonHistory();
      console.log('Loaded history:', history);
      setCompletedLessons(history);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    Alert.alert(
      'Очистить историю',
      'Вы уверены, что хотите удалить всю историю уроков?',
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
              await clearLessonHistory();
              setCompletedLessons([]);
            } catch (error) {
              console.error('Error clearing history:', error);
              Alert.alert('Ошибка', 'Не удалось очистить историю');
            }
          },
        },
      ],
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера';
    }

    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#2d4150" />
        </TouchableOpacity>
        <CustomText variant="bold" style={styles.headerTitle}>Последнее</CustomText>
        {completedLessons.length > 0 && (
          <TouchableOpacity onPress={handleClearHistory}>
            <Feather name="trash-2" size={24} color="#2d4150" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2d4150" />
          </View>
        ) : completedLessons.length === 0 ? (
          <View style={styles.emptyContainer}>
            <CustomText style={styles.emptyText}>У вас пока нет завершенных уроков</CustomText>
          </View>
        ) : (
          completedLessons.map((lesson) => (
            <TouchableOpacity
              key={lesson.id}
              style={styles.lessonCard}
              onPress={() => navigation.navigate('LessonScreen', {
                lesson: {
                  ...lesson,
                  video_file: lesson.video_file
                },
                fromHistory: true,
                returnScreen: 'LastLesson'
              })}
            >
              <View style={styles.cardContent}>
                {lesson.preview_image && (
                  <Image
                    source={{ uri: processImageUrl(lesson.preview_image) }}
                    style={styles.previewImage}
                    resizeMode="cover"
                  />
                )}
                <View style={styles.lessonInfo}>
                  <View style={styles.lessonHeader}>
                    <CustomText variant="bold" style={styles.lessonTitle}>{lesson.title}</CustomText>
                    <CustomText style={styles.lessonDate}>{formatDate(lesson.completedAt)}</CustomText>
                  </View>
                  <View style={styles.lessonDetails}>
                    <View style={styles.detailItem}>
                      <Feather name="clock" size={16} color="#2d4150" />
                      <CustomText style={styles.detailText}>{lesson.duration_minutes} мин</CustomText>
                    </View>
                    <View style={styles.detailItem}>
                      <Feather name="activity" size={16} color="#2d4150" />
                      <CustomText style={styles.detailText}>{lesson.calories} ккал</CustomText>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ECE9E4',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    color: '#2d4150',
    fontFamily: 'Lora',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Lora',
  },
  lessonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewImage: {
    width: 120,
    height: 90,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  lessonInfo: {
    flex: 1,
    padding: 12,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  lessonTitle: {
    fontSize: 16,
    color: '#2d4150',
    flex: 1,
    marginRight: 8,
    fontFamily: 'Lora',
  },
  lessonDate: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Lora',
  },
  lessonDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Lora',
  },
});

export default LastLesson;
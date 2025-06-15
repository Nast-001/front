import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ResizeMode, Video } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    BackHandler,
    Dimensions,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import ExitLessonModal from '../components/ExitLessonModal';
import { MainTabParamList } from '../navigationTypes';
import { isLessonFavorite, removeFavoriteLesson, saveFavoriteLesson } from '../storage/favoriteLessons';
import { saveLessonToHistory } from '../storage/lessonHistory';

type LessonScreenRouteProp = RouteProp<MainTabParamList, 'LessonScreen'>;
type LessonScreenNavigationProp = StackNavigationProp<MainTabParamList, 'LessonScreen'>;

const LessonScreen = () => {
  const route = useRoute<LessonScreenRouteProp>();
  const navigation = useNavigation<LessonScreenNavigationProp>();
  const { lesson } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [showExitModal, setShowExitModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (navigation.isFocused() && !route.params?.fromHistory) {
        setShowExitModal(true);
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [navigation, route.params?.fromHistory]);

  useEffect(() => {
    const videoFileName = lesson.video_file.split('/').pop();
    if (!videoFileName) {
      setError('Неверный формат видеофайла');
      setIsLoading(false);
      return;
    }

    const baseUrl = 'http://192.168.0.176:8000';
    const streamUrl = `${baseUrl}/api/lessons/stream/${encodeURIComponent(videoFileName)}`;
    setVideoUrl(streamUrl);

    const checkVideo = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const headResponse = await fetch(streamUrl, { method: 'HEAD' });
        if (!headResponse.ok) {
          throw new Error(`Video unavailable. Status: ${headResponse.status}`);
        }

        const contentType = headResponse.headers.get('content-type');
        if (!contentType?.startsWith('video/')) {
          throw new Error('Invalid video content type');
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error checking video:', error);
        setError('Не удалось загрузить видео. Пожалуйста, проверьте подключение к интернету.');
        setIsLoading(false);
      }
    };

    checkVideo();
  }, [lesson.video_file]);

  useEffect(() => {
    const checkFavorite = async () => {
      const favorite = await isLessonFavorite(lesson.id);
      setIsFavorite(favorite);
    };
    checkFavorite();
  }, [lesson.id]);

  useFocusEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pauseAsync();
      }
    };
  });

  const handleVideoError = (error: string) => {
    console.error('Ошибка воспроизведения видео:', error);
    console.error('Попытка воспроизвести видео по URL:', videoUrl);
    setError('Не удалось загрузить видео. Пожалуйста, проверьте подключение к интернету.');
    setIsLoading(false);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0
      ? `${hours} ч ${mins} мин`
      : `${mins} мин`;
  };

  const handleExit = async (saveLesson: boolean) => {
    if (saveLesson) {
      try {
        await saveLessonToHistory(lesson);
        // Обновляем статистику через AsyncStorage
        await AsyncStorage.setItem('@shouldUpdateStats', 'true');
      } catch (error) {
        console.error('Error saving lesson to history:', error);
      }
    }
    setShowExitModal(false);

    if (route.params?.fromHistory) {
      navigation.navigate('LastLesson');
    } else {
      navigation.goBack();
    }
  };

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFavoriteLesson(lesson.id);
      } else {
        await saveFavoriteLesson(lesson);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (route.params?.fromHistory) {
              navigation.navigate('LastLesson');
            } else {
              setShowExitModal(true);
            }
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={toggleFavorite}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? "#ff6b6b" : "#333"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.videoContainer}>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={24} color="#666" />
            <Text style={styles.loadingText}>Загрузка видео...</Text>
          </View>
        )}

        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color="#ff6b6b" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <Video
            ref={videoRef}
            source={{ uri: videoUrl }}
            style={styles.video}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            onLoadStart={() => setIsLoading(true)}
            onLoad={() => setIsLoading(false)}
            onError={(error) => {
              console.error('Video error details:', error);
              handleVideoError('Ошибка загрузки видео');
            }}
          />
        )}
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{lesson.title}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <Text style={styles.statText}>
              {formatDuration(lesson.duration_minutes)}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="flame-outline" size={20} color="#666" />
            <Text style={styles.statText}>
              {lesson.calories} ккал
            </Text>
          </View>
        </View>

        <Text style={styles.description}>{lesson.description}</Text>
      </View>

      <ExitLessonModal
        visible={showExitModal}
        onClose={() => setShowExitModal(false)}
        onExit={handleExit}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
  },
  favoriteButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
  },
  videoContainer: {
    width: '100%',
    height: Dimensions.get('window').width * (9/16),
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontFamily: 'Lora',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    color: '#ff6b6b',
    textAlign: 'center',
    fontFamily: 'Lora',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    fontFamily: 'Lora',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    color: '#666',
    fontSize: 16,
    fontFamily: 'Lora',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    fontFamily: 'Lora',
  },
});

export default LessonScreen;
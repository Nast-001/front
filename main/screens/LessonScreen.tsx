import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ResizeMode, Video } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MainTabParamList } from '../navigationTypes';

type LessonScreenRouteProp = RouteProp<MainTabParamList, 'LessonScreen'>;
type LessonScreenNavigationProp = StackNavigationProp<MainTabParamList, 'LessonScreen'>;

const LessonScreen = () => {
  const route = useRoute<LessonScreenRouteProp>();
  const navigation = useNavigation<LessonScreenNavigationProp>();
  const { lesson } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    // Формируем URL для streaming endpoint
    const videoFileName = lesson.video_file.split('/').pop();
    if (!videoFileName) {
      setError('Неверный формат видеофайла');
      return;
    }
    const streamUrl = `http://192.168.0.176:8000/api/lessons/stream/${encodeURIComponent(videoFileName)}`;
    setVideoUrl(streamUrl);
    
    // Проверяем доступность видео
    const checkVideo = async () => {
      try {
        console.log('Checking video availability...');
        const response = await fetch(streamUrl);
        console.log('Video check response:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries())
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error('Error checking video:', error);
        setError('Не удалось загрузить видео. Пожалуйста, проверьте подключение к интернету.');
      }
    };
    checkVideo();
  }, [lesson.video_file]);

  // Пауза видео при потере фокуса
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (videoRef.current) {
          videoRef.current.pauseAsync();
        }
      };
    }, [])
  );

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

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.videoContainer}>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#666" />
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20,
    left: 20,
    zIndex: 10,
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
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    color: '#ff6b6b',
    textAlign: 'center',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
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
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
});

export default LessonScreen; 
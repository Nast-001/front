import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ResizeMode, Video } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import {
    ImageBackground,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { RootStackParamList } from '../navigationTypes';

type Exercise = {
  name: string;
  duration: number;
  videoUrl?: string;
};

type Workout = {
  id: string;
  title: string;
  image: any;
  duration: string;
  calories: number;
  exercises: Exercise[];
};

type Props = NativeStackScreenProps<RootStackParamList, 'CustomWorkoutDetails'>;

const CustomWorkoutDetailsScreen = ({ route, navigation }: Props) => {
  const { workoutId } = route.params;
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const videoRef = useRef<Video>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const loadWorkout = async () => {
      try {
        const savedWorkoutsJson = await AsyncStorage.getItem('savedWorkouts');
        if (savedWorkoutsJson) {
          const savedWorkouts = JSON.parse(savedWorkoutsJson);
          const index = parseInt(workoutId.split('-')[1]);
          const customWorkout = savedWorkouts[index];
          
          if (customWorkout) {
            setWorkout({
              id: workoutId,
              title: customWorkout.name,
              image: customWorkout.videos[0]?.thumbnailUrl,
              duration: `${Math.floor(customWorkout.videos.reduce((acc: number, video: any) => acc + video.duration, 0) / 60)} мин`,
              calories: customWorkout.videos.reduce((acc: number, video: any) => acc + video.calories, 0),
              exercises: customWorkout.videos.map((video: any) => ({
                name: video.title,
                duration: video.duration,
                videoUrl: video.videoUrl
              }))
            });
          }
        }
      } catch (error) {
        console.error('Error loading custom workout:', error);
      }
    };

    loadWorkout();
  }, [workoutId]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startExercise = () => {
    setIsPlaying(true);
    setVideoLoaded(false);
  };

  const stopExercise = () => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const handlePlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded && status.isPlaying && !videoLoaded) {
      setVideoLoaded(true);
      
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        if (workout && currentExerciseIndex < workout.exercises.length - 1) {
          setCurrentExerciseIndex(currentExerciseIndex + 1);
          setIsPlaying(false);
          setVideoLoaded(false);
        } else {
          setShowCompletionModal(true);
          setIsPlaying(false);
        }
      }, 10000); // 10 секунд
    }
  };

  if (!workout) {
    return (
      <View style={styles.container}>
        <Text>Загрузка...</Text>
      </View>
    );
  }

  const currentExercise = workout.exercises[currentExerciseIndex];

  return (
    <View style={styles.container}>
      <ImageBackground
        source={workout.image}
        style={styles.header}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>{workout.title}</Text>
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Feather name="clock" size={20} color="#fff" />
              <Text style={styles.statText}>{workout.duration}</Text>
            </View>
            <View style={styles.statItem}>
              <Feather name="zap" size={20} color="#fff" />
              <Text style={styles.statText}>{workout.calories} ккал</Text>
            </View>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Упражнение {currentExerciseIndex + 1} из {workout.exercises.length}</Text>
        
        <TouchableOpacity
          style={styles.exerciseItem}
          onPress={() => isPlaying ? stopExercise() : startExercise()}
        >
          <View style={styles.exerciseInfo}>
            <Text style={styles.exerciseName}>{currentExercise.name}</Text>
            <Text style={styles.exerciseTime}>
              {formatTime(currentExercise.duration)}
            </Text>
          </View>
        </TouchableOpacity>

        {currentExercise.videoUrl && (
          <Video
            key={currentExerciseIndex}
            ref={videoRef}
            style={styles.video}
            source={{ uri: currentExercise.videoUrl }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping
            shouldPlay={isPlaying}
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          />
        )}
      </View>

      <Modal
        visible={showCompletionModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Тренировка завершена!</Text>
            <Text style={styles.modalText}>Вы успешно выполнили все упражнения.</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowCompletionModal(false);
                navigation.goBack();
              }}
            >
              <Text style={styles.modalButtonText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECE9E4',
  },
  header: {
    height: 300,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
    justifyContent: 'flex-end',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    fontFamily: 'Lora',
  },
  stats: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 16,
    fontFamily: 'Lora',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2d4150',
    fontFamily: 'Lora',
  },
  exerciseItem: {
    width: '100%',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  exerciseInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
    marginRight: 10,
    fontFamily: 'Lora',
  },
  exerciseTime: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Lora',
  },
  video: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ECE9E4',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2d4150',
    fontFamily: 'Lora',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    fontFamily: 'Lora',
  },
  modalButton: {
    backgroundColor: '#00adf5',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Lora',
  },
});

export default CustomWorkoutDetailsScreen; 
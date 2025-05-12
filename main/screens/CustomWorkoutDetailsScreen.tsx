import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ResizeMode, Video } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import {
  ImageBackground,
  ScrollView,
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
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const videoRef = useRef<Video>(null);

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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleExercisePress = (index: number) => {
    if (activeExerciseIndex === index) {
      setActiveExerciseIndex(null);
      setIsPlaying(false);
    } else {
      setActiveExerciseIndex(index);
      setIsPlaying(true);
    }
  };

  if (!workout) {
    return (
      <View style={styles.container}>
        <Text>Загрузка...</Text>
      </View>
    );
  }

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

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Упражнения</Text>
        {workout.exercises.map((exercise: Exercise, index: number) => (
          <View key={index}>
            <TouchableOpacity
              style={[
                styles.exerciseItem,
                activeExerciseIndex === index && styles.activeExerciseItem
              ]}
              onPress={() => handleExercisePress(index)}
            >
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseTime}>
                  {formatTime(exercise.duration)}
                </Text>
              </View>
            </TouchableOpacity>
            {activeExerciseIndex === index && exercise.videoUrl && (
              <Video
                ref={videoRef}
                style={styles.video}
                source={{ uri: exercise.videoUrl }}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                isLooping
                shouldPlay={isPlaying}
              />
            )}
          </View>
        ))}
      </ScrollView>
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
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'Lora',
  },
  exerciseItem: {
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
  activeExerciseItem: {
    backgroundColor: '#e8f5e9',
    borderWidth: 1,
    borderColor: '#4CAF50',
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
});

export default CustomWorkoutDetailsScreen; 
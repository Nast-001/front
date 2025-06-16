import { Feather } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ResizeMode, Video } from 'expo-av';
import React, { useRef, useState } from 'react';
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

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutDetails'>;

const WorkoutDetailsScreen = ({ route, navigation }: Props) => {
  const { workoutId } = route.params;
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<Video>(null);

  // Временные данные для демонстрации
  const workout: Workout = {
    id: workoutId,
    title: 'РАСТЯЖКА ДЛЯ\nТЕЛА И УМА',
    image: require('../../assets/current_workout.png'),
    duration: '15 мин',
    calories: 150,
    exercises: [
      {
        name: 'Поза горы',
        duration: 660,
        videoUrl: 'http://192.168.0.176:8000/media/lessons/videos/day1.mp4',
      }
    ],
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

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
        <View style={styles.tagsContainer}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Йога</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Растяжка</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Медитация</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Дыхание</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Релакс</Text>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Ежедневная тренировка</Text>
        {workout.exercises.map((exercise: Exercise, index: number) => (
          <View key={index}>
        
            {exercise.videoUrl && (
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
    fontFamily: 'Lora',
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
    fontFamily: 'Lora',
    color: '#fff',
    marginBottom: 10,
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
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  tag: {
    backgroundColor: '#E8E4DF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#333',
    fontSize: 14,
    fontFamily: 'Lora',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Lora',
    marginBottom: 20,
  },
  exerciseItem: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginBottom: 10,
  },
  exerciseInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseName: {
    fontSize: 16,
    fontFamily: 'Lora',
  },
  exerciseTime: {
    color: '#666',
    fontFamily: 'Lora',
  },
  video: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
});

export default WorkoutDetailsScreen;
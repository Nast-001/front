import { Feather } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigationTypes';

type AchievementsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Achievements'>;
type AchievementsScreenRouteProp = RouteProp<RootStackParamList, 'Achievements'>;

type Props = {
  navigation: AchievementsScreenNavigationProp;
  route: AchievementsScreenRouteProp;
};

type WorkoutType = {
  id: string;
  title: string;
  duration: string;
  calories: number;
  image: string;
  isSpecial?: boolean;
};

const workouts: { [key: string]: WorkoutType[] } = {
  '2025-04-08': [
    {
      id: '1',
      title: 'Йога для начинающих',
      duration: '30 мин',
      calories: 150,
      image: 'https://via.placeholder.com/100',
    },
  ],
  '2025-04-10': [
    {
      id: '2',
      title: 'Утренняя растяжка',
      duration: '20 мин',
      calories: 100,
      image: 'https://via.placeholder.com/100',
    },
    {
      id: '3',
      title: 'Медитация',
      duration: '15 мин',
      calories: 50,
      image: 'https://via.placeholder.com/100',
      isSpecial: true,
    },
    {
      id: '4',
      title: 'Вечерняя йога',
      duration: '25 мин',
      calories: 120,
      image: 'https://via.placeholder.com/100',
      isSpecial: true,
    },
  ],
};

const AchievementsScreen = ({ route, navigation }: Props) => {
  const { date } = route.params;
  const formattedDate = new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const dayWorkouts = workouts[date] || [];
  const totalDuration = dayWorkouts.reduce((acc, workout) => {
    const minutes = parseInt(workout.duration);
    return acc + minutes;
  }, 0);
  const totalCalories = dayWorkouts.reduce((acc, workout) => acc + workout.calories, 0);

  const renderWorkoutCard = (workout: WorkoutType) => (
    <TouchableOpacity 
      key={workout.id}
      style={styles.workoutCard}
      onPress={() => navigation.navigate('WorkoutDetails', { workoutId: workout.id })}
    >
      <Image source={{ uri: workout.image }} style={styles.workoutImage} />
      <View style={styles.workoutInfo}>
        <View style={styles.workoutHeader}>
          <Text style={styles.workoutTitle}>{workout.title}</Text>
          {workout.isSpecial && (
            <Feather name="star" size={16} color="#FFD700" />
          )}
        </View>
        <View style={styles.workoutStats}>
          <Text style={styles.workoutStat}>{workout.duration}</Text>
          <Text style={styles.workoutStat}>{workout.calories} ккал</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.date}>{formattedDate}</Text>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Feather name="clock" size={16} color="#666" />
            <Text style={styles.statText}>{totalDuration} мин</Text>
          </View>
          <View style={styles.statItem}>
            <Feather name="zap" size={16} color="#666" />
            <Text style={styles.statText}>{totalCalories} ккал</Text>
          </View>
        </View>
      </View>
      <ScrollView style={styles.content}>
        {dayWorkouts.map(renderWorkoutCard)}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  date: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 5,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  workoutCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
  },
  workoutImage: {
    width: 100,
    height: 100,
  },
  workoutInfo: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  workoutStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  workoutStat: {
    color: '#666',
  },
});

export default AchievementsScreen; 
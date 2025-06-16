import { Feather } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fonts } from '../../src/theme/fonts';

// Определяем локальный тип для навигации
type RootStackParamList = {
  Achievements: { date: string };
  WorkoutDetails: { workoutId: string };
};

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
  image: any;
  isSpecial?: boolean;
};

const workouts: { [key: string]: WorkoutType[] } = {
  '2025-04-08': [
    {
      id: '1',
      title: 'Утренняя йога',
      duration: '15 мин',
      calories: 78,
      image: require('../../assets/morning.png'),
    },
  ],
  '2025-04-10': [
    {
      id: '2',
      title: 'Силовая йога',
      duration: '20 мин',
      calories: 108,
      image: require('../../assets/strenght.png'),
    },
    {
      id: '3',
      title: 'Здоровая спина',
      duration: '15 мин',
      calories: 100,
      image: require('../../assets/helth_back.png'),
      isSpecial: true,
    },
    {
      id: '4',
      title: 'Вечерняя йога',
      duration: '25 мин',
      calories: 120,
      image: require('../../assets/evening.jpg'),
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
      <Image source={workout.image} style={styles.workoutImage} />
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
        <Text style={styles.workoutCount}>Количество тренировок: {dayWorkouts.length}</Text>
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
    backgroundColor: '#ECE9E4',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  workoutCount: {
    fontSize: 18,
    fontFamily: fonts.regular,
    marginBottom: 10,
    color: '#333',
  },
  date: {
    fontSize: 24,
    fontFamily: fonts.regular,
    marginBottom: 10,
    textAlign: 'center',
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
    fontFamily: fonts.regular,
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
    resizeMode: 'cover',
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
    fontFamily: fonts.regular,
    flex: 1,
  },
  workoutStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  workoutStat: {
    color: '#666',
    fontFamily: fonts.regular,
  },
});

export default AchievementsScreen; 
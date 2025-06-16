import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MainTabParamList } from '../navigationTypes';

type HomeScreenNavigationProp = StackNavigationProp<MainTabParamList, 'Home'>;

type Category = {
  id: string;
  title: string;
  image: any;
  url: string;
};

type Workout = {
  id: string;
  title: string;
  image: any;
  duration: string;
  calories: number;
  exercises: {
    name: string;
    duration: number;
    videoUrl: string;
  }[];
};

const createPersonalizedWorkouts = (
  userPreferences: {
    workout_duration: 'short' | 'medium' | 'long';
    experience: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'pro';
    flexibility: 'very_poor' | 'poor' | 'average' | 'good' | 'excellent';
    breathing: 'good' | 'middle' | 'bad';
    goals: string[];
    body_parts: string[];
    limitations: string[];
  },
  availableWorkouts: Workout[]
) => {

  const durationMap = {
    short: { min: 10, max: 20 },
    medium: { min: 20, max: 40 },
    long: { min: 40, max: 60 }
  };

  const intensityMap = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
    expert: 4,
    pro: 5
  };

  const durationFiltered = availableWorkouts.filter(workout => {
    const duration = parseInt(workout.duration);
    const { min, max } = durationMap[userPreferences.workout_duration];
    return duration >= min && duration <= max;
  });


  const contraindicationsFiltered = durationFiltered.filter(workout => {
    return !workout.exercises.some(exercise =>
      userPreferences.limitations.some(limitation =>
        exercise.name.toLowerCase().includes(limitation.toLowerCase())
      )
    );
  });


  const goalsFiltered = contraindicationsFiltered.filter(workout => {
    return userPreferences.goals.some(goal =>
      workout.title.toLowerCase().includes(goal.toLowerCase())
    ) || userPreferences.body_parts.some(part =>
      workout.title.toLowerCase().includes(part.toLowerCase())
    );
  });


  const sortedByExperience = goalsFiltered.sort((a, b) => {
    const aIntensity = a.exercises.reduce((acc, ex) => acc + ex.duration, 0) / a.exercises.length;
    const bIntensity = b.exercises.reduce((acc, ex) => acc + ex.duration, 0) / b.exercises.length;

    const userIntensity = intensityMap[userPreferences.experience];
    const aDiff = Math.abs(aIntensity - userIntensity);
    const bDiff = Math.abs(bIntensity - userIntensity);

    return aDiff - bDiff;
  });

  const flexibilityAdjusted = sortedByExperience.map(workout => ({
    ...workout,
    exercises: workout.exercises.map(exercise => ({
      ...exercise,
      duration: userPreferences.flexibility === 'very_poor' || userPreferences.flexibility === 'poor'
        ? Math.floor(exercise.duration * 0.7)
        : userPreferences.flexibility === 'excellent'
          ? Math.floor(exercise.duration * 1.2)
          : exercise.duration
    }))
  }));

  const breathingAdjusted = flexibilityAdjusted.map(workout => ({
    ...workout,
    exercises: workout.exercises.map(exercise => ({
      ...exercise,
      duration: userPreferences.breathing === 'bad'
        ? Math.floor(exercise.duration * 0.8)
        : userPreferences.breathing === 'good'
          ? Math.floor(exercise.duration * 1.1)
          : exercise.duration
    }))
  }));

  return breathingAdjusted;
};

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Настя');
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [currentDay, setCurrentDay] = useState(1);
  const [userPreferences, setUserPreferences] = useState<{
    workout_duration: 'short' | 'medium' | 'long';
    experience: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'pro';
    flexibility: 'very_poor' | 'poor' | 'average' | 'good' | 'excellent';
    breathing: 'good' | 'middle' | 'bad';
    goals: string[];
    body_parts: string[];
    limitations: string[];
  }>({
    workout_duration: 'medium',
    experience: 'beginner',
    flexibility: 'average',
    breathing: 'middle',
    goals: [],
    body_parts: [],
    limitations: []
  });

  useEffect(() => {
    fetchCategories();
    fetchUserPreferences();
  }, []);

  const fetchUserPreferences = async () => {
    try {

      const preferences = {
        workout_duration: 'medium' as const,
        experience: 'beginner' as const,
        flexibility: 'average' as const,
        breathing: 'middle' as const,
        goals: ['растяжка', 'гибкость'],
        body_parts: ['спина', 'ноги'],
        limitations: []
      };
      setUserPreferences(preferences);

      const availableWorkouts = await fetchAvailableWorkouts();

      const personalizedWorkouts = createPersonalizedWorkouts(preferences, availableWorkouts);

      if (personalizedWorkouts.length > 0) {
        setCurrentWorkout(personalizedWorkouts[0]);
      }
    } catch (error) {
      console.error('Ошибка при загрузке предпочтений:', error);
    }
  };

  const fetchAvailableWorkouts = async (): Promise<Workout[]> => {
    try {
      const response = await fetch('http://192.168.0.176:8000/api/workouts/');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      return data.map((workout: any) => ({
        id: workout.id,
        title: workout.title,
        image: require('../../assets/current_workout.png'),
        duration: `${workout.duration} мин`,
        calories: workout.calories,
        exercises: workout.exercises.map((exercise: any) => ({
          name: exercise.name,
          duration: exercise.duration,
          videoUrl: exercise.video_url
        }))
      }));
    } catch (error) {
      console.error('Ошибка при загрузке тренировок:', error);
      return [];
    }
  };

  const fetchCategories = async () => {
    try {
      setCategories([
        {
          id: '1',
          title: 'ОФИСНАЯ ЙОГА',
          image: require('../../assets/office.png'),
          url: 'office_yoga'
        },
        {
          id: '2',
          title: 'ЗДОРОВАЯ СПИНА',
          image: require('../../assets/back.png'),
          url: 'healthy_back'
        },
        {
          id: '3',
          title: 'СИЛОВАЯ ЙОГА',
          image: require('../../assets/power.png'),
          url: 'power_yoga'
        },
        {
          id: '4',
          title: 'РАСТЯЖКА и ГИБКОСТЬ',
          image: require('../../assets/stretch.png'),
          url: 'stretching'
        },
        {
          id: '5',
          title: 'РАСТЯЖКА ДЛЯ\nТЕЛА И УМА',
          image: require('../../assets/beginner.png'),
          url: 'beginners'
        },
        {
          id: '6',
          title: 'ВОССТАНАВЛИВАЮЩАЯ ЙОГА',
          image: require('../../assets/recovery.png'),
          url: 'restorative'
        },
        {
          id: '7',
          title: 'МЕДИТАТИВНАЯ ЙОГА',
          image: require('../../assets/meditation.png'),
          url: 'meditative'
        },
        {
          id: '8',
          title: 'ЙОГА ДЛЯ УЛУЧШЕНИЯ СНА',
          image: require('../../assets/sleep.png'),
          url: 'sleep'
        },
        {
          id: '9',
          title: 'ДИНАМИЧНАЯ ЙОГА',
          image: require('../../assets/dinamic.png'),
          url: 'dynamic'
        },
        {
          id: '10',
          title: 'КЛАССИЧЕСКАЯ ХАТХА ЙОГА',
          image: require('../../assets/yoga.png'),
          url: 'classical'
        },
      ]);
    } catch (error) {
      console.error('Ошибка при загрузке категорий:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = async (category: Category) => {
    const apiUrl = `http://192.168.0.176:8000/api/lessons/category/${category.url}/`;
    console.log('Attempting API request to:', apiUrl);

    try {
      console.log('Sending request...');
      const response = await fetch(apiUrl);
      console.log('Response received:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        let errorMessage = '';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || 'Неизвестная ошибка';
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          errorMessage = `Ошибка сервера: ${response.status} ${response.statusText}`;
        }

        console.error('Ошибка API:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          message: errorMessage
        });

        Alert.alert(
          'Ошибка при загрузке уроков',
          `${errorMessage}\n\nStatus: ${response.status}\nURL: ${apiUrl}`
        );
        return;
      }

      console.log('Parsing response data...');
      const data = await response.json();
      console.log('Received lessons data:', JSON.stringify(data, null, 2));

      navigation.navigate('CategoryScreen', {
        categoryId: category.url,
        categoryTitle: category.title,
        lessons: data
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';

      console.error('Ошибка сети:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: errorMessage,
        url: apiUrl,
        error: error
      });

      Alert.alert(
        'Ошибка сети',
        `Не удалось подключиться к серверу:\n${errorMessage}\n\nURL: ${apiUrl}\n\nПроверьте:\n1. Подключение к интернету\n2. Сервер запущен\n3. Устройство и сервер в одной сети\n4. Правильность IP адреса`
      );
    }
  };

  const handlePreviousDay = () => {
    if (currentDay > 1) {
      setCurrentDay(prev => prev - 1);
    }
  };

  const handleNextDay = () => {
    if (currentDay < 30) {
      setCurrentDay(prev => prev + 1);
    }
  };

  const handleWorkoutPress = () => {
    if (!currentWorkout) return;

    if (currentDay > 1) {
      Alert.alert(
        'Урок недоступен',
        `Этот урок будет доступен на ${currentDay} день. Продолжайте тренировки, чтобы открыть новые уроки!`,
        [{ text: 'Понятно' }]
      );
      return;
    }
    // @ts-ignore - Navigation type needs to be updated in navigationTypes.ts
    navigation.navigate('WorkoutDetails', { workoutId: currentWorkout.id });
  };

  const renderCurrentWorkout = () => {
    if (!currentWorkout) return null;

    return (
      <View>
        <View style={styles.topBar}>
          <View style={styles.dayContainer}>
            <TouchableOpacity onPress={handlePreviousDay}>
              <Text style={[styles.arrow, currentDay === 1 && styles.disabledArrow]}>◀</Text>
            </TouchableOpacity>
            <Text style={styles.dayText}>ДЕНЬ {currentDay}</Text>
            <TouchableOpacity onPress={handleNextDay}>
              <Text style={[styles.arrow, currentDay === 30 && styles.disabledArrow]}>▶</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.planContainer}>
            <Text style={styles.planText}>твой план</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.currentWorkoutCard}
          onPress={handleWorkoutPress}
        >
          <ImageBackground
            source={currentWorkout.image}
            style={styles.currentWorkoutImage}
            imageStyle={styles.currentWorkoutImageStyle}
            resizeMode="cover"
          >
            <View style={[styles.currentWorkoutContent, styles.overlay]}>
              <Text style={styles.workoutTitle}>{currentWorkout.title}</Text>
              <View style={styles.workoutInfoContainer}>
                <View style={styles.workoutInfoItem}>
                  <Text style={styles.workoutInfoText}>{currentWorkout.duration}</Text>
                </View>
                <View style={styles.workoutInfoItem}>
                  <Text style={styles.workoutInfoText}>{currentWorkout.calories} ккал</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.playButton}
                onPress={handleWorkoutPress}
              >
                <Text style={styles.playButtonText}>▶</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => handleCategoryPress(item)}
    >
      <ImageBackground
        source={item.image}
        style={styles.categoryImage}
        imageStyle={styles.categoryImageStyle}
        resizeMode="cover"
      >
        <View style={[styles.categoryTitleContainer, styles.overlay]}>
          <Text style={styles.categoryTitle}>{item.title}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Загрузка...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Привет, {userName}</Text>
      {renderCurrentWorkout()}
      <Text style={styles.sectionTitle}>Популярные практики</Text>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        numColumns={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECE9E4',
    padding: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    fontFamily: 'Lora',
  },
  currentWorkoutCard: {
    height: 240,
    marginBottom: 24,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  currentWorkoutImage: {
    width: '100%',
    height: '100%',
  },
  currentWorkoutImageStyle: {
    borderRadius: 12,
  },
  currentWorkoutContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: 50,
    borderTopLeftRadius: 12,
    paddingLeft: 10,
    borderTopRightRadius: 12,
  },
  dayContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  arrow: {
    color: '#333',
    fontSize: 12,
  },
  disabledArrow: {
    color: '#999',
  },
  dayText: {
    color: '#333',
    fontWeight: '600',
    fontFamily: 'Lora',
    fontSize: 16,
  },
  planContainer: {
    height: 50,
    backgroundColor: 'rgba(128, 128, 128, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    alignItems: 'center',
  },
  planText: {
    color: '#333',
    fontWeight: '600',
    fontFamily: 'Lora',
  },
  workoutTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    fontFamily: 'Lora',
    marginBottom: 8,
  },
  workoutInfoContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  workoutInfoItem: {
    backgroundColor: 'rgba(128, 128, 128, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  workoutInfoText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
    fontFamily: 'Lora',
  },
  playButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#87D0B2',
    width: 60,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  playButtonText: {
    marginBottom: 0,
    position: 'absolute',
    top: -4,
    left: 16,
    color: '#ffffff',
    fontSize: 30,
    fontFamily: 'Lora',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
    fontFamily: 'Lora',
  },
  listContainer: {
    paddingBottom: 16,
  },
  categoryCard: {
    flex: 1,
    height: 160,
    margin: 4,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryImageStyle: {
    borderRadius: 12,
  },
  categoryTitleContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 8,
  },
  categoryTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    fontFamily: 'Lora',
  },
});

export default HomeScreen;
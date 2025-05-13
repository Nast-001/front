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

const DAILY_WORKOUTS = [
  {
    id: '1',
    title: 'РАСТЯЖКА ДЛЯ\nТЕЛА И УМА',
    image: require('../../assets/current_workout.png'),
    duration: '15 мин',
    calories: 150,
    exercises: [
      { 
        name: 'Наклоны вперед', 
        duration: 60,
        videoUrl: 'https://example.com/video1.mp4'
      },
      { 
        name: 'Поза бабочки', 
        duration: 90,
        videoUrl: 'https://example.com/video2.mp4'
      },
      { 
        name: 'Скручивания позвоночника', 
        duration: 60,
        videoUrl: 'https://example.com/video3.mp4'
      },
    ]
  },
  {
    id: '2',
    title: 'СИЛОВАЯ ЙОГА',
    image: require('../../assets/current_workout.png'),
    duration: '30 мин',
    calories: 180,
    exercises: [
      { 
        name: 'Поза собаки', 
        duration: 60,
        videoUrl: 'https://example.com/video4.mp4'
      },
      { 
        name: 'Поза кошки', 
        duration: 60,
        videoUrl: 'https://example.com/video5.mp4'
      },
      { 
        name: 'Поза воина', 
        duration: 90,
        videoUrl: 'https://example.com/video6.mp4'
      },
    ]
  },
  {
    id: '3',
    title: 'ВОССТАНАВЛИВАЮЩАЯ ЙОГА',
    image: require('../../assets/current_workout.png'),
    duration: '45 мин',
    calories: 250,
    exercises: [
      { 
        name: 'Приседания', 
        duration: 60,
        videoUrl: 'https://rutube.ru/video/15ad6bb57e98b55e3a3d011a9bbbda7d/?r=wd'
      },
      { 
        name: 'Отжимания', 
        duration: 45,
        videoUrl: 'https://rutube.ru/video/15ad6bb57e98b55e3a3d011a9bbbda7d/?r=wd'
      },
      { 
        name: 'Планка', 
        duration: 60,
        videoUrl: 'https://rutube.ru/video/15ad6bb57e98b55e3a3d011a9bbbda7d/?r=wd'
      },
    ]
  },
];

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Настя');
  const [currentWorkout, setCurrentWorkout] = useState(DAILY_WORKOUTS[0]);
  const [currentDay, setCurrentDay] = useState(1);

  useEffect(() => {
    fetchCategories();
    // Выбираем тренировку для первого дня
    setCurrentWorkout(DAILY_WORKOUTS[0]);
  }, []);

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
      
      // Проверяем каждый урок
      data.forEach((lesson: any, index: number) => {
        console.log(`Lesson ${index + 1}:`, {
          id: lesson.id,
          title: lesson.title,
          video_file: lesson.video_file,
          preview_image: lesson.preview_image
        });
        
        // Проверяем доступность видео
        fetch(lesson.video_file)
          .then(response => {
            console.log(`Video ${index + 1} status:`, response.status);
            console.log(`Video ${index + 1} headers:`, response.headers);
          })
          .catch(error => {
            console.error(`Error checking video ${index + 1}:`, error);
          });

        // Проверяем доступность превью
        const encodedPreviewUrl = encodeURI(lesson.preview_image);
        fetch(encodedPreviewUrl)
          .then(response => {
            console.log(`Preview ${index + 1} status:`, response.status);
            console.log(`Preview ${index + 1} headers:`, response.headers);
            console.log(`Preview ${index + 1} URL:`, encodedPreviewUrl);
          })
          .catch(error => {
            console.error(`Error checking preview ${index + 1}:`, error);
            console.error(`Failed URL:`, encodedPreviewUrl);
          });
      });
      
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
      // При переходе на предыдущий день меняем тренировку
      setCurrentWorkout(DAILY_WORKOUTS[(currentDay - 2) % DAILY_WORKOUTS.length]);
    }
  };

  const handleNextDay = () => {
    if (currentDay < 30) {
      setCurrentDay(prev => prev + 1);
      // При переходе на следующий день меняем тренировку
      setCurrentWorkout(DAILY_WORKOUTS[currentDay % DAILY_WORKOUTS.length]);
    }
  };

  const handleWorkoutPress = () => {
    if (currentDay > 1) {
      Alert.alert(
        'Урок недоступен',
        `Этот урок будет доступен на ${currentDay} день. Продолжайте тренировки, чтобы открыть новые уроки!`,
        [{ text: 'Понятно' }]
      );
      return;
    }
    navigation.navigate('WorkoutDetails', { workout: currentWorkout });
  };

  const renderCurrentWorkout = () => (
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
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MainTabParamList } from '../navigationTypes';
import { Lesson } from '../types';

type CategoryScreenRouteProp = RouteProp<MainTabParamList, 'CategoryScreen'>;
type CategoryScreenNavigationProp = StackNavigationProp<MainTabParamList>;

const BASE_URL = 'http://192.168.0.176:8000';

const CategoryScreen = () => {
  const route = useRoute<CategoryScreenRouteProp>();
  const navigation = useNavigation<CategoryScreenNavigationProp>();
  const { categoryId, categoryTitle, lessons } = route.params;

  const getCategoryDescription = (categoryId: string) => {
    switch (categoryId) {
      case 'office_yoga':
        return 'Офисная йога — это ваш личный оазис спокойствия в мире работы и забот. Простые и эффективные упражнения помогут снять напряжение, улучшить осанку и восстановить концентрацию прямо на рабочем месте.';
      case 'healthy_back':
        return 'Здоровая спина — основа вашего благополучия. Наши практики помогут укрепить мышцы спины, улучшить осанку и избавиться от дискомфорта, вызванного сидячим образом жизни.';
      case 'power_yoga':
        return 'Силовая йога — это динамичная практика, сочетающая силу и гибкость. Интенсивные асаны помогут укрепить мышцы, улучшить выносливость и зарядиться энергией.';
      case 'stretching':
        return 'Растяжка и гибкость — ключ к свободе движения. Плавные и глубокие практики помогут развить гибкость, снять мышечное напряжение и улучшить подвижность суставов.';
      case 'beginners':
        return 'Йога для начинающих — идеальный старт вашего путешествия в мир йоги. Простые и доступные практики помогут освоить базовые асаны и научиться правильному дыханию.';
      case 'restorative':
        return 'Восстанавливающая йога — мягкая практика для глубокого расслабления. Спокойные асаны и медитации помогут снять стресс, восстановить силы и обрести внутреннее равновесие.';
      case 'meditative':
        return 'Медитативная йога — путь к внутренней гармонии. Сочетание мягких асан и медитаций поможет успокоить ум, снять тревожность и развить осознанность.';
      case 'sleep':
        return 'Йога для улучшения сна — нежная вечерняя практика. Расслабляющие асаны и дыхательные техники помогут снять напряжение дня и подготовиться к спокойному сну.';
      case 'dynamic':
        return 'Динамичная йога — энергичная практика для активных людей. Быстрые связки асан помогут развить силу, выносливость и координацию, зарядиться бодростью на весь день.';
      case 'classical':
        return 'Классическая хатха йога — традиционная практика для тела и ума. Гармоничное сочетание асан, пранаям и медитаций поможет достичь баланса физического и ментального здоровья.';
      default:
        return '';
    }
  };

  const getCategoryImage = (categoryId: string) => {
    switch (categoryId) {
      case 'office_yoga':
        return require('../../assets/office.png');
      case 'healthy_back':
        return require('../../assets/back.png');
      case 'power_yoga':
        return require('../../assets/power.png');
      case 'stretching':
        return require('../../assets/stretch.png');
      case 'beginners':
        return require('../../assets/beginner.png');
      case 'restorative':
        return require('../../assets/recovery.png');
      case 'meditative':
        return require('../../assets/meditation.png');
      case 'sleep':
        return require('../../assets/sleep.png');
      case 'dynamic':
        return require('../../assets/dinamic.png');
      case 'classical':
        return require('../../assets/yoga.png');
      default:
        return require('../../assets/yoga.png');
    }
  };

  console.log('Category ID:', categoryId);
  console.log('Category Title:', categoryTitle);
  console.log('Category Description:', getCategoryDescription(categoryId));
  console.log('Category Image:', getCategoryImage(categoryId));

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 
      ? `${hours} ч ${mins} мин`
      : `${mins} мин`;
  };

  const renderLessonItem = ({ item }: { item: Lesson }) => {
    const previewUrl = `${BASE_URL}${item.preview_image}`;

    return (
      <TouchableOpacity 
        style={styles.lessonCard}
        onPress={() => {
          console.log('Lesson data:', item);
          navigation.navigate('LessonScreen', { lesson: item });
        }}
      >
        <View style={styles.lessonImageContainer}>
          <Image
            source={{ uri: previewUrl }}
            style={styles.lessonImage}
            resizeMode="cover"
            defaultSource={require('../../assets/default-avatar.png')}
          />
        </View>
        <View style={styles.lessonContent}>
          <Text style={styles.lessonTitle} numberOfLines={2}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topImageContainer}>
        <View style={styles.imageWrapper}>
          <Image
            source={getCategoryImage(categoryId)}
            style={styles.topImage}
            resizeMode="cover"
          />
        </View>
        <View style={[styles.overlay, styles.topImageOverlay]}>
          <Text style={styles.categoryHeaderTitle}>{categoryTitle}</Text>
        </View>
      </View>
      
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>
          {getCategoryDescription(categoryId)}
        </Text>
      </View>

      <FlatList
        data={lessons}
        renderItem={renderLessonItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topImageContainer: {
    height: 200,
    width: '100%',
    backgroundColor: '#f0f0f0',
  },
  imageWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topImage: {
    width: '100%',
    height: '100%',
  },
  topImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  categoryHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    textAlign: 'center',
    fontFamily: 'Lora',
  },
  descriptionContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666666',
    textAlign: 'center',
    fontFamily: 'Lora',
  },
  listContainer: {
    padding: 16,
  },
  lessonCard: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 80,
  },
  lessonImageContainer: {
    width: 80,
    height: 80,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    overflow: 'hidden',
  },
  lessonImage: {
    width: '100%',
    height: '100%',
  },
  lessonContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    lineHeight: 22,
    fontFamily: 'Lora',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});

export default CategoryScreen; 
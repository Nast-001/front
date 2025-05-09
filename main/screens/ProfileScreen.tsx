import { Feather } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, Dimensions, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { LineChart } from 'react-native-chart-kit';
import { Circle as SvgCircle, Svg as SvgComponent } from 'react-native-svg';

type RootStackParamList = {
  Achievements: { date: string };
  Settings: undefined;
  CreateWorkout: undefined;
  LastLesson: undefined;
  FavoriteLessonsScreen: undefined;
};

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
}

type MarkedDatesType = {
  [key: string]: {
    selected?: boolean;
    selectedColor?: string;
    disabled?: boolean;
    disableTouchEvent?: boolean;
  };
};

const CustomProgress = ({ value, maxValue, title, color }: { value: number; maxValue: number; title: string; color: string }) => {
  const radius = 40;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / maxValue) * circumference;

  return (
    <View style={styles.progressItem}>
      <SvgComponent width={radius * 2} height={radius * 2}>
        <SvgCircle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          stroke="#f0f0f0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <SvgCircle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${progress} ${circumference}`}
          transform={`rotate(-90 ${radius} ${radius})`}
        />
      </SvgComponent>
      <Text style={[styles.progressValue, { color }]}>{value}</Text>
      <Text style={styles.progressTitle}>{title}</Text>
    </View>
  );
};

const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  const [activeTab, setActiveTab] = useState<'all' | 'week' | 'month' | 'year'>('all');
  const [weights, setWeights] = useState({
    start: 55,
    current: 52,
    history: [55, 52]
  });
  const [isModalVisible, setModalVisible] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [avatarError, setAvatarError] = useState(false);
  
  const statsData = {
    statworkouts: { all: 49, week: 6, month: 14, year: 48 },
    statminutes: { all: 1960, week: 240, month: 560, year: 1920 },
    statcalories: { all: 8820, week: 1080, month: 2520, year: 8640 }
  };

  const [stats] = useState({
    workouts: { all: 1, week: 1, month: 1, year: 1 },
    calories: { all: 174, week: 174, month: 174, year: 174 },
    minutes: { all: 15, week: 15, month: 15, year: 15 }
  });

  const calculateDifference = () => {
    return weights.current - weights.start;
  };

  const addNewWeight = () => {
    setModalVisible(true);
  };

  const handleAddWeight = () => {
    const weightValue = parseFloat(newWeight);
    if (!isNaN(weightValue) && weightValue >= 30 && weightValue <= 100) {
      setWeights(prev => ({
        ...prev,
        current: weightValue,
        history: [...prev.history, weightValue]
      }));
      setModalVisible(false);
      setNewWeight('');
    } else {
      Alert.alert('Ошибка', 'Пожалуйста, введите вес от 30 до 100 кг');
    }
  };

  const chartData = {
    labels: ['Февраль 2025', '', '', 'Март 2025'],
    datasets: [
      {
        data: weights.history
      }
    ],
    min: 30,
    max: 100
  };

  const today = new Date();
  const april8 = new Date(2025, 3, 8); 
  const april10 = new Date(2025, 3, 10);

  const getDateStatus = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const april8Str = '2025-04-08';
    const april10Str = '2025-04-10';

    if (dateStr === april8Str) return 'completed';
    if (dateStr === april10Str) return 'completed';
    if (dateStr < april8Str) return 'inactive';
    if (dateStr > april10Str) return 'future';
    return 'missed';
  };

  const handleDayPress = (day: any) => {
    const selectedDate = new Date(day.dateString);
    const status = getDateStatus(selectedDate);

    console.log('Selected date:', day.dateString, 'Status:', status);

    switch (status) {
      case 'completed':
        console.log('Navigating to Achievements with date:', day.dateString);
        navigation.getParent()?.navigate('Achievements', { date: day.dateString });
        break;
      case 'inactive':
        alert('Вы в этот день не тренировались');
        break;
      case 'future':
        alert('Этот день еще не прошел');
        break;
      case 'missed':
        alert('Вы в этот день не тренировались');
        break;
    }
  };

  const markedDates: MarkedDatesType = {
    '2025-04-08': {
      selected: true,
      selectedColor: '#2d4150',
    },
    '2025-04-10': {
      selected: true,
      selectedColor: '#2d4150',
    },
  };

  // Добавляем серые даты до 8 апреля
  for (let i = 1; i <= 7; i++) {
    const date = `2025-04-${String(i).padStart(2, '0')}`;
    markedDates[date] = {
      disabled: true,
      disableTouchEvent: false,
    };
  }

  // Добавляем серую дату для 9 апреля
  markedDates['2025-04-09'] = {
    disabled: true,
    disableTouchEvent: false,
  };

  const renderTabButton = (title: string, key: 'all' | 'week' | 'month' | 'year') => (
    <TouchableOpacity 
      style={[styles.tabButton, activeTab === key && styles.activeTabButton]}
      onPress={() => setActiveTab(key)}
    >
      <Text style={[styles.tabText, activeTab === key && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/background.png')} style={styles.backgroundImage} />
        </View>
        <View style={styles.profileSection}>
          <Image 
            source={avatarError ? require('../../assets/default-avatar.png') : { uri: 'https://via.placeholder.com/100' }}
            style={styles.avatar}
            onError={() => setAvatarError(true)}
          />
        </View>
        
    
      <View style={styles.contentContainer}>
      <View style={styles.iconsContainer}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => navigation.navigate('LastLesson')}
          >
            <Feather name="clock" size={24} color="#2d4150" />
            <Text style={styles.iconText}>История</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('CreateWorkout')}>
            <Feather name="plus" size={24} color="#2d4150" />
            <Text style={styles.iconText}>Индивидуальное</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => navigation.navigate('FavoriteLessonsScreen')}
          >
            <Feather name="heart" size={24} color="#2d4150" />
            <Text style={styles.iconText}>Избранное</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Feather name="settings" size={24} color="#2d4150" />
            <Text style={styles.iconText}>Настройки</Text>
          </TouchableOpacity>
        </View>
        {/* Круговые диаграммы */}
        <View style={styles.progressContainer}>
          <CustomProgress
            value={stats.workouts[activeTab]}
            maxValue={1}
            title="Тренировки"
            color="#87D0B2"
          />
          <CustomProgress
            value={stats.minutes[activeTab]}
            maxValue={60}
            title="Минуты"
            color="#FAE596"
          />
           <CustomProgress
            value={stats.calories[activeTab]}
            maxValue={300}
            title="Калории"
            color="#B2D5F0"
          />
        </View>

        {/* Табы периодов */}
        <View style={styles.tabContainer}>
          {renderTabButton('Все', 'all')}
          {renderTabButton('Неделя', 'week')}
          {renderTabButton('Месяц', 'month')}
          {renderTabButton('Год', 'year')}
          
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{statsData.statworkouts[activeTab]}</Text>
            <Text style={styles.statLabel}>Тренировка</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{statsData.statminutes[activeTab]}</Text>
            <Text style={styles.statLabel}>Минут</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{statsData.statcalories[activeTab]}</Text>
            <Text style={styles.statLabel}>Калории</Text>
          </View>
        </View>
        {/* Календарь */}
        <Calendar
          style={styles.calendar}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#2d4150',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#2d4150',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: '#00adf5',
            selectedDotColor: '#ffffff',
            arrowColor: '#2d4150',
            monthTextColor: '#2d4150',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 14,
          }}
          markedDates={markedDates}
          onDayPress={handleDayPress}
          hideExtraDays={true}
        />

        {/* Информация о весе */}
        <View style={styles.weightContainer}>
          <View style={styles.weightItem}>
            <Text style={styles.weightValue}>{weights.start} кг</Text>
            <Text style={styles.weightLabel}>Начало</Text>
          </View>
          <View style={styles.weightItem}>
            <Text style={styles.weightValue}>{weights.current} кг</Text>
            <Text style={styles.weightLabel}>Сейчас</Text>
          </View>
          <View style={styles.weightItem}>
            <Text style={[
              styles.weightValue, 
              { color: calculateDifference() < 0 ? '#27ae60' : '#e74c3c' }
            ]}>{calculateDifference() > 0 ? '+' : ''}{calculateDifference()} кг</Text>
            <Text style={styles.weightLabel}>Разница</Text>
          </View>
        </View>

        {/* График */}
        <View style={styles.chartContainer}>
          <LineChart
            data={chartData}
            width={Dimensions.get('window').width - 32}
            height={250}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(135,208,178, ${opacity})`,
              style: {
                borderRadius: 16,
              }
            }}
            bezier
            style={styles.chart}
          />
          <TouchableOpacity style={styles.addWeightButton} onPress={addNewWeight}>
            <Text style={styles.addWeightButtonText}>Добавить вес</Text>
          </TouchableOpacity>
        </View>
        

        {/* Модальное окно для ввода веса */}
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Введите новый вес</Text>
              <TextInput
                style={styles.weightInput}
                keyboardType="numeric"
                value={newWeight}
                onChangeText={setNewWeight}
                placeholder="Вес (кг)"
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]} 
                  onPress={() => {
                    setModalVisible(false);
                    setNewWeight('');
                  }}
                >
                  <Text style={styles.modalButtonText}>Отмена</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.addButton]} 
                  onPress={handleAddWeight}
                >
                  <Text style={styles.modalButtonText}>Добавить</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECE9E4',
  },
  contentContainer: {
    padding: 15,
  },
  header: {
    marginBottom: 10,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: 200,
    marginTop: 0,
    marginBottom: 0,
  },
  profileSection: {
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  iconsContainer: {
    marginTop: 0,
    marginBottom: 10,
    borderRadius: 15,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  iconButton: {
    alignItems: 'center',
    padding: 8,
  },
  iconText: {
    fontSize: 12,
    color: '#2d4150',
    marginTop: 4,
    fontFamily: 'Lora',
  },
  statsContainer: {
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#ECE9E4',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d4150',
    marginBottom: 4,
    fontFamily: 'Lora',
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    fontFamily: 'Lora',
  },
  progressContainer: {
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#ffffff',
  },
  progressItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  tabContainer: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tabButton: {
    borderWidth: 0.3,
    borderColor: 'black',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeTabButton: {
    backgroundColor: 'white',
  },
  tabText: {
    color: 'black',
    fontSize: 14,
    fontFamily: 'Lora',
  },
  activeTabText: {
    color: 'black',
    fontFamily: 'Lora',
  },
  calendar: {
    marginVertical: 16,
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  weightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  weightItem: {
    alignItems: 'center',
  },
  weightLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
    fontFamily: 'Lora',
  },
  weightValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d4150',
    fontFamily: 'Lora',
  },
  chartContainer: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginBottom: 30,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  progressValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    fontFamily: 'Lora',
  },
  progressTitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
    fontFamily: 'Lora',
  },
  addWeightButton: {
    marginBottom: 15,
    width: 200,
    height: 50,
    backgroundColor: '#DDDDDD',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addWeightButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Lora',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Lora',
  },
  weightInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
  },
  addButton: {
    backgroundColor: '#2d4150',
  },
  modalButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'Lora',
  },
});

export default ProfileScreen;
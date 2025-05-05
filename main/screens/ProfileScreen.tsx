import { Feather } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { LineChart } from 'react-native-chart-kit';
import { Circle as SvgCircle, Svg as SvgComponent } from 'react-native-svg';

type RootStackParamList = {
  Achievements: { date: string };
  Settings: undefined;
  CreateWorkout: undefined;
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
  const [stats] = useState({
    workouts: { all: 150, week: 5, month: 20, year: 150 },
    calories: { all: 12500, week: 2500, month: 8000, year: 12500 },
    minutes: { all: 1800, week: 300, month: 900, year: 1800 }
  });

  const chartData = {
    labels: ['Янв', 'Фев', 'Мар'],
    datasets: [
      {
        data: [55, 52, 48]
      }
    ]
  };

  const today = new Date();
  const april8 = new Date(2025, 3, 8); // Месяцы начинаются с 0
  const april10 = new Date(2025, 3, 10);

  const getDateStatus = (date: Date) => {
    // Преобразуем даты в строки формата YYYY-MM-DD для сравнения
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
      {/* Профиль и иконки */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/100' }}
            style={styles.avatar}
          />
        </View>
        <View style={styles.iconsContainer}>
          <Feather name="clock" size={24} color="#2d4150" />
          <TouchableOpacity onPress={() => navigation.navigate('CreateWorkout')}>
            <Feather name="user" size={24} color="#2d4150" />
          </TouchableOpacity>
          <Feather name="star" size={24} color="#2d4150" />
          <TouchableOpacity 
            style={styles.statItem}
            onPress={() => navigation.navigate('Settings')}
          >
            <Feather name="settings" size={24} color="#2d4150" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Круговые диаграммы */}
      <View style={styles.progressContainer}>
        <CustomProgress
          value={stats.workouts[activeTab]}
          maxValue={200}
          title="Тренировки"
          color="#2d4150"
        />
        <CustomProgress
          value={stats.calories[activeTab]}
          maxValue={15000}
          title="Калории"
          color="#2d4150"
        />
        <CustomProgress
          value={stats.minutes[activeTab]}
          maxValue={2000}
          title="Минуты"
          color="#2d4150"
        />
      </View>

      {/* Табы периодов */}
      <View style={styles.tabContainer}>
        {renderTabButton('Все', 'all')}
        {renderTabButton('Неделя', 'week')}
        {renderTabButton('Месяц', 'month')}
        {renderTabButton('Год', 'year')}
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
          <Text style={styles.weightLabel}>Начало</Text>
          <Text style={styles.weightValue}>75 кг</Text>
        </View>
        <View style={styles.weightItem}>
          <Text style={styles.weightLabel}>Сейчас</Text>
          <Text style={styles.weightValue}>70 кг</Text>
        </View>
        <View style={styles.weightItem}>
          <Text style={styles.weightLabel}>Разница</Text>
          <Text style={[styles.weightValue, { color: '#27ae60' }]}>-5 кг</Text>
        </View>
      </View>

      {/* График */}
      <View style={styles.chartContainer}>
        <LineChart
          data={{
            labels: chartData.labels,
            datasets: chartData.datasets
          }}
          width={Dimensions.get('window').width - 32}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 173, 245, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 16,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  progressContainer: {
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeTabButton: {
    backgroundColor: '#00adf5',
  },
  tabText: {
    color: '#7f8c8d',
    fontSize: 14,
  },
  activeTabText: {
    color: '#ffffff',
  },
  calendar: {
    marginVertical: 16,
    borderRadius: 10,
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
    marginBottom: 16,
  },
  weightItem: {
    alignItems: 'center',
  },
  weightLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  weightValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  chartContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statItem: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 16,
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  progressValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  progressTitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
});

export default ProfileScreen;
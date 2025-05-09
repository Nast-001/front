import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';

type WorkoutVideo = {
  id: string;
  title: string;
  description: string;
  duration: number;
  calories: number;
  thumbnailUrl: string;
  videoUrl: string;
};

type WorkoutSettings = {
  name: string;
  restTime: number;
  poseTime: number;
  setRestTime: number;
  sets: number;
};

const SAMPLE_VIDEOS: WorkoutVideo[] = [
  {
    id: '1',
    title: 'Разминка всего тела',
    description: 'Комплексная разминка для подготовки к тренировке',
    duration: 300,
    calories: 50,
    thumbnailUrl: 'https://via.placeholder.com/150',
    videoUrl: 'https://example.com/video1',
  },
  {
    id: '2',
    title: 'Силовая тренировка',
    description: 'Упражнения для развития силы мышц',
    duration: 600,
    calories: 150,
    thumbnailUrl: 'https://via.placeholder.com/150',
    videoUrl: 'https://example.com/video2',
  },
  {
    id: '3',
    title: 'Кардио интервалы',
    description: 'Интенсивная кардио тренировка',
    duration: 450,
    calories: 200,
    thumbnailUrl: 'https://via.placeholder.com/150',
    videoUrl: 'https://example.com/video3',
  },
  {
    id: '4',
    title: 'Растяжка',
    description: 'Комплекс упражнений для растяжки',
    duration: 400,
    calories: 80,
    thumbnailUrl: 'https://via.placeholder.com/150',
    videoUrl: 'https://example.com/video4',
  },
  {
    id: '5',
    title: 'Йога для начинающих',
    description: 'Базовые асаны и дыхательные упражнения',
    duration: 500,
    calories: 100,
    thumbnailUrl: 'https://via.placeholder.com/150',
    videoUrl: 'https://example.com/video5',
  },
];

const CreateWorkoutScreen = () => {
  const [step, setStep] = useState(0);
  const [selectedVideos, setSelectedVideos] = useState<WorkoutVideo[]>([]);
  const [settings, setSettings] = useState<WorkoutSettings>({
    name: '',
    restTime: 30,
    poseTime: 40,
    setRestTime: 60,
    sets: 1,
  });
  const [savedWorkouts, setSavedWorkouts] = useState<Array<{ name: string; videos: WorkoutVideo[]; settings: WorkoutSettings }>>([]);

  const handleVideoSelect = (video: WorkoutVideo) => {
    if (selectedVideos.find(v => v.id === video.id)) {
      setSelectedVideos(selectedVideos.filter(v => v.id !== video.id));
    } else {
      setSelectedVideos([...selectedVideos, video]);
    }
  };

  const calculateTotalTime = () => {
    const videosTime = selectedVideos.reduce((acc, video) => acc + video.duration, 0);
    const totalRestTime = (selectedVideos.length - 1) * settings.restTime;
    const totalPoseTime = selectedVideos.length * settings.poseTime;
    const totalSetRestTime = (settings.sets - 1) * settings.setRestTime;
    return (videosTime + totalRestTime + totalPoseTime + totalSetRestTime) * settings.sets;
  };

  const calculateTotalCalories = () => {
    return selectedVideos.reduce((acc, video) => acc + video.calories, 0) * settings.sets;
  };

  const renderStep0 = () => (
    <View style={styles.centerContainer}>
      {savedWorkouts.length === 0 ? (
        <>
          <TouchableOpacity style={styles.plusButton} onPress={() => setStep(1)}>
            <Feather name="plus" size={48} color="black" backgroundColor = "#ECE9E4" />
          </TouchableOpacity>
          <Text style={styles.plusButtonText}>Создай свою индивидуальную тренировку из любимых асан</Text>
        </>
      ) : (
        <View style={styles.workoutsContainer}>
          <ScrollView style={styles.savedWorkoutsList}>
            {savedWorkouts.map((workout, index) => (
              <View key={index} style={styles.savedWorkout}>
                <Text style={styles.savedWorkoutTitle}>{workout.name}</Text>
                <Text style={styles.savedWorkoutDetails}>
                  {workout.videos.length} упражнений • {Math.floor(calculateTotalTime() / 60)} мин
                </Text>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity 
            style={styles.smallPlusButton} 
            onPress={() => setStep(1)}
          >
            <Feather name="plus" size={24} color="black" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.container}>
      <Text style={styles.stepIndicator}>Шаг 1/3</Text>
      <ScrollView>
        {SAMPLE_VIDEOS.map((video) => (
          <TouchableOpacity
            key={video.id}
            style={[
              styles.videoCard,
              selectedVideos.find(v => v.id === video.id) && styles.videoCardSelected
            ]}
            onPress={() => handleVideoSelect(video)}
          >
            <Image source={{ uri: video.thumbnailUrl }} style={styles.thumbnail} />
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle}>{video.title}</Text>
              <Text style={styles.videoDuration}>{Math.floor(video.duration / 60)} мин</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={[styles.continueButton, selectedVideos.length === 0 && styles.continueButtonDisabled]}
        onPress={() => selectedVideos.length > 0 && setStep(2)}
        disabled={selectedVideos.length === 0}
      >
        <Text style={styles.continueButtonText}>Продолжить</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.container}>
      <Text style={styles.stepIndicator}>Шаг 2/3</Text>
      <DraggableFlatList<WorkoutVideo>
        data={selectedVideos}
        onDragEnd={({ data }) => setSelectedVideos(data)}
        keyExtractor={(item: WorkoutVideo) => item.id}
        renderItem={({ item, drag, isActive }: RenderItemParams<WorkoutVideo>) => (
          <ScaleDecorator>
            <TouchableOpacity
              style={[styles.videoCard, isActive && styles.videoCardDragging]}
              onLongPress={drag}
              delayLongPress={200}
            >
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => setSelectedVideos(selectedVideos.filter(v => v.id !== item.id))}
              >
                <Feather name="minus-circle" size={24} color="#ff4444" />
              </TouchableOpacity>
              <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} />
              <View style={styles.videoInfo}>
                <Text style={styles.videoTitle}>{item.title}</Text>
              </View>
              <View style={styles.dragHandle}>
                <Feather name="menu" size={24} color="#666" />
              </View>
            </TouchableOpacity>
          </ScaleDecorator>
        )}
      />
      <TouchableOpacity
        style={[styles.continueButton, selectedVideos.length === 0 && styles.continueButtonDisabled]}
        onPress={() => selectedVideos.length > 0 && setStep(3)}
        disabled={selectedVideos.length === 0}
      >
        <Text style={styles.continueButtonText}>Продолжить</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep3 = () => (
    <ScrollView style={styles.container}>
      <Text style={styles.stepIndicator}>Шаг 3/3</Text>
      <View style={styles.settingsContainer}>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Название тренировки</Text>
          <TextInput
            style={styles.input}
            value={settings.name}
            onChangeText={(text) => setSettings({ ...settings, name: text })}
            placeholder="Введите название"
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Время отдыха (сек)</Text>
          <Picker
            selectedValue={settings.restTime}
            style={styles.picker}
            onValueChange={(value) => setSettings({ ...settings, restTime: value })}
          >
            {Array.from({ length: 9 }, (_, i) => (i + 1) * 10).map((value) => (
              <Picker.Item key={value} label={`${value} сек`} value={value} />
            ))}
          </Picker>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Время позы (сек)</Text>
          <Picker
            selectedValue={settings.poseTime}
            style={styles.picker}
            onValueChange={(value) => setSettings({ ...settings, poseTime: value })}
          >
            {Array.from({ length: 8 }, (_, i) => (i + 2) * 10).map((value) => (
              <Picker.Item key={value} label={`${value} сек`} value={value} />
            ))}
          </Picker>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Отдых между сетами (сек)</Text>
          <Picker
            selectedValue={settings.setRestTime}
            style={styles.picker}
            onValueChange={(value) => setSettings({ ...settings, setRestTime: value })}
          >
            {Array.from({ length: 16 }, (_, i) => (i + 3) * 10).map((value) => (
              <Picker.Item key={value} label={`${value} сек`} value={value} />
            ))}
          </Picker>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Количество сетов</Text>
          <Picker
            selectedValue={settings.sets}
            style={styles.picker}
            onValueChange={(value) => setSettings({ ...settings, sets: value })}
          >
            {Array.from({ length: 5 }, (_, i) => i + 1).map((value) => (
              <Picker.Item key={value} label={`${value}`} value={value} />
            ))}
          </Picker>
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Общее время:</Text>
            <Text style={styles.summaryValue}>
              {Math.floor(calculateTotalTime() / 60)} мин {calculateTotalTime() % 60} сек
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Калории:</Text>
            <Text style={styles.summaryValue}>{calculateTotalCalories()} ккал</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.continueButton, !settings.name && styles.continueButtonDisabled]}
        onPress={() => {
          if (settings.name) {
            setSavedWorkouts([...savedWorkouts, { name: settings.name, videos: selectedVideos, settings }]);
            setStep(0);
            setSelectedVideos([]);
            setSettings({
              name: '',
              restTime: 30,
              poseTime: 40,
              setRestTime: 60,
              sets: 1,
            });
          }
        }}
        disabled={!settings.name}
      >
        <Text style={styles.continueButtonText}>Сохранить тренировку</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {step === 0 && renderStep0()}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECE9E4',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#ECE9E4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ECE9E4',
    borderWidth: 3,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  plusButtonText: {
    opacity: 1,
    fontSize: 18,
    width: 300,
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
  },
  stepIndicator: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 16,
    color: '#2d4150',
  },
  videoCard: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  videoCardSelected: {
    backgroundColor: '#87D0B2',
    borderColor: '#27ae60',
    borderWidth: 1,
  },
  videoCardDragging: {
    opacity: 0.5,
    transform: [{ scale: 1.05 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  thumbnail: {
    width: 100,
    height: 70,
    borderRadius: 8,
  },
  videoInfo: {
    flex: 1,
    marginLeft: 12,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  videoDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  videoDuration: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  continueButton: {
    backgroundColor: '#00adf5',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#ccc',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    padding: 8,
  },
  settingsContainer: {
    padding: 16,
  },
  settingItem: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    padding: 9,
    borderRadius: 8,
    justifyContent: 'space-between',
  },
  settingLabel: {
    fontSize: 16,
    color: '#2d4150',
    flex: 1,
    
  },
  input: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  picker: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#F7F7F7',
  },
  summary: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#2d4150',
  },
  summaryValue: {
    fontSize: 16,
    color: '#519076',
    fontWeight: 'bold',
  },
  workoutsContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
  },
  savedWorkoutsList: {
    flex: 1,
    width: '100%',
  },
  smallPlusButton: {
    width: 60,
    height: 60,
    borderRadius: 60,
    backgroundColor: '#ECE9E4',
    borderWidth: 3,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 16,
    alignSelf: 'center',
  },
  smallPlusButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  savedWorkout: {
    width: '100%',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginTop: 16,
  },
  savedWorkoutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d4150',
    marginBottom: 8,
  },
  savedWorkoutDetails: {
    fontSize: 14,
    color: '#666',
  },
  dragHandle: {
    padding: 8,
    justifyContent: 'center',
  },
});

export default CreateWorkoutScreen;

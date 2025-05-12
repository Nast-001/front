import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './navigationTypes';
import { Checkbox } from 'expo-checkbox';
import { useNavigation } from '@react-navigation/native';

type FlexibilityScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Flexibility'>;

const FlexibilityScreen = () => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [cardAnimation] = useState(new Animated.Value(0));
  const navigation = useNavigation<FlexibilityScreenNavigationProp>();

  const options = [
    {
      id: 1,
      text: "Легко выполняю большинство асан",
      card: {
        text: "Молодец! Ваши успехи вдохновляют других!"
      }
    },
    {
      id: 2,
      text: "Хорошая гибкость",
      card: {
        text: "Отлично! Вы на правильном пути к еще большей гибкости!"
      }
    },
    {
      id: 3,
      text: "Могу выполнять некоторые асаны",
      card: {
        text: "Очень хорошо! Каждый шаг к улучшению — это успех!"
      }
    },
    {
      id: 4,
      text: "Есть трудности с гибкостью",
      card: {
        text: "Не повод отчаиваться! Начните с малого, и вы удивитесь своим достижениям!"
      }
    },
    {
      id: 5,
      text: "Никогда не проверял(а) свою гибкость",
      card: {
        text: "Давайте вместе проверим вашу гибкость и начнем путь к улучшению!"
      }
    }
  ];

  const handleSelect = (id: number) => {
    if (selectedOption === id) {
      Animated.timing(cardAnimation, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true
      }).start(() => {
        setSelectedOption(null);
      });
    } else {
      setSelectedOption(id);
      Animated.timing(cardAnimation, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true
      }).start();
    }
  };

  const cardOpacity = cardAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

  const cardTranslateY = cardAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 0]
  });

  const handleContinue = () => {
    if (selectedOption) {
      navigation.navigate('Endurance');
    }
  };

  return (
    <View style={styles.container}>
      {/* Индикатор прогресса (3 полоски, активна третья) */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, styles.completedProgressBar]} />
        <View style={[styles.progressBar, styles.activeProgressBar]} />
        <View style={[styles.progressBar, styles.completedProgressBar]} />
      </View>
      
      <Text style={styles.questionText}>Как вы оцениваете 
      свою гибкость?</Text>
      
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <View key={option.id} style={styles.optionWrapper}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedOption === option.id && styles.selectedOptionButton
              ]}
              onPress={() => handleSelect(option.id)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.optionText,
                selectedOption === option.id && styles.selectedOptionText
              ]}>
                {option.text}
              </Text>
            </TouchableOpacity>
            
            {selectedOption === option.id && (
              <Animated.View style={[
                styles.card,
                {
                  opacity: cardOpacity,
                  transform: [{ translateY: cardTranslateY }]
                }
              ]}>
                <Text style={styles.cardText}>{option.card.text}</Text>
              </Animated.View>
            )}
          </View>
        ))}
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedOption && styles.disabledContinueButton
          ]}
          onPress={handleContinue}
          disabled={!selectedOption}
        >
          <Text style={styles.continueButtonText}>Продолжить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ECE9E4',
    fontFamily: 'Lora',

  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
    fontFamily: 'Lora-Bold',

  },
  progressContainer: {
    flexDirection: 'row',
    marginBottom: 60,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  completedProgressBar: {
    backgroundColor: '#ACACAC',
  },
  activeProgressBar: {
    backgroundColor: '#4CAF50',
  },
  questionText: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
    fontWeight: '600',
    fontFamily: 'Lora',

  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: -50,
  },
  optionWrapper: {
    marginBottom: 1,
  },
  optionButton: {
    padding: 15,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    marginBottom: 1,
  },
  selectedOptionButton: {
    borderColor: '#87D0B2',
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'left',
    fontWeight: '500',
    paddingLeft: 15,
    fontFamily: 'Lora',

  },
  selectedOptionText: {
    color: '#2E7D32',
    fontWeight: '600',
    fontFamily: 'Lora',

  },
  card: {
    backgroundColor: '#FAE596',
    padding: 15,
    borderRadius: 8,
    marginTop: 5,
    borderLeftWidth: 3,
    borderLeftColor: '#87D0B2',
  },
  cardText: {
    color: '#333',
    fontSize: 16,
    fontFamily: 'Lora',

  },
  continueButton: {
    backgroundColor: '#4D4D4D',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledContinueButton: {
    backgroundColor: '#BDBDBD',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Lora',

  },
  buttonContainer: {
    marginTop: 'auto',
    marginBottom: 20,
  },
});

export default FlexibilityScreen;
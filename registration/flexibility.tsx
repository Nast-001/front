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
        text: "Молодец! Ваши успехи вдохновляют других!",
        letter: "a"
      }
    },
    {
      id: 2,
      text: "Хорошая гибкость",
      card: {
        text: "Отлично! Вы на правильном пути к еще большей гибкости!",
        letter: "b"
      }
    },
    {
      id: 3,
      text: "Могу выполнять некоторые асаны",
      card: {
        text: "Очень хорошо! Каждый шаг к улучшению — это успех!",
        letter: "c"
      }
    },
    {
      id: 4,
      text: "Есть трудности с гибкостью",
      card: {
        text: "Не повод отчаиваться! Начните с малого, и вы удивитесь своим достижениям!",
        letter: "d"
      }
    },
    {
      id: 5,
      text: "Никогда не проверял(а) свою гибкость",
      card: {
        text: "Давайте вместе проверим вашу гибкость и начнем путь к улучшению!",
        letter: "e"
      }
    }
  ];

  const handleSelect = (id: number) => {
    setSelectedOption(id);
    cardAnimation.setValue(0);
    Animated.timing(cardAnimation, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true
    }).start();
  };

  const cardOpacity = cardAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

  const cardTranslateY = cardAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0]
  });

  const handleContinue = () => {
    if (selectedOption) {
      navigation.navigate('Endurance');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Гибкость</Text>
      
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, styles.completedProgressBar]} />
        <View style={[styles.progressBar, styles.completedProgressBar]} />
        <View style={[styles.progressBar, styles.inactiveProgressBar]} />
      </View>
      
      <Text style={styles.questionText}>Оцените свою гибкость:</Text>
      
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
              <Checkbox
                value={selectedOption === option.id}
                onValueChange={() => handleSelect(option.id)}
                color={selectedOption === option.id ? '#4CAF50' : undefined}
              />
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
                <Text style={styles.cardLetter}>{option.card.letter})</Text>
                <Text style={styles.cardText}>{option.card.text}</Text>
              </Animated.View>
            )}
          </View>
        ))}
      </View>
      
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  progressBar: {
    height: 4,
    width: 60,
    marginHorizontal: 5,
    borderRadius: 2,
  },
  completedProgressBar: {
    backgroundColor: '#4CAF50',
  },
  inactiveProgressBar: {
    backgroundColor: '#E0E0E0',
  },
  questionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionWrapper: {
    marginBottom: 10,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
  },
  selectedOptionButton: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginLeft: 10,
  },
  selectedOptionText: {
    color: '#2E7D32',
  },
  card: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 8,
    marginTop: 5,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
    flexDirection: 'row',
  },
  cardLetter: {
    fontWeight: 'bold',
    marginRight: 10,
    color: '#4CAF50',
  },
  cardText: {
    flex: 1,
    color: '#333',
  },
  continueButton: {
    backgroundColor: '#4CAF50',
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
  },
});

export default FlexibilityScreen;
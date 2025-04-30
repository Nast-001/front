import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './navigationTypes';

type Props = {
  navigation: NavigationProp<RootStackParamList, 'Regist'>;
};

const RegistPage = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Чтобы мы могли предложить вам наилучшие тренировки, расскажите немного о себе.
      </Text>

      <Image style={styles.image} source={require('../assets/man.png')} resizeMode="contain" />
      <Image style={styles.image} source={require('../assets/woman.png')} resizeMode="contain" />

      <Text style={styles.additionalText}>Выберите пол</Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('GoalsScreen')}
        >
          <Text style={styles.buttonText}>Женский</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('GoalsScreen')}
        >
          <Text style={styles.buttonText}>Мужской</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('GoalsScreen')}
        >
          <Text style={styles.buttonText}>Небинарный</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  text: { fontSize: 18, marginBottom: 20, textAlign: 'center' },
  additionalText: { fontSize: 16, marginVertical: 20, textAlign: 'center', color: '#555' },
  image: { width: '100%', height: 200, marginBottom: 10, borderRadius: 8, backgroundColor: '#f0f0f0' },
  buttonsContainer: { marginTop: 20 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, marginBottom: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default RegistPage;

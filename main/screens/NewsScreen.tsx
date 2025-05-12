import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MainTabParamList } from '../navigationTypes';

type NewsItem = {
  id: number;
  title: string;
  preview_image: string;
  tags: Array<{
    id: number;
    name: string;
  }>;
};

const NewsScreen = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<MainTabParamList>>();

  // Функция для обработки URL изображений
  const processImageUrl = (url: string) => {
    if (!url) return '';
    // Если URL уже полный, возвращаем его как есть
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // Иначе добавляем базовый URL бэкенда
    return `http://192.168.0.176:8000${url}`;
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://192.168.0.176:8000/api/news/');
        const data = await response.json();
        console.log('Полученные новости:', JSON.stringify(data, null, 2));
        setNews(data);
      } catch (err) {
        setError('Ошибка при загрузке новостей');
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const renderNewsItem = ({ item }: { item: NewsItem }) => {
    const imageUrl = processImageUrl(item.preview_image);
    console.log('URL изображения:', imageUrl);

    return (
      <TouchableOpacity
        style={styles.newsCard}
        onPress={() => navigation.navigate('NewsDetail', { newsId: item.id })}
      >
        <Image 
          source={{ uri: imageUrl }}
          style={styles.newsImage}
          onError={(e) => {
            console.error('Ошибка загрузки изображения:', e.nativeEvent.error);
            console.error('URL изображения:', imageUrl);
          }}
        />
        <View style={styles.overlay}>
          <View style={styles.tagContainer}>
            {item.tags.map(tag => (
              <View key={tag.id} style={styles.tag}>
                <Text style={styles.tagText}>#{tag.name}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.newsTitle}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Загрузка...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={news}
        renderItem={renderNewsItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECE9E4',
  },
  listContainer: {
    padding: 16,
  },
  newsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
    width: '100%',
  },
  newsImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Lora',
  },
  newsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    fontFamily: 'Lora',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default NewsScreen; 
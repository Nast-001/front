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

const FILTERS = [
  { id: 'yoga', name: 'Основы йоги' },
  { id: 'benefits', name: 'Польза практики' },
  { id: 'breathing', name: 'Дыхательные техники' },
  { id: 'tips', name: 'Советы по практикам' },
];

const NewsScreen = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<MainTabParamList>>();

  // Функция для обработки URL изображений
  const processImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `http://192.168.0.176:8000${url}`;
  };

  const fetchNews = async () => {
    try {
      const response = await fetch('http://192.168.0.176:8000/api/news/');
      const newData = await response.json();

      // Сравниваем новые данные со старыми
      setNews(prevNews => {
        if (prevNews.length === 0) {
          return newData;
        }

        // Проверяем, есть ли удаленные новости
        const deletedNewsIds = prevNews
          .filter(oldItem => !newData.some((newItem: NewsItem) => newItem.id === oldItem.id))
          .map(item => item.id);

        if (deletedNewsIds.length > 0) {
          console.log('Удаленные новости:', deletedNewsIds);
        }

        return newData;
      });
    } catch (err) {
      setError('Ошибка при загрузке новостей');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();

    const intervalId = setInterval(fetchNews, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (activeFilter) {
      const filtered = news.filter(item =>
        item.tags.some(tag => tag.name.toLowerCase() === FILTERS.find(f => f.id === activeFilter)?.name.toLowerCase())
      );
      setFilteredNews(filtered);
    } else {
      setFilteredNews(news);
    }
  }, [activeFilter, news]);

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

  const renderFilterButtons = () => (
    <View style={styles.filterSection}>
      <Text style={styles.sectionTitle}>Изучить</Text>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.clearFilterButton,
            !activeFilter && styles.activeFilterButton
          ]}
          onPress={() => setActiveFilter(null)}
        >
          <Text style={[
            styles.clearFilterText,
            !activeFilter && styles.activeFilterButtonText
          ]}>×</Text>
        </TouchableOpacity>
        <FlatList
          horizontal
          data={FILTERS}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                activeFilter === item.id && styles.activeFilterButton
              ]}
              onPress={() => setActiveFilter(activeFilter === item.id ? null : item.id)}
            >
              <Text style={[
                styles.filterButtonText,
                activeFilter === item.id && styles.activeFilterButtonText
              ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        />
      </View>
    </View>
  );

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
      {renderFilterButtons()}
      <FlatList
        data={filteredNews}
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
  filterSection: {
    backgroundColor: '#ECE9E4',
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'Lora',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ECE9E4',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterList: {
    flexGrow: 0,
    marginLeft: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#F5F5F5',
  },
  activeFilterButton: {
    backgroundColor: '#4D4D4D',
  },
  filterButtonText: {
    color: '#333',
    fontSize: 14,
    fontFamily: 'Lora',
  },
  activeFilterButtonText: {
    color: '#fff',
  },
  clearFilterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearFilterText: {
    fontSize: 20,
    color: '#666',
    fontFamily: 'Lora',
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
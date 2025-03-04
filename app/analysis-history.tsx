import { View, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import { Text, Card, Chip, useTheme, IconButton, Button, ActivityIndicator, RefreshControl } from 'react-native-paper';
import { Stack, router } from 'expo-router';
import { useState, useEffect } from 'react';
import { analysisService } from '../src/services/analysis';
import { SavedAnalysis } from '../src/types/analysis';
import { format } from 'date-fns';

export default function AnalysisHistory() {
  const [history, setHistory] = useState<SavedAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();

  const loadHistory = async (showLoadingSpinner = true) => {
    try {
      if (showLoadingSpinner) setLoading(true);
      const data = await analysisService.getSavedAnalyses();
      setHistory(data);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadHistory(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await analysisService.deleteAnalysis(id);
      await loadHistory();
    } catch (error) {
      console.error('Error deleting analysis:', error);
    }
  };

  const confirmDelete = (id: string) => {
    Alert.alert(
      'Delete Analysis',
      'Are you sure you want to delete this analysis?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => handleDelete(id),
          style: 'destructive',
        },
      ],
    );
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const getStatusColor = (status: 'good' | 'warning' | 'error') => {
    switch (status) {
      case 'good': return theme.colors.primary;
      case 'warning': return theme.colors.warning;
      case 'error': return theme.colors.error;
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Analysis History',
          headerLeft: () => (
            <IconButton icon="arrow-left" onPress={() => router.back()} />
          ),
        }} 
      />
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        {loading ? (
          <ActivityIndicator style={styles.loader} />
        ) : history.length === 0 ? (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="bodyLarge" style={styles.emptyText}>
                No analysis history found
              </Text>
            </Card.Content>
          </Card>
        ) : (
          history.map((item) => (
            <Card key={item.id} style={styles.card}>
              <Card.Title 
                title={`${item.type === 'soil' ? 'Soil' : 'Crop'} Analysis`}
                subtitle={format(new Date(item.date), 'PPP')}
                right={(props) => (
                  <IconButton 
                    {...props} 
                    icon="delete" 
                    onPress={() => confirmDelete(item.id)}
                  />
                )}
              />
              <Card.Content>
                <Image source={{ uri: item.imageUri }} style={styles.image} />
                
                <View style={styles.resultsContainer}>
                  {item.results.map((result, index) => (
                    <Chip 
                      key={index}
                      style={styles.chip}
                      textStyle={{ color: getStatusColor(result.status) }}
                    >
                      {result.label}: {result.value}%
                    </Chip>
                  ))}
                </View>

                <Text variant="titleMedium" style={styles.recommendationsTitle}>
                  Recommendations
                </Text>
                {item.recommendations.map((rec, index) => (
                  <Text key={index} variant="bodyMedium" style={styles.recommendation}>
                    • {rec}
                  </Text>
                ))}
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  resultsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  recommendationsTitle: {
    marginBottom: 8,
  },
  recommendation: {
    marginBottom: 4,
  },
  loader: {
    marginTop: 32,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
  },
}); 
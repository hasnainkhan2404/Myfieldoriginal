import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Card, Text, Chip, IconButton, Menu, Searchbar, useTheme } from 'react-native-paper';
import { useAnalysis } from '../../../../src/hooks/useAnalysis';
import { format } from 'date-fns';
import { AnalysisReport, AnalysisType } from '../../../../src/types/analysis';

export default function AnalysisHistoryScreen() {
  const { type } = useLocalSearchParams();
  const theme = useTheme();
  const { reports } = useAnalysis();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<AnalysisType[]>([type as AnalysisType]);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'type'>('date');

  const filteredReports = reports
    .filter(report => {
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(report.type);
      const matchesSearch = report.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return a.type.localeCompare(b.type);
    });

  const renderAnalysisCard = ({ item }: { item: AnalysisReport }) => (
    <Card style={styles.card}>
      <Card.Title
        title={format(new Date(item.date), 'MMM d, yyyy')}
        subtitle={item.type.charAt(0).toUpperCase() + item.type.slice(1)}
        right={(props) => (
          <IconButton {...props} icon="chevron-right" onPress={() => {}} />
        )}
      />
      <Card.Content>
        <Text numberOfLines={2}>{item.summary}</Text>
        {item.recommendations.length > 0 && (
          <View style={styles.recommendations}>
            <Text style={styles.subtitle}>Recommendations:</Text>
            {item.recommendations.slice(0, 2).map((rec, index) => (
              <Text key={index} style={styles.recommendation}>• {rec}</Text>
            ))}
          </View>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search analyses..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        <Menu
          visible={sortMenuVisible}
          onDismiss={() => setSortMenuVisible(false)}
          anchor={
            <IconButton
              icon="sort"
              onPress={() => setSortMenuVisible(true)}
            />
          }
        >
          <Menu.Item
            title="Sort by Date"
            onPress={() => {
              setSortBy('date');
              setSortMenuVisible(false);
            }}
          />
          <Menu.Item
            title="Sort by Type"
            onPress={() => {
              setSortBy('type');
              setSortMenuVisible(false);
            }}
          />
        </Menu>
      </View>

      <View style={styles.filters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['soil', 'crop', 'pest', 'disease'].map((analysisType) => (
            <Chip
              key={analysisType}
              selected={selectedTypes.includes(analysisType as AnalysisType)}
              onPress={() => {
                if (selectedTypes.includes(analysisType as AnalysisType)) {
                  setSelectedTypes(selectedTypes.filter(t => t !== analysisType));
                } else {
                  setSelectedTypes([...selectedTypes, analysisType as AnalysisType]);
                }
              }}
              style={styles.chip}
            >
              {analysisType.charAt(0).toUpperCase() + analysisType.slice(1)}
            </Chip>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredReports}
        renderItem={renderAnalysisCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  searchbar: {
    flex: 1,
  },
  filters: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  chip: {
    marginRight: 8,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  recommendations: {
    marginTop: 8,
  },
  subtitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  recommendation: {
    marginLeft: 8,
  },
}); 
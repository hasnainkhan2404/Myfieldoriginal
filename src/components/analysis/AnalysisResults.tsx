import { View, StyleSheet, Animated } from 'react-native';
import { Text, Card, Button, ProgressBar } from 'react-native-paper';
import { useRef, useEffect, useState } from 'react';

interface AnalysisResultsProps {
  type: 'soil' | 'crop';
  results: {
    label: string;
    value: number;
    status: 'good' | 'warning' | 'error';
  }[];
  recommendations: string[];
  imageUri: string;
  onClose: () => void;
  onSave: () => Promise<void>;
}

export function AnalysisResults({ 
  type, 
  results, 
  recommendations,
  imageUri,
  onClose,
  onSave,
}: AnalysisResultsProps) {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, []);

  const getStatusColor = (status: 'good' | 'warning' | 'error') => {
    switch (status) {
      case 'good': return '#4CAF50';
      case 'warning': return '#FFC107';
      case 'error': return '#F44336';
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave();
      onClose();
    } catch (error) {
      console.error('Error saving results:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [300, 0],
              }),
            },
          ],
        },
      ]}
    >
      <Card>
        <Card.Title title={`${type === 'soil' ? 'Soil' : 'Crop'} Analysis Results`} />
        <Card.Content>
          {results.map((result, index) => (
            <View key={index} style={styles.resultItem}>
              <View style={styles.labelRow}>
                <Text variant="bodyMedium">{result.label}</Text>
                <Text 
                  variant="bodyMedium"
                  style={{ color: getStatusColor(result.status) }}
                >
                  {result.value}%
                </Text>
              </View>
              <ProgressBar
                progress={result.value / 100}
                color={getStatusColor(result.status)}
                style={styles.progressBar}
              />
            </View>
          ))}

          <Text variant="titleMedium" style={styles.recommendationsTitle}>
            Recommendations
          </Text>
          {recommendations.map((recommendation, index) => (
            <Text key={index} variant="bodyMedium" style={styles.recommendation}>
              • {recommendation}
            </Text>
          ))}
        </Card.Content>
        <Card.Actions>
          <Button 
            onPress={onClose}
            disabled={saving}
          >
            Close
          </Button>
          <Button 
            mode="contained" 
            onPress={handleSave}
            loading={saving}
            disabled={saving}
          >
            Save Results
          </Button>
        </Card.Actions>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  resultItem: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  recommendationsTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  recommendation: {
    marginBottom: 4,
  },
}); 
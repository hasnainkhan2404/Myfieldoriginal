import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { TextInput, Button, SegmentedButtons, Chip, useTheme } from 'react-native-paper';
import { GrowthStage } from '../types/analysis';
import * as ImagePicker from 'expo-image-picker';

type AnalysisFormProps = {
  fieldId: string;
  onSubmit: (data: any) => Promise<void>;
};

export function AnalysisForm({ fieldId, onSubmit }: AnalysisFormProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [healthScore, setHealthScore] = useState('');
  const [issues, setIssues] = useState<string[]>([]);
  const [stage, setStage] = useState<GrowthStage>('vegetative');
  const [height, setHeight] = useState('');
  const [density, setDensity] = useState('');
  const [notes, setNotes] = useState('');

  const commonIssues = [
    'Pest Damage',
    'Disease Symptoms',
    'Nutrient Deficiency',
    'Water Stress',
    'Weed Competition',
  ];

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      setImages(prev => [...prev, result.assets[0].uri]);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const analysisData = {
        fieldId,
        date: new Date().toISOString(),
        cropHealth: {
          healthScore: parseInt(healthScore),
          issues,
          images,
          notes,
        },
        growthData: {
          stage,
          height: parseFloat(height),
          density: parseFloat(density),
          images,
          notes,
        },
        yieldPrediction: {
          // This would normally be calculated based on various factors
          predictedYield: 4.5,
          confidence: 80,
          factors: {
            weather: 85,
            soil: 90,
            pests: 95,
            disease: 100,
          },
        },
        recommendations: generateRecommendations(issues, stage),
      };

      await onSubmit(analysisData);
    } catch (error) {
      console.error('Error submitting analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = (issues: string[], stage: GrowthStage): string[] => {
    const recommendations: string[] = [];

    // Add stage-specific recommendations
    switch (stage) {
      case 'germination':
        recommendations.push('Monitor soil moisture carefully');
        recommendations.push('Check for proper seed emergence');
        break;
      case 'vegetative':
        recommendations.push('Ensure adequate nutrient availability');
        recommendations.push('Monitor for early pest issues');
        break;
      // Add other stages...
    }

    // Add issue-specific recommendations
    issues.forEach(issue => {
      switch (issue) {
        case 'Pest Damage':
          recommendations.push('Consider appropriate pest control measures');
          break;
        case 'Disease Symptoms':
          recommendations.push('Apply fungicide if symptoms persist');
          break;
        // Add other issues...
      }
    });

    return recommendations;
  };

  return (
    <ScrollView style={styles.container}>
      <Button
        mode="outlined"
        icon="camera"
        onPress={pickImage}
        style={styles.button}
      >
        Take Photos
      </Button>

      {images.length > 0 && (
        <Text style={styles.imagesText}>
          {images.length} photos added
        </Text>
      )}

      <TextInput
        label="Health Score (0-100)"
        value={healthScore}
        onChangeText={setHealthScore}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />

      <Text style={styles.label}>Common Issues</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.chipContainer}
      >
        {commonIssues.map(issue => (
          <Chip
            key={issue}
            selected={issues.includes(issue)}
            onPress={() => {
              if (issues.includes(issue)) {
                setIssues(issues.filter(i => i !== issue));
              } else {
                setIssues([...issues, issue]);
              }
            }}
            style={styles.chip}
          >
            {issue}
          </Chip>
        ))}
      </ScrollView>

      <Text style={styles.label}>Growth Stage</Text>
      <SegmentedButtons
        value={stage}
        onValueChange={value => setStage(value as GrowthStage)}
        buttons={[
          { value: 'germination', label: 'Germination' },
          { value: 'vegetative', label: 'Vegetative' },
          { value: 'flowering', label: 'Flowering' },
          { value: 'ripening', label: 'Ripening' },
          { value: 'harvest', label: 'Harvest' },
        ]}
        style={styles.segmentedButtons}
      />

      <TextInput
        label="Plant Height (cm)"
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Plant Density (plants/m²)"
        value={density}
        onChangeText={setDensity}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Notes"
        value={notes}
        onChangeText={setNotes}
        mode="outlined"
        multiline
        numberOfLines={4}
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading || !healthScore || !height || !density}
        style={styles.submitButton}
      >
        Submit Analysis
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  button: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  chipContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  imagesText: {
    marginBottom: 16,
    color: '#666',
  },
  submitButton: {
    marginBottom: 32,
  },
}); 
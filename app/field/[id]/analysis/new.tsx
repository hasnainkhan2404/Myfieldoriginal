import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Button, Text, Card, TextInput, SegmentedButtons, useTheme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useAnalysis } from '../../../../src/hooks/useAnalysis';
import { AnalysisType } from '../../../../src/types/analysis';

export default function NewAnalysisScreen() {
  const { id, type } = useLocalSearchParams();
  const theme = useTheme();
  const { addReport, processImage } = useAnalysis();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [analysisType, setAnalysisType] = useState<AnalysisType>(type as AnalysisType || 'soil');

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const handleSelectPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets.map(asset => asset.uri)]);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Process each image and get analysis results
      const analysisResults = await Promise.all(
        images.map(imageUri => processImage(imageUri, analysisType))
      );

      // Combine results and create report
      const report = {
        fieldId: id as string,
        type: analysisType,
        date: new Date().toISOString(),
        images,
        notes,
        status: 'completed' as const,
        summary: 'Analysis completed successfully',
        recommendations: [],
        ...(analysisType === 'soil' ? {
          soilAnalysis: analysisResults[0].soilData
        } : {
          cropAnalysis: analysisResults[0].cropData
        })
      };

      await addReport(report);
      router.back();
    } catch (error) {
      console.error('Error submitting analysis:', error);
      alert('Failed to submit analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <SegmentedButtons
            value={analysisType}
            onValueChange={value => setAnalysisType(value as AnalysisType)}
            buttons={[
              { value: 'soil', label: 'Soil' },
              { value: 'crop', label: 'Crop' },
              { value: 'pest', label: 'Pest' },
              { value: 'disease', label: 'Disease' },
            ]}
          />

          <View style={styles.imageSection}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Analysis Images
            </Text>
            <View style={styles.imageGrid}>
              {images.map((uri, index) => (
                <Image
                  key={index}
                  source={{ uri }}
                  style={styles.thumbnail}
                />
              ))}
            </View>
            <View style={styles.buttonRow}>
              <Button
                mode="contained"
                onPress={handleTakePhoto}
                style={styles.button}
                icon="camera"
              >
                Take Photo
              </Button>
              <Button
                mode="contained"
                onPress={handleSelectPhoto}
                style={styles.button}
                icon="image"
              >
                Select Photos
              </Button>
            </View>
          </View>

          <TextInput
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            mode="outlined"
            style={styles.notes}
          />

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading || images.length === 0}
            style={styles.submitButton}
          >
            Submit Analysis
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  card: {
    margin: 16,
  },
  imageSection: {
    marginTop: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  button: {
    flex: 1,
  },
  notes: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
  },
}); 
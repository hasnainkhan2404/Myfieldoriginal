import React from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Card, Button, IconButton, useTheme, SegmentedButtons } from 'react-native-paper';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAnalysis } from '../src/hooks/useAnalysis';
import { useImagePicker } from '../src/hooks/useImagePicker';
import { ImagePickerModal } from '../src/components/analysis/ImagePickerModal';
import { ImagePreview } from '../src/components/analysis/ImagePreview';
import { AnalysisResults } from '../src/components/analysis/AnalysisResults';
import { LoadingOverlay } from '../src/components/common/LoadingOverlay';
import { SuccessMessage } from '../src/components/common/SuccessMessage';

export default function SoilAnalysis() {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('week');
  const { 
    soilData, 
    loading, 
    error, 
    analyzeSoil, 
    analysisResults, 
    clearResults,
    saveResults,
    successMessage 
  } = useAnalysis();
  const [showImagePicker, setShowImagePicker] = useState(false);
  const { selectedImage, pickImage, takePhoto, removeImage } = useImagePicker();

  const handleAnalyze = async () => {
    if (selectedImage) {
      await analyzeSoil(selectedImage);
    } else {
      setShowImagePicker(true);
    }
  };

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) {
      setShowImagePicker(false);
      await analyzeSoil(uri);
    }
  };

  const handleTakePhoto = async () => {
    const uri = await takePhoto();
    if (uri) {
      setShowImagePicker(false);
      await analyzeSoil(uri);
    }
  };

  const handleSave = async () => {
    if (selectedImage && analysisResults) {
      await saveResults(selectedImage, 'soil');
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Soil Analysis',
          headerLeft: () => (
            <IconButton icon="arrow-left" onPress={() => router.back()} />
          ),
          headerRight: () => (
            <IconButton 
              icon="history" 
              onPress={() => router.push('/analysis-history')} 
            />
          ),
        }} 
      />
      <ScrollView style={styles.container}>
        <SegmentedButtons
          value={timeRange}
          onValueChange={setTimeRange}
          buttons={[
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
            { value: 'year', label: 'Year' },
          ]}
          style={styles.timeRange}
        />

        {loading ? (
          <ActivityIndicator style={styles.loader} />
        ) : error ? (
          <Text variant="bodyMedium" style={styles.errorText}>{error}</Text>
        ) : soilData ? (
          <>
            <Card style={styles.card}>
              <Card.Title title="Current Readings" />
              <Card.Content>
                <View style={styles.readingGrid}>
                  <View style={styles.reading}>
                    <MaterialCommunityIcons 
                      name="water-percent" 
                      size={32} 
                      color={theme.colors.primary}
                    />
                    <Text variant="titleMedium">Moisture</Text>
                    <Text variant="headlineSmall">{soilData.moisture}%</Text>
                  </View>
                  <View style={styles.reading}>
                    <MaterialCommunityIcons 
                      name="molecule" 
                      size={32} 
                      color={theme.colors.primary}
                    />
                    <Text variant="titleMedium">pH Level</Text>
                    <Text variant="headlineSmall">{soilData.ph}</Text>
                  </View>
                  <View style={styles.reading}>
                    <MaterialCommunityIcons 
                      name="leaf" 
                      size={32} 
                      color={theme.colors.primary}
                    />
                    <Text variant="titleMedium">Nitrogen</Text>
                    <Text variant="headlineSmall">{soilData.nitrogen}</Text>
                  </View>
                  <View style={styles.reading}>
                    <MaterialCommunityIcons 
                      name="test-tube" 
                      size={32} 
                      color={theme.colors.primary}
                    />
                    <Text variant="titleMedium">Phosphorus</Text>
                    <Text variant="headlineSmall">{soilData.phosphorus}</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>

            {/* Recommendations */}
            <Card style={styles.card}>
              <Card.Title title="Recommendations" />
              <Card.Content>
                <Text variant="bodyMedium">
                  • Add organic matter to improve soil structure{'\n'}
                  • Consider lime application to adjust pH{'\n'}
                  • Monitor moisture levels during dry spell
                </Text>
              </Card.Content>
            </Card>
          </>
        ) : null}

        {selectedImage && (
          <ImagePreview
            uri={selectedImage}
            onRemove={removeImage}
          />
        )}

        <Button 
          mode="contained" 
          icon={selectedImage ? "check" : "camera"}
          style={styles.button}
          onPress={handleAnalyze}
          loading={loading}
        >
          {selectedImage ? "Analyze Selected Image" : "Analyze New Sample"}
        </Button>

        <ImagePickerModal
          visible={showImagePicker}
          onDismiss={() => setShowImagePicker(false)}
          onPickImage={handlePickImage}
          onTakePhoto={handleTakePhoto}
          loading={loading}
        />

        {analysisResults && (
          <AnalysisResults
            type="soil"
            results={analysisResults.results}
            recommendations={analysisResults.recommendations}
            imageUri={selectedImage!}
            onClose={() => {
              clearResults();
              removeImage();
            }}
            onSave={handleSave}
          />
        )}

        {loading && <LoadingOverlay message="Analyzing soil sample..." />}
        {successMessage && <SuccessMessage message={successMessage} />}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  timeRange: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  readingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  reading: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  button: {
    marginVertical: 8,
  },
  loader: {
    marginTop: 16,
  },
  errorText: {
    marginTop: 16,
  },
}); 
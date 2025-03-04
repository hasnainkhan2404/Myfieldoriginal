import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Card, Button, IconButton, useTheme, Chip } from 'react-native-paper';
import { Stack, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAnalysis } from '../src/hooks/useAnalysis';
import { useImagePicker } from '../src/hooks/useImagePicker';
import { ImagePickerModal } from '../src/components/analysis/ImagePickerModal';
import { ImagePreview } from '../src/components/analysis/ImagePreview';
import { AnalysisResults } from '../src/components/analysis/AnalysisResults';
import { LoadingOverlay } from '../src/components/common/LoadingOverlay';
import { SuccessMessage } from '../src/components/common/SuccessMessage';

// Add custom colors to theme
declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      warning: string;
    }
  }
}

export default function CropHealth() {
  const theme = useTheme();
  const { cropHealth, loading, error, scanCrops, analysisResults, clearResults, saveResults, successMessage } = useAnalysis();
  const [showImagePicker, setShowImagePicker] = useState(false);
  const { selectedImage, pickImage, takePhoto, removeImage } = useImagePicker();

  const handleScan = async () => {
    if (selectedImage) {
      await scanCrops(selectedImage);
    } else {
      setShowImagePicker(true);
    }
  };

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) {
      setShowImagePicker(false);
      await scanCrops(uri);
    }
  };

  const handleTakePhoto = async () => {
    const uri = await takePhoto();
    if (uri) {
      setShowImagePicker(false);
      await scanCrops(uri);
    }
  };

  const handleSave = async () => {
    if (selectedImage && analysisResults) {
      await saveResults(selectedImage, 'crop');
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Crop Health Monitor',
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
        {loading ? (
          <ActivityIndicator style={styles.loader} />
        ) : error ? (
          <Text variant="bodyMedium" style={styles.errorText}>{error}</Text>
        ) : cropHealth ? (
          <>
            <Card style={styles.card}>
              <Card.Title title="Current Status" />
              <Card.Content>
                <View style={styles.statusContainer}>
                  <View style={styles.statusItem}>
                    <MaterialCommunityIcons 
                      name="sprout"
                      size={32}
                      color={theme.colors.primary}
                    />
                    <Text variant="titleMedium">Growth Stage</Text>
                    <Chip mode="outlined">{cropHealth.growthStage}</Chip>
                  </View>
                  <View style={styles.statusItem}>
                    <MaterialCommunityIcons 
                      name="leaf"
                      size={32}
                      color={theme.colors.primary}
                    />
                    <Text variant="titleMedium">Leaf Health</Text>
                    <Chip mode="outlined">{cropHealth.leafHealth}</Chip>
                  </View>
                </View>
              </Card.Content>
            </Card>

            {/* Risk Assessment */}
            <Card style={styles.card}>
              <Card.Title title="Risk Assessment" />
              <Card.Content>
                <View style={styles.riskItem}>
                  <View style={styles.riskHeader}>
                    <MaterialCommunityIcons 
                      name="bug"
                      size={24}
                      color={theme.colors.error}
                    />
                    <Text variant="titleMedium" style={styles.riskTitle}>
                      Pest Risk: Medium
                    </Text>
                  </View>
                  <Text variant="bodyMedium" style={styles.riskDescription}>
                    Increased pest activity detected in the region
                  </Text>
                </View>

                <View style={styles.riskItem}>
                  <View style={styles.riskHeader}>
                    <MaterialCommunityIcons 
                      name="water-alert"
                      size={24}
                      color={theme.colors.warning}
                    />
                    <Text variant="titleMedium" style={styles.riskTitle}>
                      Disease Risk: Low
                    </Text>
                  </View>
                  <Text variant="bodyMedium" style={styles.riskDescription}>
                    Current conditions not favorable for diseases
                  </Text>
                </View>
              </Card.Content>
            </Card>

            {/* Actions */}
            <Card style={styles.card}>
              <Card.Title title="Recommended Actions" />
              <Card.Content>
                <Text variant="bodyMedium" style={styles.actionItem}>
                  • Scout for pest damage in the next 2 days{'\n'}
                  • Apply preventive pest control measures{'\n'}
                  • Monitor leaf color changes
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
          onPress={handleScan}
          loading={loading}
        >
          {selectedImage ? "Analyze Selected Image" : "Scan Crops"}
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
            type="crop"
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

        {loading && <LoadingOverlay message="Analyzing crop health..." />}
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
  card: {
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 8,
  },
  statusItem: {
    alignItems: 'center',
    gap: 8,
  },
  riskItem: {
    marginBottom: 16,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  riskTitle: {
    marginLeft: 8,
  },
  riskDescription: {
    marginLeft: 32,
  },
  actionItem: {
    lineHeight: 24,
  },
  button: {
    marginVertical: 8,
  },
  loader: {
    marginTop: 16,
  },
  errorText: {
    marginTop: 16,
    color: 'red',
  },
}); 
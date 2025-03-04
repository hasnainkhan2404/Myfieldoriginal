import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { Text, TextInput, Button, IconButton, Chip, useTheme } from 'react-native-paper';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useFields } from '../../../src/hooks/useFields';
import { useImagePicker } from '../../../src/hooks/useImagePicker';
import { ImagePickerModal } from '../../../src/components/analysis/ImagePickerModal';
import { ImagePreview } from '../../../src/components/analysis/ImagePreview';

interface Observation {
  type: 'growth' | 'pest' | 'disease' | 'other';
  description: string;
  severity: 'low' | 'medium' | 'high';
  imageUri?: string;
}

export default function FieldInspection() {
  const { id } = useLocalSearchParams();
  const { fields } = useFields();
  const field = fields.find(f => f.id === id);
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [observations, setObservations] = useState<Observation[]>([]);
  const [currentObservation, setCurrentObservation] = useState<Partial<Observation>>({
    type: 'growth',
    severity: 'low',
  });
  const [showImagePicker, setShowImagePicker] = useState(false);
  const { selectedImage, pickImage, takePhoto, removeImage } = useImagePicker();

  if (!field) return null;

  const handleAddObservation = () => {
    if (!currentObservation.description) return;

    setObservations(prev => [
      ...prev,
      {
        type: currentObservation.type!,
        severity: currentObservation.severity!,
        description: currentObservation.description!,
        imageUri: selectedImage,
      },
    ]);

    setCurrentObservation({
      type: 'growth',
      severity: 'low',
    });
    removeImage();
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // TODO: Implement saving inspection data
      router.back();
    } catch (error) {
      console.error('Error saving inspection:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: Observation['severity']) => {
    switch (severity) {
      case 'low': return theme.colors.primary;
      case 'medium': return theme.colors.warning;
      case 'high': return theme.colors.error;
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Field Inspection',
          headerLeft: () => (
            <IconButton icon="arrow-left" onPress={() => router.back()} />
          ),
        }} 
      />
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Title title="New Observation" />
          <Card.Content>
            <SegmentedButtons
              value={currentObservation.type!}
              onValueChange={value => setCurrentObservation(prev => ({ ...prev, type: value }))}
              buttons={[
                { value: 'growth', label: 'Growth' },
                { value: 'pest', label: 'Pest' },
                { value: 'disease', label: 'Disease' },
                { value: 'other', label: 'Other' },
              ]}
              style={styles.segmentedButtons}
            />

            <SegmentedButtons
              value={currentObservation.severity!}
              onValueChange={value => setCurrentObservation(prev => ({ ...prev, severity: value }))}
              buttons={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
              ]}
              style={styles.segmentedButtons}
            />

            <TextInput
              label="Description"
              value={currentObservation.description}
              onChangeText={text => setCurrentObservation(prev => ({ ...prev, description: text }))}
              multiline
              numberOfLines={3}
              style={styles.input}
            />

            {selectedImage ? (
              <ImagePreview
                uri={selectedImage}
                onRemove={removeImage}
              />
            ) : (
              <Button
                mode="outlined"
                icon="camera"
                onPress={() => setShowImagePicker(true)}
                style={styles.button}
              >
                Add Photo
              </Button>
            )}

            <Button
              mode="contained"
              onPress={handleAddObservation}
              disabled={!currentObservation.description}
              style={styles.button}
            >
              Add Observation
            </Button>
          </Card.Content>
        </Card>

        {observations.length > 0 && (
          <Card style={styles.card}>
            <Card.Title title="Observations" />
            <Card.Content>
              {observations.map((obs, index) => (
                <View key={index} style={styles.observation}>
                  <View style={styles.observationHeader}>
                    <Chip style={{ backgroundColor: getSeverityColor(obs.severity) }}>
                      {obs.type}
                    </Chip>
                    <Text style={{ color: getSeverityColor(obs.severity) }}>
                      {obs.severity.toUpperCase()}
                    </Text>
                  </View>
                  <Text variant="bodyMedium">{obs.description}</Text>
                  {obs.imageUri && (
                    <Image source={{ uri: obs.imageUri }} style={styles.observationImage} />
                  )}
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        <TextInput
          label="Additional Notes"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          style={styles.submitButton}
        >
          Complete Inspection
        </Button>
      </ScrollView>

      <ImagePickerModal
        visible={showImagePicker}
        onDismiss={() => setShowImagePicker(false)}
        onPickImage={pickImage}
        onTakePhoto={takePhoto}
        loading={loading}
      />
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
  segmentedButtons: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginVertical: 8,
  },
  submitButton: {
    marginVertical: 16,
  },
  observation: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  observationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  observationImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
}); 
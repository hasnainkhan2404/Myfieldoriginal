import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, TextInput, Button, IconButton, SegmentedButtons } from 'react-native-paper';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import { useFields } from '../../../../src/hooks/useFields';
import { FieldCoordinate, FieldMarker } from '../../../../src/types/field';

export default function NewFieldMarker() {
  const { id } = useLocalSearchParams();
  const { fields, addMarker } = useFields();
  const field = fields.find(f => f.id === id);
  
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<FieldMarker['type']>('note');
  const [coordinate, setCoordinate] = useState<FieldCoordinate | null>(null);

  if (!field) return null;

  const handleMapPress = (event: MapPressEvent) => {
    setCoordinate(event.nativeEvent.coordinate);
  };

  const handleSubmit = async () => {
    if (!coordinate) return;

    try {
      setLoading(true);
      await addMarker({
        fieldId: field.id,
        type,
        title,
        description,
        coordinate,
        date: new Date().toISOString(),
        status: 'pending',
      });
      router.back();
    } catch (error) {
      console.error('Error adding marker:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Add Field Marker',
          headerLeft: () => (
            <IconButton icon="arrow-left" onPress={() => router.back()} />
          ),
        }} 
      />
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: field.boundaries[0]?.latitude ?? 0,
            longitude: field.boundaries[0]?.longitude ?? 0,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onPress={handleMapPress}
        >
          {coordinate && (
            <Marker
              coordinate={coordinate}
              draggable
              onDragEnd={(e) => setCoordinate(e.nativeEvent.coordinate)}
            />
          )}
        </MapView>

        <View style={styles.form}>
          <Text variant="titleMedium" style={styles.instruction}>
            {coordinate ? 'Marker Location Selected' : 'Tap on map to place marker'}
          </Text>

          <SegmentedButtons
            value={type}
            onValueChange={value => setType(value as FieldMarker['type'])}
            buttons={[
              { value: 'note', label: 'Note' },
              { value: 'issue', label: 'Issue' },
              { value: 'task', label: 'Task' },
            ]}
            style={styles.segmentedButtons}
          />

          <TextInput
            label="Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={!coordinate || !title}
            loading={loading}
            style={styles.button}
          >
            Add Marker
          </Button>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.4,
  },
  form: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  instruction: {
    textAlign: 'center',
    marginBottom: 16,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
}); 
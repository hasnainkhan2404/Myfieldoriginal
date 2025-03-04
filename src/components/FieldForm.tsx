import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { TextInput, Button, HelperText, Chip, useTheme, Portal, Dialog } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Field } from '../types/field';
import MapView, { Polygon, MapPressEvent, Marker } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type FieldFormProps = {
  onSubmit: (field: Omit<Field, 'id'>) => Promise<void>;
  initialValues?: Partial<Field>;
};

export function FieldForm({ onSubmit, initialValues }: FieldFormProps) {
  const theme = useTheme();
  const [name, setName] = useState(initialValues?.name || '');
  const [cropType, setCropType] = useState(initialValues?.cropType || '');
  const [area, setArea] = useState(initialValues?.area?.toString() || '');
  const [plantingDate, setPlantingDate] = useState(
    initialValues?.plantingDate ? new Date(initialValues.plantingDate) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [boundaries, setBoundaries] = useState<{ latitude: number; longitude: number }[]>(
    initialValues?.boundaries || []
  );
  const [soilType, setSoilType] = useState(initialValues?.soilType || '');
  const [irrigationMethod, setIrrigationMethod] = useState(initialValues?.irrigationMethod || '');
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [isAddingBoundary, setIsAddingBoundary] = useState(false);
  const [initialRegion] = useState({
    latitude: 28.6139,  // Default to India's center
    longitude: 77.2090,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  // Predefined crop types
  const cropTypes = [
    'Wheat', 'Rice', 'Corn', 'Soybeans', 'Cotton', 
    'Potatoes', 'Tomatoes', 'Onions', 'Carrots'
  ];

  // Soil types
  const soilTypes = [
    'Clay', 'Sandy', 'Loamy', 'Silt', 'Peat', 
    'Chalky', 'Clay Loam', 'Sandy Loam'
  ];

  // Irrigation methods
  const irrigationMethods = [
    'Drip', 'Sprinkler', 'Flood', 'Center Pivot', 
    'Furrow', 'Subsurface'
  ];

  const handleMapPress = (e: MapPressEvent) => {
    if (!isAddingBoundary) return;

    if (e.nativeEvent && e.nativeEvent.coordinate) {
      const newBoundary = {
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude,
      };
      setBoundaries(prev => [...prev, newBoundary]);
    }
  };

  const clearBoundaries = () => {
    setBoundaries([]);
    setIsAddingBoundary(false);
  };

  const toggleBoundaryMode = () => {
    setIsAddingBoundary(!isAddingBoundary);
  };

  const undoLastPoint = () => {
    setBoundaries(prev => prev.slice(0, -1));
  };

  const handleSubmit = async () => {
    if (!isValid) return;

    try {
      await onSubmit({
        name,
        cropType,
        area: parseFloat(area),
        plantingDate: plantingDate.toISOString(),
        lastInspection: new Date().toISOString(),
        boundaries,
        status: 'active',
        soilType,
        irrigationMethod,
      });
    } catch (error) {
      console.error('Error submitting field:', error);
    }
  };

  const isValid = name && cropType && area && boundaries.length >= 3;

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Field Name"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
      />

      <Button
        mode="outlined"
        onPress={() => setShowCropDialog(true)}
        style={styles.input}
      >
        {cropType || 'Select Crop Type'}
      </Button>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
        {soilTypes.map(type => (
          <Chip
            key={type}
            selected={soilType === type}
            onPress={() => setSoilType(type)}
            style={styles.chip}
          >
            {type}
          </Chip>
        ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
        {irrigationMethods.map(method => (
          <Chip
            key={method}
            selected={irrigationMethod === method}
            onPress={() => setIrrigationMethod(method)}
            style={styles.chip}
          >
            {method}
          </Chip>
        ))}
      </ScrollView>

      <TextInput
        label="Area (hectares)"
        value={area}
        onChangeText={setArea}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />

      <Button
        mode="outlined"
        onPress={() => setShowDatePicker(true)}
        style={styles.input}
        icon="calendar"
      >
        Planting Date: {plantingDate.toLocaleDateString()}
      </Button>

      {showDatePicker && (
        <DateTimePicker
          value={plantingDate}
          mode="date"
          onChange={(_, date) => {
            setShowDatePicker(false);
            if (date) setPlantingDate(date);
          }}
        />
      )}

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          onPress={handleMapPress}
          showsUserLocation
        >
          {boundaries.length > 0 && (
            <Polygon
              coordinates={boundaries}
              fillColor={`${theme.colors.primary}40`}
              strokeColor={theme.colors.primary}
              strokeWidth={2}
            />
          )}
          {boundaries.map((coord, index) => (
            <Marker
              key={index}
              coordinate={coord}
              pinColor={theme.colors.primary}
              title={`Point ${index + 1}`}
            />
          ))}
        </MapView>

        <View style={styles.mapControls}>
          <Button
            mode={isAddingBoundary ? "contained" : "outlined"}
            onPress={toggleBoundaryMode}
            icon={isAddingBoundary ? "pencil-off" : "pencil"}
            style={styles.mapButton}
          >
            {isAddingBoundary ? "Stop Drawing" : "Draw Boundary"}
          </Button>

          {boundaries.length > 0 && (
            <>
              <Button
                mode="outlined"
                onPress={undoLastPoint}
                icon="undo"
                style={styles.mapButton}
              >
                Undo Point
              </Button>
              <Button
                mode="outlined"
                onPress={clearBoundaries}
                icon="delete"
                style={styles.mapButton}
              >
                Clear All
              </Button>
            </>
          )}
        </View>

        {isAddingBoundary && (
          <View style={styles.mapOverlay}>
            <MaterialCommunityIcons 
              name="map-marker-plus" 
              size={24} 
              color={theme.colors.primary}
            />
            <HelperText type="info">
              Tap on the map to add boundary points
            </HelperText>
          </View>
        )}

        <View style={styles.pointCounter}>
          <Text style={styles.pointCounterText}>
            Points: {boundaries.length}/3 (minimum)
          </Text>
        </View>
      </View>

      <Button
        mode="contained"
        onPress={handleSubmit}
        disabled={!isValid}
        style={styles.submitButton}
      >
        Save Field
      </Button>

      <Portal>
        <Dialog visible={showCropDialog} onDismiss={() => setShowCropDialog(false)}>
          <Dialog.Title>Select Crop Type</Dialog.Title>
          <Dialog.Content>
            <ScrollView>
              {cropTypes.map(crop => (
                <Button
                  key={crop}
                  mode="text"
                  onPress={() => {
                    setCropType(crop);
                    setShowCropDialog(false);
                  }}
                >
                  {crop}
                </Button>
              ))}
            </ScrollView>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
  },
  mapContainer: {
    height: 300,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapControls: {
    position: 'absolute',
    top: 16,
    right: 16,
    gap: 8,
  },
  mapButton: {
    marginBottom: 8,
    backgroundColor: 'white',
  },
  mapOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  pointCounter: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  pointCounterText: {
    color: '#666',
  },
  submitButton: {
    marginBottom: 32,
  },
}); 
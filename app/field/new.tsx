import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { FieldForm } from '../../src/components/FieldForm';
import { useFields } from '../../src/hooks/useFields';

export default function NewField() {
  const router = useRouter();
  const { addField } = useFields();

  const handleSubmit = async (fieldData: Omit<Field, 'id'>) => {
    try {
      await addField(fieldData);
      router.back();
    } catch (error) {
      console.error('Error adding field:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FieldForm onSubmit={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
}); 
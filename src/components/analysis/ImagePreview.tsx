import { View, Image, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';

interface ImagePreviewProps {
  uri: string;
  onRemove: () => void;
}

export function ImagePreview({ uri, onRemove }: ImagePreviewProps) {
  return (
    <View style={styles.container}>
      <Image source={{ uri }} style={styles.image} />
      <IconButton
        icon="close"
        size={20}
        style={styles.removeButton}
        onPress={onRemove}
      />
      <Text variant="bodySmall" style={styles.hint}>
        Tap image to remove
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 150,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
  },
  hint: {
    marginTop: 4,
    color: '#666',
  },
}); 
import { View, StyleSheet } from 'react-native';
import { Portal, Modal, Button } from 'react-native-paper';

interface ImagePickerModalProps {
  visible: boolean;
  onDismiss: () => void;
  onPickImage: () => Promise<void>;
  onTakePhoto: () => Promise<void>;
  loading?: boolean;
}

export function ImagePickerModal({ 
  visible, 
  onDismiss, 
  onPickImage, 
  onTakePhoto,
  loading = false
}: ImagePickerModalProps) {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.container}
      >
        <View style={styles.content}>
          <Button
            mode="contained"
            icon="camera"
            style={styles.button}
            onPress={onTakePhoto}
            disabled={loading}
            loading={loading}
          >
            Take Photo
          </Button>
          <Button
            mode="contained"
            icon="image"
            style={styles.button}
            onPress={onPickImage}
            disabled={loading}
            loading={loading}
          >
            Pick from Gallery
          </Button>
          <Button
            mode="text"
            onPress={onDismiss}
            disabled={loading}
          >
            Cancel
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  content: {
    gap: 10,
  },
  button: {
    marginVertical: 4,
  },
}); 
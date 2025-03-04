import { View, StyleSheet, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface NavBarProps {
  title: string;
  leftIcon?: string;
  rightIcon?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
}

export function NavBar({ 
  title, 
  leftIcon, 
  rightIcon, 
  onLeftPress, 
  onRightPress 
}: NavBarProps) {
  const insets = useSafeAreaInsets();

  const Container = Platform.OS === 'ios' ? BlurView : View;
  const containerProps = Platform.OS === 'ios' ? { intensity: 80, tint: 'light' } : {};

  return (
    <Container {...containerProps} style={[styles.navbar, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <View style={styles.left}>
          {leftIcon && (
            <MaterialCommunityIcons
              name={leftIcon}
              size={24}
              color="#000"
              onPress={onLeftPress}
            />
          )}
        </View>
        
        <Text variant="titleLarge" style={styles.title}>
          {title}
        </Text>
        
        <View style={styles.right}>
          {rightIcon && (
            <MaterialCommunityIcons
              name={rightIcon}
              size={24}
              color="#000"
              onPress={onRightPress}
            />
          )}
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'rgba(255,255,255,0.9)',
  },
  content: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  left: {
    width: 40,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  right: {
    width: 40,
    alignItems: 'flex-end',
  },
}); 
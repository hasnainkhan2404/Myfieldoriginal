import { PaperProvider } from 'react-native-paper';
import { theme } from './src/theme';

export default function App() {
  return (
    <PaperProvider theme={theme}>
      {/* ... existing app content ... */}
    </PaperProvider>
  );
} 
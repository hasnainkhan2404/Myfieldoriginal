# MyField App Documentation

## Overview

MyField is a mobile application built with React Native, designed specifically for farmers. It provides essential agricultural tools and resources including weather forecasts, market prices, crop management, and expert consultation services. The app features multi-language support (English, Hindi, Punjabi) and voice command capabilities for enhanced accessibility.

Tech Stack:
Frontend: React Native with TypeScript, Expo, and Expo Router
Backend/Database: Supabase
UI Framework: React Native Paper
AI Processing: DeepSeek


## Features & Implementation

### 1. Authentication
- Phone number-based login with OTP verification
- Language selection during onboarding
- Implementation:
  - Firebase Authentication for OTP
  - AsyncStorage for language preferences
  - Secure session management

### 2. Core Navigation
Four main sections accessible via bottom navigation:
- Main Menu (Agricultural Tools)
- E-Consultation
- Pest & Disease Analysis
- News & Blogs

### 3. Agricultural Tools
| Feature | Description | Implementation |
|---------|-------------|----------------|
| Weather Forecast | Local weather data and predictions | OpenWeatherMap API |
| Market Prices | Real-time agricultural market rates | Firebase Firestore |
| Crop Calendar | Seasonal planning tool | Custom Calendar Component |
| Soil Analysis | Soil health monitoring | Custom Analysis Tools |
| Storage Locator | Find nearby storage facilities | Google Maps API |

### 4. E-Consultation
Expert consultation features:
- Real-time text chat
- Video calling capability
- Voice input/output support
- Chat history and file sharing

Technical Stack:
- Agora/WebRTC for video calls
- Firebase Firestore for chat storage
- Expo Speech for voice features

### 5. Pest & Disease Analysis
Crop health monitoring system:
- In-app camera integration
- AI-powered disease detection
- Multilingual treatment recommendations

Implementation:
- React Native Camera
- Plantix API integration
- Custom UI for results display

### 6. News & Blogs
Content management system:
- Categorized agricultural news
- Expert-written blogs
- Language-specific content delivery
- Regular content updates

### 7. Language Support
Supported languages:
- English
- Hindi
- Punjabi

Implementation:
```json
{
  "translations": {
    "en": {
      "welcome": "Welcome to MyField",
      "login": "Login"
    },
    "hi": {
      "welcome": "माईफील्ड में आपका स्वागत है",
      "login": "लॉग इन करें"
    },
    "pa": {
      "welcome": "ਮਾਈਫੀਲਡ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ",
      "login": "ਲਾਗਿਨ"
    }
  }
}
```

### 8. Voice Commands
Voice control system supporting:
- English and Hindi commands
- Common agricultural queries
- Navigation commands
- Data input/output

## Technical Architecture

### Frontend
- React Native
- React Navigation
- i18n-js
- React Native Voice

### Backend Services
- Firebase
  - Authentication
  - Firestore
  - Cloud Storage
  - Cloud Functions

### External APIs
- Plantix API (Disease Detection)
- OpenWeatherMap API
- Google Maps API
- Agora/WebRTC

## Development Guidelines

### Testing Requirements
- Cross-platform compatibility
- Offline functionality
- Language switching
- Voice recognition accuracy
- API integration stability
- Performance optimization

### Deployment Checklist
1. Feature completion verification
2. Cross-platform testing
3. Performance optimization
4. Store assets preparation
5. Documentation completion
6. Build generation (APK/IPA)

## Maintenance

### Regular Updates
- Security patches
- API compatibility
- Content management
- User feedback implementation

### Monitoring
- Usage analytics
- Error tracking
- Performance metrics
- User engagement

## Project Deliverables

### Code & Assets
- [ ] React Native application
- [ ] Translation files
- [ ] Voice command system
- [ ] API integrations
- [ ] Documentation

### Deployment
- [ ] Android APK
- [ ] iOS IPA
- [ ] Store listings
- [ ] Marketing materials

### Documentation
- [ ] Technical documentation
- [ ] API documentation
- [ ] Maintenance guide
- [ ] Update procedures

## Database Schema

### Database Tables

#### Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number VARCHAR NOT NULL UNIQUE,
  full_name VARCHAR NOT NULL,
  preferred_language VARCHAR DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP WITH TIME ZONE,
  avatar_url TEXT,
  location GEOGRAPHY(POINT),
  is_verified BOOLEAN DEFAULT FALSE
);
```

#### Farms
```sql
CREATE TABLE farms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  name VARCHAR NOT NULL,
  location GEOGRAPHY(POINT),
  size_hectares DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  soil_type VARCHAR,
  primary_crop VARCHAR
);
```

#### Crops
```sql
CREATE TABLE crops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID REFERENCES farms(id),
  name VARCHAR NOT NULL,
  planting_date DATE,
  expected_harvest_date DATE,
  status VARCHAR,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Disease_Reports
```sql
CREATE TABLE disease_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crop_id UUID REFERENCES crops(id),
  image_url TEXT NOT NULL,
  diagnosis TEXT,
  severity VARCHAR,
  recommendations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  ai_confidence DECIMAL
);
```

#### Consultations
```sql
CREATE TABLE consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  expert_id UUID REFERENCES experts(id),
  status VARCHAR DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  closed_at TIMESTAMP WITH TIME ZONE,
  consultation_type VARCHAR
);
```

#### Messages
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultation_id UUID REFERENCES consultations(id),
  sender_id UUID,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  message_type VARCHAR DEFAULT 'text',
  media_url TEXT
);
```

#### Weather_Data
```sql
CREATE TABLE weather_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location GEOGRAPHY(POINT),
  temperature DECIMAL,
  humidity DECIMAL,
  rainfall DECIMAL,
  forecast JSON,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Project Structure

```
myfield-app/
├── app/                      # Expo Router app directory
│   ├── (auth)/              # Authentication routes
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── verify.tsx
│   ├── (tabs)/              # Main app tabs
│   │   ├── home/
│   │   ├── consult/
│   │   ├── analysis/
│   │   └── news/
│   ├── _layout.tsx          # Root layout
│   └── index.tsx            # Entry point
├── src/
│   ├── components/          # Reusable components
│   │   ├── common/          # Shared components
│   │   ├── forms/           # Form components
│   │   └── layouts/         # Layout components
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useWeather.ts
│   │   └── useTranslation.ts
│   ├── services/            # API and external services
│   │   ├── supabase/        # Supabase client and queries
│   │   ├── ai/             # AI processing services
│   │   └── weather/        # Weather API integration
│   ├── utils/              # Utility functions
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   ├── types/              # TypeScript type definitions
│   │   ├── database.ts
│   │   └── api.ts
│   └── i18n/               # Internationalization
│       ├── en/
│       ├── hi/
│       └── pa/
├── assets/                 # Static assets
│   ├── images/
│   ├── fonts/
│   └── icons/
├── tests/                  # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/                   # Documentation
├── app.json               # Expo config
├── babel.config.js        # Babel config
├── tsconfig.json         # TypeScript config
└── package.json          # Dependencies and scripts
```

## Database Relationships

### One-to-Many Relationships
- User → Farms
- Farm → Crops
- Crop → Disease_Reports
- User → Consultations
- Consultation → Messages

### Many-to-Many Relationships
- Users ↔ Experts (through Consultations)
- Farms ↔ Crops (through farm_crops junction table)

### Indexes
```sql
-- Performance optimization indexes
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_farms_user ON farms(user_id);
CREATE INDEX idx_crops_farm ON crops(farm_id);
CREATE INDEX idx_messages_consultation ON messages(consultation_id);
CREATE INDEX idx_consultations_user ON consultations(user_id);
CREATE INDEX idx_consultations_expert ON consultations(expert_id);
```

## Development Roadmap

### Phase 1: Project Setup & Authentication (Week 1)
1. **Initial Setup**
   ```bash
   npx create-expo-app myfield-app -t expo-router-typescript
   cd myfield-app
   npm install @supabase/supabase-js @react-native-async-storage/async-storage
   ```

2. **Configure Supabase**
   ```typescript:src/services/supabase/client.ts
   import { createClient } from '@supabase/supabase-js';
   import AsyncStorage from '@react-native-async-storage/async-storage';

   const supabaseUrl = 'YOUR_SUPABASE_URL';
   const supabaseKey = 'YOUR_SUPABASE_KEY';

   export const supabase = createClient(supabaseUrl, supabaseKey, {
     auth: {
       storage: AsyncStorage,
       autoRefreshToken: true,
       persistSession: true,
       detectSessionInUrl: false,
     },
   });
   ```

3. **Authentication Flow**
   ```typescript:src/hooks/useAuth.ts
   export const useAuth = () => {
     const [user, setUser] = useState<User | null>(null);
     const [loading, setLoading] = useState(true);

     const signIn = async (phoneNumber: string) => {
       try {
         const { data, error } = await supabase.auth.signInWithOtp({
           phone: phoneNumber,
         });
         if (error) throw error;
         return data;
       } catch (error) {
         console.error('Error:', error);
         throw error;
       }
     };

     // ... other auth methods
   };
   ```

### Phase 2: Core Navigation & UI Setup (Week 2)
1. **Install UI Dependencies**
   ```bash
   npm install react-native-paper react-native-safe-area-context
   ```

2. **Setup Navigation Structure**
   ```typescript:app/_layout.tsx
   import { Stack } from 'expo-router';
   import { PaperProvider } from 'react-native-paper';

   export default function RootLayout() {
     return (
       <PaperProvider>
         <Stack>
           <Stack.Screen name="(auth)" options={{ headerShown: false }} />
           <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
         </Stack>
       </PaperProvider>
     );
   }
   ```

### Phase 3: Main Features Implementation (Weeks 3-6)

#### Week 3: Weather & Market Prices
1. **Weather Integration**
   - Setup OpenWeatherMap API
   - Create weather components
   - Implement location services

2. **Market Prices**
   - Create market price database tables
   - Implement CRUD operations
   - Build price comparison features

#### Week 4: Farm Management
1. **Crop Calendar**
   - Implement calendar interface
   - Create crop planning tools
   - Setup notifications

2. **Soil Analysis**
   - Build soil data input forms
   - Create analysis algorithms
   - Generate recommendations

#### Week 5: Disease Detection
1. **Camera Integration**
   ```bash
   npx expo install expo-camera
   ```

2. **AI Processing Setup**
   ```typescript:src/services/ai/diseaseDetection.ts
   export const analyzeCropImage = async (imageUri: string) => {
     try {
       const formData = new FormData();
       formData.append('image', {
         uri: imageUri,
         type: 'image/jpeg',
         name: 'crop.jpg',
       });

       // API call to DeepSeek
       const response = await fetch('YOUR_AI_ENDPOINT', {
         method: 'POST',
         body: formData,
       });

       return await response.json();
     } catch (error) {
       console.error('Error analyzing image:', error);
       throw error;
     }
   };
   ```

#### Week 6: E-Consultation
1. **Chat Implementation**
   - Setup real-time messaging
   - Implement file sharing
   - Create expert matching system

2. **Video Calls**
   - Integrate WebRTC
   - Build call interface
   - Implement call scheduling

### Phase 4: Localization & Voice Commands (Week 7)
1. **Language Setup**
   ```bash
   npm install i18next react-i18next
   ```

2. **Voice Command Integration**
   ```bash
   npx expo install @react-native-voice/voice
   ```

### Phase 5: Testing & Optimization (Week 8)
1. **Testing Setup**
   ```bash
   npm install --save-dev jest @testing-library/react-native
   ```

2. **Performance Optimization**
   - Implement lazy loading
   - Optimize images
   - Setup caching

### Phase 6: Deployment (Week 9)
1. **Build Generation**
   ```bash
   eas build --platform android
   eas build --platform ios
   ```

2. **Store Submission**
   - Prepare store listings
   - Create marketing materials
   - Submit for review

## Progress Tracking

### Current Sprint Checklist
- [ ] Project setup
- [ ] Authentication implementation
- [ ] Basic navigation
- [ ] Initial UI components

### Next Steps
1. Weather feature implementation
2. Market price database setup
3. Camera integration
4. Chat system development

---

**Note**: Each phase should be thoroughly tested before moving to the next one. Regular code reviews and documentation updates are essential throughout the development process.
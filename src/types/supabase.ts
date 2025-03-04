export type User = {
  id: string;
  phone_number: string;
  full_name: string;
  preferred_language: string;
  created_at: string;
  last_login: string;
  avatar_url?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  is_verified: boolean;
};

export type Profile = {
  id: string;
  phone_number: string;
  full_name: string | null;
  preferred_language: string;
  created_at: string;
  last_login: string | null;
  avatar_url: string | null;
  location: {
    latitude: number;
    longitude: number;
  } | null;
  is_verified: boolean;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at'>;
        Update: Partial<Omit<Profile, 'id'>>;
      };
    };
  };
}; 
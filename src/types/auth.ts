export interface Profile {
  id: string;
  phone_number: string;
  created_at: string;
  full_name: string;
  preferred_language: string;
  last_login?: string;
  avatar_url?: string;
  location?: string;
  is_verified?: boolean;
} 
export interface EventSettings {
  id: string;
  birthday_name: string;
  birthday_age: string;
  hero_title: string;
  invite_text: string;
  event_date: string;
  event_time: string;
  weekday: string;
  address: string;
  maps_url: string;
  gift_url: string;
  primary_color: string;
  secondary_color: string;
  background_color: string;
  button_color: string;
  text_color: string;
  enable_wall: boolean;
  enable_comments: boolean;
  enable_photo_upload: boolean;
  wall_requires_approval: boolean;
  created_at?: string;
  updated_at?: string;
}

export type AttendanceStatus = 'confirmed' | 'declined' | 'maybe';

export interface RSVP {
  id: string;
  guest_name: string;
  phone?: string;
  attendance_status: AttendanceStatus;
  has_companions: boolean;
  companions_count: number;
  companions_names: string[]; // Handled as array of strings
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface WallPost {
  id: string;
  author_name: string;
  message: string;
  photo_url?: string;
  is_approved: boolean;
  created_at?: string;
  updated_at?: string;
  // Dynamic locally joined/computed reaction counts & list
  reactions?: Record<string, number>;
  user_reacted?: string[]; // types of reactions this developer/session hit
  comments?: WallComment[];
}

export interface WallComment {
  id: string;
  post_id: string;
  author_name: string;
  comment: string;
  is_approved: boolean;
  created_at?: string;
  updated_at?: string;
}

export type ReactionType = 'heart' | 'flower' | 'star' | 'care';

export interface WallReaction {
  id: string;
  post_id: string;
  reaction_type: ReactionType;
  visitor_token: string;
  created_at?: string;
}

export interface GalleryPhoto {
  id: string;
  photo_url: string;
  title: string;
  description: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AdminProfile {
  id: string;
  user_id?: string;
  username: string;
  role: string;
  created_at?: string;
  updated_at?: string;
}

export interface GiftSuggestion {
  id: string;
  category: string;
  name: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}


export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          role: string;
          email_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name?: string;
          email?: string;
          role?: string;
          email_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          role?: string;
          email_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      designs: {
        Row: {
          id: number;
          title: string;
          description: string | null;
          image_url: string | null;
          artist: string | null;
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          description?: string | null;
          image_url?: string | null;
          artist?: string | null;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          description?: string | null;
          image_url?: string | null;
          artist?: string | null;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      design_categories: {
        Row: {
          id: number;
          design_id: number;
          category_id: number;
        };
        Insert: {
          id?: number;
          design_id: number;
          category_id: number;
        };
        Update: {
          id?: number;
          design_id?: number;
          category_id?: number;
        };
      };
      categories: {
        Row: {
          id: number;
          name: string;
          description: string | null;
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          description?: string | null;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string | null;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: number;
          user_id: string;
          design_id: number;
          date: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          design_id: number;
          date: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          design_id?: number;
          date?: string;
          status?: string;
          created_at?: string;
        };
      };
    };
  };
}

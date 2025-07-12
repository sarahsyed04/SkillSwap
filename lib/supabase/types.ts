export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          location: string | null
          bio: string | null
          is_banned: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string | null
          location?: string | null
          bio?: string | null
          is_banned?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          location?: string | null
          bio?: string | null
          is_banned?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          name: string
          category: string
          description: string | null
          is_approved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          description?: string | null
          is_approved?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          description?: string | null
          is_approved?: boolean
          created_at?: string
        }
      }
      user_skills: {
        Row: {
          id: string
          user_id: string
          skill_id: string
          skill_type: 'offer' | 'want'
          proficiency_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          skill_id: string
          skill_type: 'offer' | 'want'
          proficiency_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          skill_id?: string
          skill_type?: 'offer' | 'want'
          proficiency_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
          description?: string | null
          created_at?: string
        }
      }
      availability: {
        Row: {
          id: string
          user_id: string
          day_of_week: number
          start_time: string
          end_time: string
          timezone: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          day_of_week: number
          start_time: string
          end_time: string
          timezone: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          timezone?: string
          created_at?: string
        }
      }
      swap_requests: {
        Row: {
          id: string
          requester_id: string
          provider_id: string
          requested_skill_id: string
          offered_skill_id: string
          status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled'
          message: string | null
          scheduled_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          requester_id: string
          provider_id: string
          requested_skill_id: string
          offered_skill_id: string
          status?: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled'
          message?: string | null
          scheduled_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          requester_id?: string
          provider_id?: string
          requested_skill_id?: string
          offered_skill_id?: string
          status?: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled'
          message?: string | null
          scheduled_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      ratings: {
        Row: {
          id: string
          swap_request_id: string
          rater_id: string
          rated_id: string
          rating: number
          feedback: string | null
          created_at: string
        }
        Insert: {
          id?: string
          swap_request_id: string
          rater_id: string
          rated_id: string
          rating: number
          feedback?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          swap_request_id?: string
          rater_id?: string
          rated_id?: string
          rating?: number
          feedback?: string | null
          created_at?: string
        }
      }
      admins: {
        Row: {
          id: string
          user_id: string
          role: 'admin' | 'super_admin'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: 'admin' | 'super_admin'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'admin' | 'super_admin'
          created_at?: string
        }
      }
      announcements: {
        Row: {
          id: string
          title: string
          content: string
          type: 'info' | 'warning' | 'success' | 'error'
          is_active: boolean
          created_by: string
          created_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          title: string
          content: string
          type?: 'info' | 'warning' | 'success' | 'error'
          is_active?: boolean
          created_by: string
          created_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          content?: string
          type?: 'info' | 'warning' | 'success' | 'error'
          is_active?: boolean
          created_by?: string
          created_at?: string
          expires_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
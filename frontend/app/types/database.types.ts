export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          author: string
          content: string
          created_at: string
          id: string
          is_active: boolean
          title: string
        }
        Insert: {
          author?: string
          content: string
          created_at?: string
          id?: string
          is_active?: boolean
          title: string
        }
        Update: {
          author?: string
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean
          title?: string
        }
        Relationships: []
      }
      exams: {
        Row: {
          class: Database["public"]["Enums"]["class_enum"]
          day: string | null
          id: number
          is_active: boolean
          name: string | null
          room: string | null
          teacher: string | null
          time_end: string | null
          time_start: string | null
        }
        Insert: {
          class: Database["public"]["Enums"]["class_enum"]
          day?: string | null
          id?: number
          is_active?: boolean
          name?: string | null
          room?: string | null
          teacher?: string | null
          time_end?: string | null
          time_start?: string | null
        }
        Update: {
          class?: Database["public"]["Enums"]["class_enum"]
          day?: string | null
          id?: number
          is_active?: boolean
          name?: string | null
          room?: string | null
          teacher?: string | null
          time_end?: string | null
          time_start?: string | null
        }
        Relationships: []
      }
      menuids: {
        Row: {
          created_at: string
          menuid: number
        }
        Insert: {
          created_at?: string
          menuid?: number
        }
        Update: {
          created_at?: string
          menuid?: number
        }
        Relationships: []
      }
      menus: {
        Row: {
          created_at: string
          day: string
          id: number
          menu: Json
        }
        Insert: {
          created_at?: string
          day?: string
          id?: number
          menu?: Json
        }
        Update: {
          created_at?: string
          day?: string
          id?: number
          menu?: Json
        }
        Relationships: []
      }
      schedules: {
        Row: {
          created_at: string
          day: string
          id: number
          schedule: Json
        }
        Insert: {
          created_at?: string
          day?: string
          id?: number
          schedule?: Json
        }
        Update: {
          created_at?: string
          day?: string
          id?: number
          schedule?: Json
        }
        Relationships: []
      }
      sportsdates: {
        Row: {
          created_at: string
          id: number
          start_date: string
        }
        Insert: {
          created_at?: string
          id?: number
          start_date?: string
        }
        Update: {
          created_at?: string
          id?: number
          start_date?: string
        }
        Relationships: []
      }
      serviceData: {
        Row: {
          donationGoal: number
          id: string
          last_updated: string
          numDonations: number
        }
        Insert: {
          donationGoal: number
          id?: string
          last_updated?: string
          numDonations: number
        }
        Update: {
          donationGoal?: number
          id?: string
          last_updated?: string
          numDonations?: number
        }
        Relationships: []
      }
      users: {
        Row: {
          access_token: string
          access_token_expiration: string
          blackbaud_id: string
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          refresh_token: string
        }
        Insert: {
          access_token: string
          access_token_expiration: string
          blackbaud_id: string
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          refresh_token: string
        }
        Update: {
          access_token?: string
          access_token_expiration?: string
          blackbaud_id?: string
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          refresh_token?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      class_enum: "I" | "II" | "III" | "IV" | "V" | "VI"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      class_enum: ["I", "II", "III", "IV", "V", "VI"],
    },
  },
} as const

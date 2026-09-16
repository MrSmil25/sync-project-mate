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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      assistant_sessions: {
        Row: {
          assistant: string | null
          course_code: string
          created_at: string
          day: string | null
          end_time: string | null
          enrollment_id: string | null
          id: string
          link: string | null
          room: string | null
          section: string | null
          start_time: string | null
          student_id: string
        }
        Insert: {
          assistant?: string | null
          course_code: string
          created_at?: string
          day?: string | null
          end_time?: string | null
          enrollment_id?: string | null
          id?: string
          link?: string | null
          room?: string | null
          section?: string | null
          start_time?: string | null
          student_id: string
        }
        Update: {
          assistant?: string | null
          course_code?: string
          created_at?: string
          day?: string | null
          end_time?: string | null
          enrollment_id?: string | null
          id?: string
          link?: string | null
          room?: string | null
          section?: string | null
          start_time?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assistant_sessions_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "course_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assistant_sessions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          course_code: string
          course_id: string | null
          course_name: string | null
          created_at: string
          id: string
          semester_id: string | null
          sks: number
          status: string
          student_id: string
        }
        Insert: {
          course_code: string
          course_id?: string | null
          course_name?: string | null
          created_at?: string
          id?: string
          semester_id?: string | null
          sks?: number
          status?: string
          student_id: string
        }
        Update: {
          course_code?: string
          course_id?: string | null
          course_name?: string | null
          created_at?: string
          id?: string
          semester_id?: string | null
          sks?: number
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "curriculum_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_enrollments_semester_id_fkey"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "semesters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      course_prerequisites: {
        Row: {
          course_id: string
          id: string
          prereq_code: string
          prereq_course_id: string | null
        }
        Insert: {
          course_id: string
          id?: string
          prereq_code: string
          prereq_course_id?: string | null
        }
        Update: {
          course_id?: string
          id?: string
          prereq_code?: string
          prereq_course_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_prerequisites_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "curriculum_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_prerequisites_prereq_course_id_fkey"
            columns: ["prereq_course_id"]
            isOneToOne: false
            referencedRelation: "curriculum_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_sections: {
        Row: {
          assistant: string | null
          created_at: string
          enrollment_id: string
          id: string
          lecturer: string | null
          room: string | null
          section: string
          student_id: string
        }
        Insert: {
          assistant?: string | null
          created_at?: string
          enrollment_id: string
          id?: string
          lecturer?: string | null
          room?: string | null
          section?: string
          student_id: string
        }
        Update: {
          assistant?: string | null
          created_at?: string
          enrollment_id?: string
          id?: string
          lecturer?: string | null
          room?: string | null
          section?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_sections_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: true
            referencedRelation: "course_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_sections_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      curriculum_courses: {
        Row: {
          code: string
          course_group: string
          id: string
          name: string
          note: string | null
          program_id: string
          semester: number
          sks: number
        }
        Insert: {
          code: string
          course_group: string
          id?: string
          name: string
          note?: string | null
          program_id: string
          semester: number
          sks: number
        }
        Update: {
          code?: string
          course_group?: string
          id?: string
          name?: string
          note?: string | null
          program_id?: string
          semester?: number
          sks?: number
        }
        Relationships: [
          {
            foreignKeyName: "curriculum_courses_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_courses: {
        Row: {
          created_at: string
          id: string
          name: string
          note: string | null
          provider: string | null
          semester: number | null
          sks: number
          student_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          note?: string | null
          provider?: string | null
          semester?: number | null
          sks?: number
          student_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          note?: string | null
          provider?: string | null
          semester?: number | null
          sks?: number
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_courses_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          course_code: string | null
          created_at: string
          enrollment_id: string | null
          id: string
          kind: string
          note: string | null
          room: string | null
          scheduled_at: string | null
          student_id: string
          weight: number | null
        }
        Insert: {
          course_code?: string | null
          created_at?: string
          enrollment_id?: string | null
          id?: string
          kind?: string
          note?: string | null
          room?: string | null
          scheduled_at?: string | null
          student_id: string
          weight?: number | null
        }
        Update: {
          course_code?: string | null
          created_at?: string
          enrollment_id?: string | null
          id?: string
          kind?: string
          note?: string | null
          room?: string | null
          scheduled_at?: string | null
          student_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "exams_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "course_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exams_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      grades: {
        Row: {
          component: string
          course_code: string | null
          created_at: string
          enrollment_id: string | null
          gpa_points: number | null
          id: string
          letter: string | null
          score: number | null
          student_id: string
          weight: number | null
        }
        Insert: {
          component?: string
          course_code?: string | null
          created_at?: string
          enrollment_id?: string | null
          gpa_points?: number | null
          id?: string
          letter?: string | null
          score?: number | null
          student_id: string
          weight?: number | null
        }
        Update: {
          component?: string
          course_code?: string | null
          created_at?: string
          enrollment_id?: string | null
          gpa_points?: number | null
          id?: string
          letter?: string | null
          score?: number | null
          student_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "grades_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "course_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          body: string
          course_code: string | null
          created_at: string
          enrollment_id: string | null
          id: string
          student_id: string
          title: string
          updated_at: string
        }
        Insert: {
          body?: string
          course_code?: string | null
          created_at?: string
          enrollment_id?: string | null
          id?: string
          student_id: string
          title?: string
          updated_at?: string
        }
        Update: {
          body?: string
          course_code?: string | null
          created_at?: string
          enrollment_id?: string | null
          id?: string
          student_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "course_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          code: string
          created_at: string
          curriculum_year: number
          faculty: string
          id: string
          name: string
          total_sks: number
          university: string
        }
        Insert: {
          code: string
          created_at?: string
          curriculum_year: number
          faculty: string
          id?: string
          name: string
          total_sks: number
          university: string
        }
        Update: {
          code?: string
          created_at?: string
          curriculum_year?: number
          faculty?: string
          id?: string
          name?: string
          total_sks?: number
          university?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          course_code: string | null
          created_at: string
          enrollment_id: string | null
          id: string
          kind: string
          label: string
          student_id: string
          url: string
        }
        Insert: {
          course_code?: string | null
          created_at?: string
          enrollment_id?: string | null
          id?: string
          kind?: string
          label: string
          student_id: string
          url: string
        }
        Update: {
          course_code?: string | null
          created_at?: string
          enrollment_id?: string | null
          id?: string
          kind?: string
          label?: string
          student_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "resources_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "course_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resources_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      schedules: {
        Row: {
          created_at: string
          day: string
          end_time: string
          enrollment_id: string | null
          id: string
          kind: string
          room: string | null
          start_time: string
          student_id: string
        }
        Insert: {
          created_at?: string
          day: string
          end_time: string
          enrollment_id?: string | null
          id?: string
          kind?: string
          room?: string | null
          start_time: string
          student_id: string
        }
        Update: {
          created_at?: string
          day?: string
          end_time?: string
          enrollment_id?: string | null
          id?: string
          kind?: string
          room?: string | null
          start_time?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedules_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "course_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      semesters: {
        Row: {
          academic_year: string | null
          archived: boolean
          created_at: string
          gpa: number | null
          id: string
          is_active: boolean
          notes: string | null
          number: number
          student_id: string
          term: string | null
        }
        Insert: {
          academic_year?: string | null
          archived?: boolean
          created_at?: string
          gpa?: number | null
          id?: string
          is_active?: boolean
          notes?: string | null
          number: number
          student_id: string
          term?: string | null
        }
        Update: {
          academic_year?: string | null
          archived?: boolean
          created_at?: string
          gpa?: number | null
          id?: string
          is_active?: boolean
          notes?: string | null
          number?: number
          student_id?: string
          term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "semesters_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          created_at: string
          current_semester: number
          entry_year: number | null
          faculty: string
          id: string
          name: string
          onboarded_at: string | null
          program: string
          program_id: string | null
          target_gpa: number | null
          university: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_semester?: number
          entry_year?: number | null
          faculty?: string
          id?: string
          name?: string
          onboarded_at?: string | null
          program?: string
          program_id?: string | null
          target_gpa?: number | null
          university?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_semester?: number
          entry_year?: number | null
          faculty?: string
          id?: string
          name?: string
          onboarded_at?: string | null
          program?: string
          program_id?: string | null
          target_gpa?: number | null
          university?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          completed_at: string | null
          course_code: string | null
          created_at: string
          detail: string | null
          due_at: string | null
          enrollment_id: string | null
          id: string
          priority: string
          status: string
          student_id: string
          title: string
        }
        Insert: {
          completed_at?: string | null
          course_code?: string | null
          created_at?: string
          detail?: string | null
          due_at?: string | null
          enrollment_id?: string | null
          id?: string
          priority?: string
          status?: string
          student_id: string
          title: string
        }
        Update: {
          completed_at?: string | null
          course_code?: string | null
          created_at?: string
          detail?: string | null
          due_at?: string | null
          enrollment_id?: string | null
          id?: string
          priority?: string
          status?: string
          student_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "course_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_student_id: { Args: never; Returns: string }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

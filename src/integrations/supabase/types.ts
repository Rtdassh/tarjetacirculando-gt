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
      color: {
        Row: {
          id_color: number
          nombre: string
        }
        Insert: {
          id_color?: number
          nombre: string
        }
        Update: {
          id_color?: number
          nombre?: string
        }
        Relationships: []
      }
      linea: {
        Row: {
          id_linea: number
          id_marca: number
          nombre: string
        }
        Insert: {
          id_linea?: number
          id_marca: number
          nombre: string
        }
        Update: {
          id_linea?: number
          id_marca?: number
          nombre?: string
        }
        Relationships: [
          {
            foreignKeyName: "linea_id_marca_fkey"
            columns: ["id_marca"]
            isOneToOne: false
            referencedRelation: "marca"
            referencedColumns: ["id_marca"]
          },
        ]
      }
      marca: {
        Row: {
          id_marca: number
          nombre: string
        }
        Insert: {
          id_marca?: number
          nombre: string
        }
        Update: {
          id_marca?: number
          nombre?: string
        }
        Relationships: []
      }
      propietario: {
        Row: {
          apellidos: string
          cui: string
          direccion: string
          nit: string
          nombres: string
        }
        Insert: {
          apellidos: string
          cui: string
          direccion: string
          nit: string
          nombres: string
        }
        Update: {
          apellidos?: string
          cui?: string
          direccion?: string
          nit?: string
          nombres?: string
        }
        Relationships: []
      }
      tarjeta_circulacion: {
        Row: {
          estado: boolean
          fecha_emision: string
          fecha_vencimiento: string
          id_uso: number
          motivo_desactivacion: string | null
          nit_propietario: string
          no_tarjeta: number
          placa: string
        }
        Insert: {
          estado?: boolean
          fecha_emision: string
          fecha_vencimiento: string
          id_uso: number
          motivo_desactivacion?: string | null
          nit_propietario: string
          no_tarjeta?: number
          placa: string
        }
        Update: {
          estado?: boolean
          fecha_emision?: string
          fecha_vencimiento?: string
          id_uso?: number
          motivo_desactivacion?: string | null
          nit_propietario?: string
          no_tarjeta?: number
          placa?: string
        }
        Relationships: [
          {
            foreignKeyName: "tarjeta_circulacion_id_uso_fkey"
            columns: ["id_uso"]
            isOneToOne: false
            referencedRelation: "uso_vehiculo"
            referencedColumns: ["id_uso"]
          },
          {
            foreignKeyName: "tarjeta_circulacion_nit_propietario_fkey"
            columns: ["nit_propietario"]
            isOneToOne: false
            referencedRelation: "propietario"
            referencedColumns: ["nit"]
          },
          {
            foreignKeyName: "tarjeta_circulacion_placa_fkey"
            columns: ["placa"]
            isOneToOne: false
            referencedRelation: "vehiculo"
            referencedColumns: ["placa"]
          },
        ]
      }
      tipo_vehiculo: {
        Row: {
          id_tipo: number
          nombre: string
        }
        Insert: {
          id_tipo?: number
          nombre: string
        }
        Update: {
          id_tipo?: number
          nombre?: string
        }
        Relationships: []
      }
      uso_vehiculo: {
        Row: {
          id_uso: number
          nombre: string
        }
        Insert: {
          id_uso?: number
          nombre: string
        }
        Update: {
          id_uso?: number
          nombre?: string
        }
        Relationships: []
      }
      vehiculo: {
        Row: {
          anio: number
          asientos: number
          chasis: string
          id_color: number
          id_linea: number
          id_tipo: number
          motor: string
          placa: string
        }
        Insert: {
          anio: number
          asientos: number
          chasis: string
          id_color: number
          id_linea: number
          id_tipo: number
          motor: string
          placa: string
        }
        Update: {
          anio?: number
          asientos?: number
          chasis?: string
          id_color?: number
          id_linea?: number
          id_tipo?: number
          motor?: string
          placa?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehiculo_id_color_fkey"
            columns: ["id_color"]
            isOneToOne: false
            referencedRelation: "color"
            referencedColumns: ["id_color"]
          },
          {
            foreignKeyName: "vehiculo_id_linea_fkey"
            columns: ["id_linea"]
            isOneToOne: false
            referencedRelation: "linea"
            referencedColumns: ["id_linea"]
          },
          {
            foreignKeyName: "vehiculo_id_tipo_fkey"
            columns: ["id_tipo"]
            isOneToOne: false
            referencedRelation: "tipo_vehiculo"
            referencedColumns: ["id_tipo"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      exec_sql: { Args: { sql: string }; Returns: Json }
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
    Enums: {},
  },
} as const

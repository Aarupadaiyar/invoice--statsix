export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      business_profiles: {
        Row: {
          id: string;
          user_id: string;
          business_name: string;
          logo_data_url: string;
          address: string;
          phone: string;
          email: string;
          website: string;
          tax_id: string;
          default_currency: string;
          default_payment_terms: string;
          invoice_prefix: string;
          receipt_prefix: string;
          default_notes: string;
          default_terms: string;
          bank_name: string;
          account_holder_name: string;
          account_number: string;
          ifsc_code: string;
          swift_code: string;
          upi_id: string;
          payment_link: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Omit<Database["public"]["Tables"]["business_profiles"]["Row"], "id" | "created_at" | "updated_at">> & {
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["business_profiles"]["Row"]>;
        Relationships: [];
      };
      customers: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          company: string;
          email: string;
          phone: string;
          billing_address: string;
          shipping_address: string;
          tax_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Omit<Database["public"]["Tables"]["customers"]["Row"], "id" | "created_at" | "updated_at">> & {
          user_id: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["customers"]["Row"]>;
        Relationships: [];
      };
      documents: {
        Row: {
          id: string;
          user_id: string;
          customer_id: string | null;
          document_type: string;
          document_title: string;
          document_number: string;
          status: string;
          issue_date: string;
          due_date: string | null;
          payment_date: string | null;
          payment_method: string | null;
          currency: string;
          business_details: Json;
          customer_details: Json;
          line_items: Json;
          extra_charge: Json;
          subtotal: number;
          discount_total: number;
          tax_total: number;
          shipping_total: number;
          total: number;
          amount_paid: number;
          notes: string;
          terms: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Omit<Database["public"]["Tables"]["documents"]["Row"], "id" | "created_at" | "updated_at">> & {
          user_id: string;
          document_type: string;
          document_number: string;
          status: string;
          issue_date: string;
        };
        Update: Partial<Database["public"]["Tables"]["documents"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "documents_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
        ];
      };
      counters: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          prefix: string;
          value: number;
        };
        Insert: Partial<Omit<Database["public"]["Tables"]["counters"]["Row"], "id">> & {
          user_id: string;
          type: string;
          prefix: string;
        };
        Update: Partial<Database["public"]["Tables"]["counters"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

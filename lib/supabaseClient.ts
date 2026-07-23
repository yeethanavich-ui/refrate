import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Types matching your real Supabase tables ---

export type Referee = {
  id: number;
  created_at: string;
  name: string;
  region: string | null;
  certification_level: string | null;
};

export type Event = {
  id: number;
  created_at: string;
  name: string;
  date: string;
  location: string | null;
};

export type Review = {
  id: number;
  created_at: string;
  reviewer_name: string | null;
  date: string | null;
  event_id: number | null;
  ref_id: number;
  comment: string | null;
  rating: number;
};

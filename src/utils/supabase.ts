import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Weapon {
  id: string;
  name: string;
  type: string;
  country: string;
  year_introduced: number;
  description: string;
  image_url: string;
  created_at: string;
}

export interface WeaponSpec {
  id: string;
  weapon_id: string;
  caliber: string;
  weight: number;
  length: number;
  effective_range: number;
  rate_of_fire: number;
  magazine_capacity: number;
  muzzle_velocity: number;
  created_at: string;
}

export interface WeaponHistory {
  id: string;
  weapon_id: string;
  era: string;
  conflicts: string;
  notes: string;
  created_at: string;
}

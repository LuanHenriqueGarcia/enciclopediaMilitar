/*
  # Military Weapons Encyclopedia Database

  1. New Tables
    - `weapons` - Main weapons catalog
      - `id` (uuid, primary key)
      - `name` (text, weapon name)
      - `type` (text, category: rifle, pistol, machine_gun, etc)
      - `country` (text, country of origin)
      - `year_introduced` (integer, year first used)
      - `description` (text, detailed description)
      - `image_url` (text, reference image)
      - `created_at` (timestamp)
    
    - `weapon_specs` - Technical specifications
      - `id` (uuid, primary key)
      - `weapon_id` (uuid, foreign key)
      - `caliber` (text, ammunition type)
      - `weight` (numeric, in kg)
      - `length` (numeric, in cm)
      - `effective_range` (numeric, in meters)
      - `rate_of_fire` (numeric, rounds per minute)
      - `magazine_capacity` (integer)
      - `muzzle_velocity` (numeric, m/s)
      - `created_at` (timestamp)
    
    - `weapon_history` - Historical information
      - `id` (uuid, primary key)
      - `weapon_id` (uuid, foreign key)
      - `era` (text, historical period)
      - `conflicts` (text, conflicts used in)
      - `notes` (text, historical notes)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Allow public read access for educational purposes
    - Restrict write access to authenticated users only
*/

CREATE TABLE IF NOT EXISTS weapons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  type text NOT NULL,
  country text NOT NULL,
  year_introduced integer,
  description text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS weapon_specs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  weapon_id uuid NOT NULL REFERENCES weapons(id) ON DELETE CASCADE,
  caliber text,
  weight numeric,
  length numeric,
  effective_range numeric,
  rate_of_fire numeric,
  magazine_capacity integer,
  muzzle_velocity numeric,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS weapon_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  weapon_id uuid NOT NULL REFERENCES weapons(id) ON DELETE CASCADE,
  era text,
  conflicts text,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE weapons ENABLE ROW LEVEL SECURITY;
ALTER TABLE weapon_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE weapon_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Weapons are viewable by everyone"
  ON weapons FOR SELECT
  USING (true);

CREATE POLICY "Weapon specs are viewable by everyone"
  ON weapon_specs FOR SELECT
  USING (true);

CREATE POLICY "Weapon history is viewable by everyone"
  ON weapon_history FOR SELECT
  USING (true);

CREATE POLICY "Only authenticated users can insert weapons"
  ON weapons FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can insert specs"
  ON weapon_specs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can insert history"
  ON weapon_history FOR INSERT
  TO authenticated
  WITH CHECK (true);

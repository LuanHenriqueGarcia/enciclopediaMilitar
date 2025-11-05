/*
  # Add Ballistic Trajectories and Maintenance Guides

  1. New Tables
    - `ballistic_trajectories` - Trajectory data for each weapon
      - `id` (uuid, primary key)
      - `weapon_id` (uuid, foreign key to weapons)
      - `distance_meters` (numeric array, distances in meters)
      - `drop_inches` (numeric array, bullet drop in inches)
      - `wind_drift` (numeric, wind drift at 100m for 10mph wind)
      - `time_to_target` (numeric, time in seconds at 100m)
      - `moa_adjustments` (jsonb, MOA adjustments at various distances)
      - `created_at` (timestamp)
    
    - `maintenance_guides` - Maintenance procedures for each weapon
      - `id` (uuid, primary key)
      - `weapon_id` (uuid, foreign key to weapons)
      - `title` (text, maintenance procedure title)
      - `description` (text, detailed description)
      - `steps` (jsonb, array of maintenance steps)
      - `tools_required` (text array, tools needed)
      - `frequency` (text, how often to perform)
      - `difficulty_level` (text, easy/medium/hard)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all new tables
    - Allow public read access for educational purposes
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'ballistic_trajectories'
  ) THEN
    CREATE TABLE ballistic_trajectories (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      weapon_id uuid NOT NULL REFERENCES weapons(id) ON DELETE CASCADE,
      distance_meters numeric[] NOT NULL,
      drop_inches numeric[] NOT NULL,
      wind_drift numeric,
      time_to_target numeric,
      moa_adjustments jsonb,
      created_at timestamptz DEFAULT now()
    );
    
    ALTER TABLE ballistic_trajectories ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Ballistic trajectories are viewable by everyone"
      ON ballistic_trajectories FOR SELECT
      USING (true);
    
    CREATE POLICY "Only authenticated users can insert trajectories"
      ON ballistic_trajectories FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'maintenance_guides'
  ) THEN
    CREATE TABLE maintenance_guides (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      weapon_id uuid NOT NULL REFERENCES weapons(id) ON DELETE CASCADE,
      title text NOT NULL,
      description text,
      steps jsonb NOT NULL,
      tools_required text[] NOT NULL,
      frequency text,
      difficulty_level text,
      created_at timestamptz DEFAULT now()
    );
    
    ALTER TABLE maintenance_guides ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Maintenance guides are viewable by everyone"
      ON maintenance_guides FOR SELECT
      USING (true);
    
    CREATE POLICY "Only authenticated users can insert guides"
      ON maintenance_guides FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

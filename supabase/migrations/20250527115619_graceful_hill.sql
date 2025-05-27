/*
  # Create websites table

  1. New Tables
    - `websites`
      - `id` (uuid, primary key)
      - `created_at` (timestamp with timezone)
      - `title` (text, not null)
      - `url` (text, not null)
      - `description` (text)
      - `created_by` (uuid, references auth.users)

  2. Security
    - Enable RLS on `websites` table
    - Add policies for:
      - Everyone can view websites
      - Only authenticated admins can insert/delete websites
*/

-- Create the websites table
CREATE TABLE IF NOT EXISTS public.websites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  title text NOT NULL,
  url text NOT NULL,
  description text,
  created_by uuid REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE public.websites ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing websites (allow everyone)
CREATE POLICY "Anyone can view websites"
  ON public.websites
  FOR SELECT
  USING (true);

-- Create policy for inserting websites (only authenticated admins)
CREATE POLICY "Only admins can insert websites"
  ON public.websites
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create policy for deleting websites (only authenticated admins)
CREATE POLICY "Only admins can delete websites"
  ON public.websites
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );
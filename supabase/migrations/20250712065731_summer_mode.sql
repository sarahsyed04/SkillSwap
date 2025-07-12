/*
  # Initial Schema for SkillSwap Platform

  1. New Tables
    - `users` - User profiles and account information
    - `skills` - Master list of available skills with categories
    - `user_skills` - Junction table linking users to skills they offer/want
    - `availability` - User availability schedules
    - `swap_requests` - Skill exchange requests between users
    - `ratings` - User ratings and feedback after swaps
    - `admins` - Admin user roles and permissions
    - `announcements` - Platform-wide announcements

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add admin-only policies for moderation features

  3. Indexes
    - Add performance indexes for common queries
    - Full-text search indexes for skills
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  avatar_url text,
  location text,
  bio text,
  is_banned boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- User skills junction table
CREATE TABLE IF NOT EXISTS user_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  skill_id uuid REFERENCES skills(id) ON DELETE CASCADE NOT NULL,
  skill_type text CHECK (skill_type IN ('offer', 'want')) NOT NULL,
  proficiency_level text CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')) NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, skill_id, skill_type)
);

-- Availability table
CREATE TABLE IF NOT EXISTS availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  day_of_week integer CHECK (day_of_week >= 0 AND day_of_week <= 6) NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  timezone text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Swap requests table
CREATE TABLE IF NOT EXISTS swap_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  provider_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  requested_skill_id uuid REFERENCES skills(id) ON DELETE CASCADE NOT NULL,
  offered_skill_id uuid REFERENCES skills(id) ON DELETE CASCADE NOT NULL,
  status text CHECK (status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')) DEFAULT 'pending',
  message text,
  scheduled_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ratings table
CREATE TABLE IF NOT EXISTS ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  swap_request_id uuid REFERENCES swap_requests(id) ON DELETE CASCADE NOT NULL,
  rater_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  rated_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  feedback text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(swap_request_id, rater_id)
);

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  role text CHECK (role IN ('admin', 'super_admin')) DEFAULT 'admin',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  type text CHECK (type IN ('info', 'warning', 'success', 'error')) DEFAULT 'info',
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE swap_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read all profiles"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Skills policies
CREATE POLICY "Anyone can read approved skills"
  ON skills FOR SELECT
  TO authenticated
  USING (is_approved = true);

CREATE POLICY "Users can create skills"
  ON skills FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- User skills policies
CREATE POLICY "Anyone can read user skills"
  ON user_skills FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own skills"
  ON user_skills FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Availability policies
CREATE POLICY "Anyone can read availability"
  ON availability FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own availability"
  ON availability FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Swap requests policies
CREATE POLICY "Users can read own swap requests"
  ON swap_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = requester_id OR auth.uid() = provider_id);

CREATE POLICY "Users can create swap requests"
  ON swap_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update swap requests they're involved in"
  ON swap_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = requester_id OR auth.uid() = provider_id);

-- Ratings policies
CREATE POLICY "Anyone can read ratings"
  ON ratings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create ratings for their swaps"
  ON ratings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = rater_id);

-- Announcements policies
CREATE POLICY "Anyone can read active announcements"
  ON announcements FOR SELECT
  TO authenticated
  USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

-- Admin policies (will be enhanced with admin role checks)
CREATE POLICY "Admins can read admin table"
  ON admins FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_approved ON skills(is_approved);
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill_id ON user_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_type ON user_skills(skill_type);
CREATE INDEX IF NOT EXISTS idx_swap_requests_requester ON swap_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_swap_requests_provider ON swap_requests(provider_id);
CREATE INDEX IF NOT EXISTS idx_swap_requests_status ON swap_requests(status);
CREATE INDEX IF NOT EXISTS idx_ratings_rated_id ON ratings(rated_id);
CREATE INDEX IF NOT EXISTS idx_availability_user_id ON availability(user_id);

-- Full-text search index for skills
CREATE INDEX IF NOT EXISTS idx_skills_search ON skills USING gin(to_tsvector('english', name || ' ' || coalesce(description, '')));

-- Insert some initial approved skills
INSERT INTO skills (name, category, description, is_approved) VALUES
  ('JavaScript Programming', 'Technology', 'Learn modern JavaScript development', true),
  ('Python Programming', 'Technology', 'Python for beginners to advanced', true),
  ('React Development', 'Technology', 'Build modern web applications with React', true),
  ('Graphic Design', 'Design', 'Adobe Creative Suite and design principles', true),
  ('Photography', 'Arts & Crafts', 'Digital photography and editing', true),
  ('Guitar Playing', 'Music', 'Acoustic and electric guitar lessons', true),
  ('Spanish Language', 'Languages', 'Conversational Spanish for all levels', true),
  ('Cooking', 'Life Skills', 'Basic to advanced cooking techniques', true),
  ('Yoga', 'Sports & Fitness', 'Hatha and Vinyasa yoga practice', true),
  ('Public Speaking', 'Business', 'Overcome fear and speak confidently', true)
ON CONFLICT DO NOTHING;
-- ============================================
-- JY Portfolio - Supabase Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Blog Posts
CREATE TABLE blog_posts (
  id            text PRIMARY KEY,
  title_ko      text NOT NULL,
  title_en      text NOT NULL,
  excerpt_ko    text NOT NULL,
  excerpt_en    text NOT NULL,
  category_ko   text NOT NULL,
  category_en   text NOT NULL,
  read_time_ko  text NOT NULL,
  read_time_en  text NOT NULL,
  content_ko    text NOT NULL DEFAULT '',
  content_en    text NOT NULL DEFAULT '',
  tags          text[] DEFAULT '{}',
  thumbnail_url text,
  status        text DEFAULT 'draft',
  date          date NOT NULL,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- 2. Projects
CREATE TABLE projects (
  id                    text PRIMARY KEY,
  title_ko              text NOT NULL,
  title_en              text NOT NULL,
  description_ko        text NOT NULL,
  description_en        text NOT NULL,
  full_description_ko   text NOT NULL,
  full_description_en   text NOT NULL,
  role_ko               text NOT NULL,
  role_en               text NOT NULL,
  year                  text NOT NULL,
  tags                  text[] DEFAULT '{}',
  cover_image_url       text,
  tech_frontend         text[] DEFAULT '{}',
  tech_backend          text[] DEFAULT '{}',
  tech_design           text[] DEFAULT '{}',
  tech_others           text[] DEFAULT '{}',
  highlights_ko         text[] DEFAULT '{}',
  highlights_en         text[] DEFAULT '{}',
  challenge_ko          text,
  challenge_en          text,
  solution_ko           text,
  solution_en           text,
  link_github           text,
  link_demo             text,
  link_website          text,
  is_featured           boolean DEFAULT false,
  sort_order            integer DEFAULT 0,
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now()
);

-- 3. Project Images
CREATE TABLE project_images (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  text REFERENCES projects(id) ON DELETE CASCADE,
  url         text NOT NULL,
  caption_ko  text,
  caption_en  text,
  sort_order  integer DEFAULT 0
);

-- 4. Open Source Projects
CREATE TABLE open_source_projects (
  id                    text PRIMARY KEY,
  name                  text NOT NULL,
  description_ko        text NOT NULL,
  description_en        text NOT NULL,
  full_description_ko   text NOT NULL,
  full_description_en   text NOT NULL,
  category_ko           text NOT NULL,
  category_en           text NOT NULL,
  tags                  text[] DEFAULT '{}',
  stat_stars            text DEFAULT '0',
  stat_downloads        text DEFAULT '0',
  stat_components       text,
  stat_contributors     text DEFAULT '0',
  link_github           text NOT NULL,
  link_npm              text,
  link_demo             text,
  features_ko           text[] DEFAULT '{}',
  features_en           text[] DEFAULT '{}',
  image_url             text,
  year                  text NOT NULL,
  is_visible            boolean DEFAULT true,
  sort_order            integer DEFAULT 0
);

-- 5. Skills
CREATE TABLE skills (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  level      integer NOT NULL CHECK (level BETWEEN 0 AND 100),
  category   text NOT NULL CHECK (category IN ('frontend', 'backend', 'design', 'other')),
  sort_order integer DEFAULT 0
);

-- 6. Education
CREATE TABLE education (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_ko      text NOT NULL,
  school_en      text NOT NULL,
  degree_ko      text NOT NULL,
  degree_en      text NOT NULL,
  major_ko       text NOT NULL,
  major_en       text NOT NULL,
  period         text NOT NULL,
  description_ko text,
  description_en text,
  sort_order     integer DEFAULT 0
);

-- 7. Experiences
CREATE TABLE experiences (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_ko      text NOT NULL,
  company_en      text NOT NULL,
  position_ko     text NOT NULL,
  position_en     text NOT NULL,
  period          text NOT NULL,
  description_ko  text,
  description_en  text,
  achievements_ko text[] DEFAULT '{}',
  achievements_en text[] DEFAULT '{}',
  sort_order      integer DEFAULT 0
);

-- 8. Chatbot Categories
CREATE TABLE chatbot_categories (
  id         text PRIMARY KEY,
  icon       text NOT NULL,
  title_ko   text NOT NULL,
  title_en   text NOT NULL,
  sort_order integer DEFAULT 0
);

-- 9. Chatbot Questions
CREATE TABLE chatbot_questions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id text REFERENCES chatbot_categories(id) ON DELETE CASCADE,
  question_ko text NOT NULL,
  question_en text NOT NULL,
  answer_ko   text NOT NULL,
  answer_en   text NOT NULL,
  action      text,
  sort_order  integer DEFAULT 0
);

-- 10. Contact Messages
CREATE TABLE contact_messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  email      text NOT NULL,
  message    text NOT NULL,
  is_read    boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 11. Presentations
CREATE TABLE presentations (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ko       text NOT NULL,
  title_en       text NOT NULL,
  description_ko text,
  description_en text,
  category_tag   text,
  file_url       text NOT NULL,
  thumbnail_url  text,
  date           date NOT NULL,
  is_public      boolean DEFAULT true,
  sort_order     integer DEFAULT 0,
  created_at     timestamptz DEFAULT now()
);

-- 12. Site Settings
CREATE TABLE site_settings (
  key        text PRIMARY KEY,
  value      text,
  updated_at timestamptz DEFAULT now()
);

-- Initial site settings
INSERT INTO site_settings (key, value) VALUES
  ('nav_about', 'true'),
  ('nav_projects', 'true'),
  ('nav_opensource', 'true'),
  ('nav_blog', 'true'),
  ('nav_contact', 'true'),
  ('nav_presentations', 'false'),
  ('contact_email', ''),
  ('github_url', ''),
  ('linkedin_url', ''),
  ('open_to_work', 'true');

-- ============================================
-- Enable RLS on all tables
-- ============================================
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE open_source_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE presentations ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies: Public read, Admin write
-- ============================================

-- Helper: create read + write policies for a table
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'blog_posts', 'projects', 'project_images',
    'open_source_projects', 'skills', 'education',
    'experiences', 'chatbot_categories', 'chatbot_questions',
    'contact_messages', 'presentations', 'site_settings'
  ]
  LOOP
    EXECUTE format(
      'CREATE POLICY "public_read_%s" ON %I FOR SELECT USING (true)',
      t, t
    );
    EXECUTE format(
      'CREATE POLICY "admin_insert_%s" ON %I FOR INSERT WITH CHECK (auth.role() = ''authenticated'')',
      t, t
    );
    EXECUTE format(
      'CREATE POLICY "admin_update_%s" ON %I FOR UPDATE USING (auth.role() = ''authenticated'')',
      t, t
    );
    EXECUTE format(
      'CREATE POLICY "admin_delete_%s" ON %I FOR DELETE USING (auth.role() = ''authenticated'')',
      t, t
    );
  END LOOP;
END
$$;

-- Special: allow anonymous users to INSERT contact messages
CREATE POLICY "anon_insert_contact" ON contact_messages
  FOR INSERT WITH CHECK (true);

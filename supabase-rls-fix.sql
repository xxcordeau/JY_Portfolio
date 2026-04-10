-- ============================================
-- JY Portfolio - RLS Policy Fix
-- Run this in Supabase SQL Editor ONCE
-- ============================================
--
-- Purpose:
--   Drop old policies and re-apply using the modern
--   `TO authenticated` / `TO anon` clauses.
--
--   Result:
--     anon role           → SELECT on everything
--                         + INSERT on contact_messages (public contact form)
--     authenticated role  → full CRUD on everything
--                           (admin panel, after signInWithPassword)
--
--   This removes the need for a service_role key in the client bundle.
-- ============================================

-- ============================================
-- Step 1: Make sure RLS is enabled
-- ============================================
ALTER TABLE blog_posts           ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects             ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images       ENABLE ROW LEVEL SECURITY;
ALTER TABLE open_source_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills               ENABLE ROW LEVEL SECURITY;
ALTER TABLE education            ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences          ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_categories   ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_questions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages     ENABLE ROW LEVEL SECURITY;
ALTER TABLE presentations        ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings        ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Step 2: Drop all existing policies on content tables
-- ============================================
DO $$
DECLARE
  t text;
  pol record;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'blog_posts', 'projects', 'project_images',
    'open_source_projects', 'skills', 'education',
    'experiences', 'chatbot_categories', 'chatbot_questions',
    'contact_messages', 'presentations', 'site_settings'
  ]
  LOOP
    FOR pol IN
      SELECT policyname FROM pg_policies
      WHERE schemaname = 'public' AND tablename = t
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, t);
    END LOOP;
  END LOOP;
END
$$;

-- ============================================
-- Step 3: Re-create clean policies
-- ============================================
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'blog_posts', 'projects', 'project_images',
    'open_source_projects', 'skills', 'education',
    'experiences', 'chatbot_categories', 'chatbot_questions',
    'presentations', 'site_settings'
  ]
  LOOP
    -- Anyone (including anonymous visitors) can SELECT
    EXECUTE format(
      'CREATE POLICY "anon_select_%s" ON %I FOR SELECT TO anon, authenticated USING (true)',
      t, t
    );

    -- Only signed-in admins can INSERT / UPDATE / DELETE
    EXECUTE format(
      'CREATE POLICY "auth_all_%s" ON %I FOR ALL TO authenticated USING (true) WITH CHECK (true)',
      t, t
    );
  END LOOP;
END
$$;

-- ============================================
-- Step 4: contact_messages — special rules
--   Public can INSERT (contact form)
--   Only authenticated can SELECT / UPDATE / DELETE
-- ============================================
CREATE POLICY "anon_insert_contact"
  ON contact_messages FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "auth_select_contact"
  ON contact_messages FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "auth_update_contact"
  ON contact_messages FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "auth_delete_contact"
  ON contact_messages FOR DELETE TO authenticated
  USING (true);

-- ============================================
-- Step 5: Storage bucket policies
--   Public can read objects
--   Only authenticated can upload / update / delete
-- ============================================

-- Drop any previous policies on storage.objects for these buckets
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname LIKE 'jy_%'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END
$$;

-- Public read
CREATE POLICY "jy_public_read"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id IN (
    'project-images', 'blog-thumbnails', 'presentations', 'opensource-images'
  ));

-- Authenticated insert
CREATE POLICY "jy_auth_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN (
    'project-images', 'blog-thumbnails', 'presentations', 'opensource-images'
  ));

-- Authenticated update
CREATE POLICY "jy_auth_update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id IN (
    'project-images', 'blog-thumbnails', 'presentations', 'opensource-images'
  ))
  WITH CHECK (bucket_id IN (
    'project-images', 'blog-thumbnails', 'presentations', 'opensource-images'
  ));

-- Authenticated delete
CREATE POLICY "jy_auth_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id IN (
    'project-images', 'blog-thumbnails', 'presentations', 'opensource-images'
  ));

-- ============================================
-- Done. Verify with:
--   SELECT tablename, policyname, cmd, roles
--     FROM pg_policies
--     WHERE schemaname = 'public'
--     ORDER BY tablename, cmd;
-- ============================================

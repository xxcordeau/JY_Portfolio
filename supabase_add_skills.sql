-- ============================================
-- 누락 스킬 추가 SQL
-- Supabase SQL Editor에서 실행
-- 기존 스킬은 건드리지 않고 새 스킬만 INSERT
-- ============================================

-- ── Frontend 추가 ──
INSERT INTO skills (id, name, level, category, sort_order) VALUES
  (gen_random_uuid(), 'Electron',       80, 'frontend', 30),
  (gen_random_uuid(), 'Zustand',        82, 'frontend', 31),
  (gen_random_uuid(), 'Recharts',       78, 'frontend', 32),
  (gen_random_uuid(), 'i18next',        80, 'frontend', 33),
  (gen_random_uuid(), 'Nuxt.js',        88, 'frontend', 34),
  (gen_random_uuid(), 'React Router',   82, 'frontend', 35),
  (gen_random_uuid(), 'HTML/CSS',       92, 'frontend', 36),
  (gen_random_uuid(), 'Framer Motion',  75, 'frontend', 37)
ON CONFLICT DO NOTHING;

-- ── Backend 추가 ──
INSERT INTO skills (id, name, level, category, sort_order) VALUES
  (gen_random_uuid(), 'Prisma',         78, 'backend', 40),
  (gen_random_uuid(), 'Spring Boot',    75, 'backend', 41),
  (gen_random_uuid(), 'Java',           75, 'backend', 42),
  (gen_random_uuid(), 'Express',        80, 'backend', 43),
  (gen_random_uuid(), 'Supabase',       82, 'backend', 44),
  (gen_random_uuid(), 'MySQL',          75, 'backend', 45),
  (gen_random_uuid(), 'MongoDB',        72, 'backend', 46),
  (gen_random_uuid(), 'Redis',          70, 'backend', 47)
ON CONFLICT DO NOTHING;

-- ── Other 추가 ──
INSERT INTO skills (id, name, level, category, sort_order) VALUES
  (gen_random_uuid(), 'Docker',         78, 'other', 50),
  (gen_random_uuid(), 'GitHub Actions', 80, 'other', 51),
  (gen_random_uuid(), 'AWS',            72, 'other', 52),
  (gen_random_uuid(), 'pnpm',           85, 'other', 53),
  (gen_random_uuid(), 'Vitest',         80, 'other', 54),
  (gen_random_uuid(), 'Jest',           78, 'other', 55),
  (gen_random_uuid(), 'Terraform',      70, 'other', 56),
  (gen_random_uuid(), 'ESLint',         85, 'other', 57),
  (gen_random_uuid(), 'Linux',          75, 'other', 58),
  (gen_random_uuid(), 'Nginx',          72, 'other', 59),
  (gen_random_uuid(), 'WebSocket',      80, 'other', 60)
ON CONFLICT DO NOTHING;

-- ============================================================
-- Storage RLS 정책 설정
-- Supabase Dashboard > SQL Editor 에서 실행하세요
-- ============================================================

-- 모든 스토리지 버킷에 대해 RLS 정책 설정
-- anon: 공개 읽기만 가능
-- authenticated(관리자): 업로드/수정/삭제 가능

DO $$
DECLARE
  b text;
BEGIN
  FOREACH b IN ARRAY ARRAY['blog-thumbnails','project-images','presentations','opensource-images']
  LOOP
    -- 공개 읽기 정책
    EXECUTE format('DROP POLICY IF EXISTS "Public read %s" ON storage.objects', b);
    EXECUTE format(
      'CREATE POLICY "Public read %s" ON storage.objects
       FOR SELECT TO anon
       USING (bucket_id = ''%s'')',
      b, b
    );

    -- 인증된 사용자(관리자) 전체 권한
    EXECUTE format('DROP POLICY IF EXISTS "Auth all %s" ON storage.objects', b);
    EXECUTE format(
      'CREATE POLICY "Auth all %s" ON storage.objects
       FOR ALL TO authenticated
       USING (bucket_id = ''%s'')
       WITH CHECK (bucket_id = ''%s'')',
      b, b, b
    );
  END LOOP;
END $$;

-- 확인
SELECT policyname, tablename, roles, cmd
FROM pg_policies
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY policyname;

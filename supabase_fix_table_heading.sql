-- 테이블 글 소제목 복구
-- DB 이관 때 '<AppTable />'이 사라져 'c. 공통 UI -'로 잘려 보이던 소제목을 고칩니다.
-- 줄 끝 공백·줄바꿈 형식에 영향받지 않도록 정규식으로 맞춥니다.
BEGIN;

UPDATE blog_posts
SET content_ko = regexp_replace(content_ko, '### c\. 공통 UI - *','### c. 공통 UI (`<AppTable />`)')
WHERE id = 'table-component-structuring';

UPDATE blog_posts
SET content_en = regexp_replace(content_en, '### c\. Common UI - *','### c. Common UI (`<AppTable />`)')
WHERE id = 'table-component-structuring';

COMMIT;

SELECT position('### c. 공통 UI (`<AppTable />`)' in content_ko) > 0 AS ko_fixed,
       position('### c. Common UI (`<AppTable />`)' in content_en) > 0 AS en_fixed
FROM blog_posts WHERE id = 'table-component-structuring';

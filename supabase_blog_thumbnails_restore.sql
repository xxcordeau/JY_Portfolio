-- 블로그 썸네일을 직접 만든 원래 이미지(Supabase Storage blog-thumbnails)로 되돌린다.
-- 959fa4c에서 회색 글자 썸네일(/blog-thumbs/*.png)로 바꿨던 것을 취소하는 SQL.
BEGIN;

UPDATE blog_posts SET thumbnail_url = 'https://wdedhluxoicizxqojadx.supabase.co/storage/v1/object/public/blog-thumbnails/api-mismatch-usememo-crash.png' WHERE id = 'api-mismatch-usememo-crash';
UPDATE blog_posts SET thumbnail_url = 'https://wdedhluxoicizxqojadx.supabase.co/storage/v1/object/public/blog-thumbnails/common-utils-composable.png' WHERE id = 'common-utils-composable';
UPDATE blog_posts SET thumbnail_url = 'https://wdedhluxoicizxqojadx.supabase.co/storage/v1/object/public/blog-thumbnails/css-print-layer-conflict.png' WHERE id = 'css-print-layer-conflict';
UPDATE blog_posts SET thumbnail_url = 'https://wdedhluxoicizxqojadx.supabase.co/storage/v1/object/public/blog-thumbnails/dashboard-widget-system.png' WHERE id = 'dashboard-widget-system';
UPDATE blog_posts SET thumbnail_url = 'https://wdedhluxoicizxqojadx.supabase.co/storage/v1/object/public/blog-thumbnails/design-animation-philosophy.gif' WHERE id = 'design-animation-philosophy';
UPDATE blog_posts SET thumbnail_url = 'https://wdedhluxoicizxqojadx.supabase.co/storage/v1/object/public/blog-thumbnails/design-color-system.png' WHERE id = 'design-color-system';
UPDATE blog_posts SET thumbnail_url = 'https://wdedhluxoicizxqojadx.supabase.co/storage/v1/object/public/blog-thumbnails/design-ui-without-designer.png' WHERE id = 'design-ui-without-designer';
UPDATE blog_posts SET thumbnail_url = 'https://wdedhluxoicizxqojadx.supabase.co/storage/v1/object/public/blog-thumbnails/design-user-action.png' WHERE id = 'design-user-action';
UPDATE blog_posts SET thumbnail_url = 'https://wdedhluxoicizxqojadx.supabase.co/storage/v1/object/public/blog-thumbnails/design-whitespace.png' WHERE id = 'design-whitespace';
UPDATE blog_posts SET thumbnail_url = 'https://wdedhluxoicizxqojadx.supabase.co/storage/v1/object/public/blog-thumbnails/filter-system-implementation.png' WHERE id = 'filter-system-implementation';
UPDATE blog_posts SET thumbnail_url = 'https://wdedhluxoicizxqojadx.supabase.co/storage/v1/object/public/blog-thumbnails/hidden-div-react-rendering.png' WHERE id = 'hidden-div-react-rendering';
UPDATE blog_posts SET thumbnail_url = 'https://wdedhluxoicizxqojadx.supabase.co/storage/v1/object/public/blog-thumbnails/icon-system-implementation.png' WHERE id = 'icon-system-implementation';
UPDATE blog_posts SET thumbnail_url = 'https://wdedhluxoicizxqojadx.supabase.co/storage/v1/object/public/blog-thumbnails/portfolio-admin-journey.png' WHERE id = 'portfolio-admin-journey';
UPDATE blog_posts SET thumbnail_url = 'https://wdedhluxoicizxqojadx.supabase.co/storage/v1/object/public/blog-thumbnails/react-page-refactoring.png' WHERE id = 'react-page-refactoring';
UPDATE blog_posts SET thumbnail_url = 'https://wdedhluxoicizxqojadx.supabase.co/storage/v1/object/public/blog-thumbnails/role-permission-system.png' WHERE id = 'role-permission-system';
UPDATE blog_posts SET thumbnail_url = 'https://wdedhluxoicizxqojadx.supabase.co/storage/v1/object/public/blog-thumbnails/table-component-structuring.png' WHERE id = 'table-component-structuring';
UPDATE blog_posts SET thumbnail_url = 'https://wdedhluxoicizxqojadx.supabase.co/storage/v1/object/public/blog-thumbnails/tree-structure-management.png' WHERE id = 'tree-structure-management';
UPDATE blog_posts SET thumbnail_url = 'https://wdedhluxoicizxqojadx.supabase.co/storage/v1/object/public/blog-thumbnails/view-state-standardization.png' WHERE id = 'view-state-standardization';

COMMIT;

SELECT count(*) FILTER (WHERE thumbnail_url LIKE '%/blog-thumbnails/%') AS restored, count(*) AS posts FROM blog_posts;

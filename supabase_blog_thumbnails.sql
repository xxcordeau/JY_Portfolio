-- 블로그 썸네일 18장을 한 규칙(밝은 회색 배경 + 점 + 분류 + 핵심어)으로 교체
-- 이미지는 사이트의 public/blog-thumbs/ 에 있으므로, 이 커밋이 배포된 뒤에 실행해야 깨지지 않습니다.
-- 원래 썸네일은 Supabase Storage(blog-thumbnails)에 그대로 남아 있어 되돌릴 수 있습니다.
BEGIN;

UPDATE blog_posts SET thumbnail_url = '/blog-thumbs/view-state-standardization.png' WHERE id = 'view-state-standardization';
UPDATE blog_posts SET thumbnail_url = '/blog-thumbs/react-page-refactoring.png' WHERE id = 'react-page-refactoring';
UPDATE blog_posts SET thumbnail_url = '/blog-thumbs/icon-system-implementation.png' WHERE id = 'icon-system-implementation';
UPDATE blog_posts SET thumbnail_url = '/blog-thumbs/css-print-layer-conflict.png' WHERE id = 'css-print-layer-conflict';
UPDATE blog_posts SET thumbnail_url = '/blog-thumbs/design-ui-without-designer.png' WHERE id = 'design-ui-without-designer';
UPDATE blog_posts SET thumbnail_url = '/blog-thumbs/design-whitespace.png' WHERE id = 'design-whitespace';
UPDATE blog_posts SET thumbnail_url = '/blog-thumbs/dashboard-widget-system.png' WHERE id = 'dashboard-widget-system';
UPDATE blog_posts SET thumbnail_url = '/blog-thumbs/role-permission-system.png' WHERE id = 'role-permission-system';
UPDATE blog_posts SET thumbnail_url = '/blog-thumbs/table-component-structuring.png' WHERE id = 'table-component-structuring';
UPDATE blog_posts SET thumbnail_url = '/blog-thumbs/hidden-div-react-rendering.png' WHERE id = 'hidden-div-react-rendering';
UPDATE blog_posts SET thumbnail_url = '/blog-thumbs/design-animation-philosophy.png' WHERE id = 'design-animation-philosophy';
UPDATE blog_posts SET thumbnail_url = '/blog-thumbs/design-user-action.png' WHERE id = 'design-user-action';
UPDATE blog_posts SET thumbnail_url = '/blog-thumbs/tree-structure-management.png' WHERE id = 'tree-structure-management';
UPDATE blog_posts SET thumbnail_url = '/blog-thumbs/common-utils-composable.png' WHERE id = 'common-utils-composable';
UPDATE blog_posts SET thumbnail_url = '/blog-thumbs/api-mismatch-usememo-crash.png' WHERE id = 'api-mismatch-usememo-crash';
UPDATE blog_posts SET thumbnail_url = '/blog-thumbs/filter-system-implementation.png' WHERE id = 'filter-system-implementation';
UPDATE blog_posts SET thumbnail_url = '/blog-thumbs/design-color-system.png' WHERE id = 'design-color-system';
UPDATE blog_posts SET thumbnail_url = '/blog-thumbs/portfolio-admin-journey.png' WHERE id = 'portfolio-admin-journey';

COMMIT;

SELECT count(*) FILTER (WHERE thumbnail_url LIKE '/blog-thumbs/%') AS new_thumbs, count(*) AS posts FROM blog_posts;

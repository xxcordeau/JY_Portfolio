-- 근거를 대기 어려운 수치 정리 + 학력 수정
-- 재사용률 200%, 개발 속도 2배, 검색 30%, 60fps를 빼고 셀 수 있는 사실(62종, 500개, 고객사 3곳)만 남깁니다.
-- 윈앤티켓 번들 580KB → 336KB, 통인 25분 → 10분, 서명 완료율 52% → 87%는 전후 비교가 있어 그대로 둡니다.
BEGIN;

UPDATE education SET degree_ko = '전문학사', degree_en = 'Associate Degree'
WHERE school_ko = '한양여자대학교';

UPDATE experiences SET
  achievements_ko = ARRAY[
    '프론트엔드 1인 전담 (팀: 백엔드 3, 프론트 1, PM 1), 전체 UI 설계·구현·유지보수',
    '테이블·폼·트리·드롭다운 등 공통 컴포넌트 62종과 composable 구축',
    '날짜·사용자·상태·정책·장치 조건을 조합하는 다중 조건 검색과 태그 필터 구현',
    '수천 건 로그·인증 기록 테이블에 lazy-load와 가상 스크롤 적용',
    '조직도 트리 UI: 재귀 탐색·드래그앤드롭·다중 선택, 노드 500개 이상 처리',
    '현대모비스·현대오토에버·현대케피코 납품, 프로덕션 운영 중'
  ],
  achievements_en = ARRAY[
    'Sole frontend developer (team: 3 backend, 1 frontend, 1 PM), owning UI design, implementation, and maintenance',
    'Built 62 common components (tables, forms, trees, dropdowns) and shared composables',
    'Multi-condition search and tag filters combining date, user, status, policy, and device',
    'Lazy-load and virtual scrolling for log and auth tables with thousands of rows',
    'Org-chart tree UI with recursive traversal, drag-and-drop, and multi-select for 500+ nodes',
    'Delivered to and running in production at Hyundai Mobis, Hyundai AutoEver, and Hyundai Kefico'
  ]
WHERE id = '04547563-b910-45e8-ace4-614f761f45fa';

UPDATE projects SET
  highlights_ko = ARRAY[
    '프론트엔드 1인 전담 (팀: 백엔드 3, 프론트 1, PM 1), Nuxt 3 + TypeScript 기반 전체 UI 설계·구현·유지보수',
    '테이블·폼·트리·드롭다운 등 공통 컴포넌트 62종과 composable 구축',
    '날짜·사용자·상태·정책·장치 조건을 조합하는 다중 조건 검색과 태그 필터 구현',
    '수천 건 로그·인증 기록 테이블에 lazy-load와 가상 스크롤 적용',
    '조직도 트리 UI: 재귀 탐색·드래그앤드롭·다중 선택, 노드 500개 이상 처리',
    'Ant Design Vue와 커스텀 차트로 보고서 시각화 (스토리지 사용량, 정책 준수율 등)',
    '현대모비스·현대오토에버·현대케피코 납품, 프로덕션 운영 중'
  ],
  highlights_en = ARRAY[
    'Sole frontend developer (team: 3 backend, 1 frontend, 1 PM), owning the whole Nuxt 3 + TypeScript UI',
    'Built 62 common components (tables, forms, trees, dropdowns) and shared composables',
    'Multi-condition search and tag filters combining date, user, status, policy, and device',
    'Lazy-load and virtual scrolling for log and auth tables with thousands of rows',
    'Org-chart tree UI with recursive traversal, drag-and-drop, and multi-select for 500+ nodes',
    'Report visualization with Ant Design Vue and custom charts (storage usage, policy compliance)',
    'Delivered to and running in production at Hyundai Mobis, Hyundai AutoEver, and Hyundai Kefico'
  ],
  challenge_ko = '수천 건의 보안 로그·인증 기록을 한 화면에서 끊김 없이 보여줘야 했고, 노드가 500개 넘는 조직도 트리에서 재귀 탐색·드래그앤드롭·다중 선택을 함께 지원해야 했습니다. 또한 현대모비스·현대오토에버·현대케피코마다 다른 보안 정책과 배포 환경에 맞춰야 했습니다.',
  challenge_en = 'Thousands of security log and auth records had to scroll without stutter on one screen, and an org tree with 500+ nodes needed recursive traversal, drag-and-drop, and multi-select at the same time. Each customer (Hyundai Mobis, AutoEver, Kefico) also had its own security policy and deployment environment.',
  solution_ko = '대용량 테이블에는 lazy-load와 가상 스크롤을 적용해 화면에 보이는 행만 그리도록 했습니다. 트리 컴포넌트는 노드 단위로 상태를 분리하고 재귀 렌더링을 최적화해 노드 500개 이상에서도 안정적으로 동작하게 했습니다. 공통 컴포넌트 62종과 composable을 만들어 고객사마다 다른 요구를 같은 컴포넌트 조합으로 처리했습니다.',
  solution_en = 'Large tables use lazy-load and virtual scrolling so only visible rows are rendered. The tree component keeps state per node and optimizes recursive rendering, so it stays stable past 500 nodes. 62 common components and shared composables let each customer''s requirements be handled by combining the same building blocks.'
WHERE id = 'keyrke';

COMMIT;

SELECT 'education' AS t, degree_ko AS v FROM education WHERE school_ko = '한양여자대학교'
UNION ALL
SELECT 'experience 200%/60fps 남음', count(*)::text FROM experiences
  WHERE array_to_string(achievements_ko, ' ') ~ '200%|60fps|30%|2배'
UNION ALL
SELECT 'project 200%/60fps 남음', count(*)::text FROM projects
  WHERE id = 'keyrke' AND (array_to_string(highlights_ko, ' ') || challenge_ko || solution_ko) ~ '200%|60fps|30%|2배';

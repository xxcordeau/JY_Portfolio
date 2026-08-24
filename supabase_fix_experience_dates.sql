-- ============================================
-- 경력 날짜 정리 + 본업/프리랜서(야간·주말) 구조 명시
-- JobKorea 이력서 기준으로 통일 — 프리랜서 건들이 서로 겹치지 않게 순차 배열
--
-- 최종 타임라인:
--   2022.05 - 2022.11  통인익스프레스  정규직 (웹퍼블리셔)
--   2023.08 - 현재      동훈아이텍      정규직 (본업)
--   2025.03 - 2025.08  통인익스프레스  프리랜서 · 야간/주말
--   2025.11 - 2026.03  윈앤티켓        프리랜서 · 야간/주말
--   2026.04 - 2026.06  SnapClub        프리랜서 · 야간/주말
--
-- 표시 순서: 재직 중인 본업을 맨 위 → 프리랜서 최신순 → 초기 경력
-- ============================================

-- 1) 동훈아이텍 — 본업(정규직) 명시, 맨 위로
UPDATE experiences SET
  position_ko = '프론트엔드 개발자 (정규직)',
  position_en = 'Frontend Developer (Full-time)',
  period      = '2023.08 - 현재',
  sort_order  = -5
WHERE id = '04547563-b910-45e8-ace4-614f761f45fa';

-- 2) SnapClub — 2026.04 ~ 2026.06, 야간/주말
UPDATE experiences SET
  position_ko    = '풀스택 엔지니어 (프리랜서 · 야간/주말)',
  position_en    = 'Fullstack Engineer (Freelance · nights & weekends)',
  period         = '2026.04 - 2026.06',
  description_ko = '호주 멜버른 포토부스 브랜드의 레거시 WPF 시스템을 Electron + React + NestJS로 다시 만들었습니다. 현재 호주 매장 부스에서 실제 운영 중입니다. 동훈아이텍 재직과 병행해 야간·주말 시간에 진행했습니다.',
  description_en = 'Rebuilt an Australian photo booth brand''s legacy WPF system with Electron + React + NestJS. Now running in their stores. Worked nights and weekends alongside my full-time role at Donghun I-Tech.',
  sort_order     = -4
WHERE id = '6226515c-e940-4c96-bee7-00bffdaf07ad';

-- 3) 윈앤티켓 — 2025.11 ~ 2026.03, 야간/주말
UPDATE experiences SET
  position_ko    = '풀스택 엔지니어 (프리랜서 · 야간/주말)',
  position_en    = 'Fullstack Engineer (Freelance · nights & weekends)',
  period         = '2025.11 - 2026.03',
  description_ko = '공연·레저·숙박 티켓을 파는 커머스 플랫폼을 풀스택으로 개발했습니다. 쇼핑몰, 관리자 대시보드, 현장 검증 시스템까지 3개를 단일 React 앱으로 만들었습니다. 동훈아이텍 재직과 병행해 야간·주말 시간에 진행했습니다.',
  description_en = 'Built a ticket commerce platform end to end — storefront, admin dashboard, and on-site verification as one React app. Worked nights and weekends alongside my full-time role at Donghun I-Tech.',
  sort_order     = -3
WHERE id = '40d7a473-6383-4cfe-8ad3-c335b53c4c09';

-- 4) 통인익스프레스 (외주) — 2025.03 ~ 2025.08, 야간/주말 + 재의뢰 맥락
UPDATE experiences SET
  position_ko    = '프론트엔드 개발자 (프리랜서 · 야간/주말)',
  position_en    = 'Frontend Developer (Freelance · nights & weekends)',
  period         = '2025.03 - 2025.08',
  description_ko = '이전에 근무했던 통인익스프레스에서 다시 의뢰를 받아, 오프라인 종이 계약을 아이패드 웹앱으로 옮기는 프로젝트를 단독으로 개발했습니다. 동훈아이텍 재직과 병행해 야간·주말 시간에 진행했습니다.',
  description_en = 'Came back to Tongin Express as a contractor to move their paper contract process onto an iPad web app, building the frontend solo. Worked nights and weekends alongside my full-time role at Donghun I-Tech.',
  sort_order     = -2
WHERE id = '2bd947d2-f8af-4ff8-8303-601e5a39e211';

-- 5) 통인익스프레스 (사내) — 웹퍼블리셔 정규직, 홈앤무브 개편으로 정정
UPDATE experiences SET
  position_ko     = '웹 퍼블리셔 (정규직)',
  position_en     = 'Web Publisher (Full-time)',
  period          = '2022.05 - 2022.11',
  description_ko  = '디자인팀에서 웹 퍼블리셔로 근무하며 홈앤무브 웹사이트 전면 개편을 맡았습니다. UI 디자인부터 마크업까지 한 사람이 담당해, 시안을 넘기고 다시 고치는 왕복 없이 작업했습니다.',
  description_en  = 'Worked as a web publisher on the design team, leading the full redesign of the Home&Move website. Handling both UI design and markup myself removed the usual handoff-and-revise loop.',
  achievements_ko = ARRAY[
    '홈앤무브 웹사이트 전면 개편 — UI 디자인부터 마크업까지 전 과정 단독 수행',
    '디자인·퍼블리싱 일괄 담당으로 시안 전달-피드백-수정 사이클 제거',
    'Vue.js + SCSS 기반 컴포넌트 시스템 구축',
    '사내 웹사이트 기능 개발 및 유지보수'
  ],
  achievements_en = ARRAY[
    'Full redesign of the Home&Move website — UI design through markup, solo',
    'Owning both design and publishing removed the handoff-feedback-revision cycle',
    'Built a component system with Vue.js + SCSS',
    'Developed and maintained internal company websites'
  ],
  sort_order      = -1
WHERE id = '3dc2e7b3-0942-4e59-b274-cfab00a945a8';

-- 확인
SELECT company_ko, position_ko, period, sort_order
FROM experiences ORDER BY sort_order;

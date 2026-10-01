/**
 * 사이트 전체를 안내하는 '하나의 점' 공통 규격.
 *
 * 히어로 캔버스에서 "허정연"이 모여 만든 점 → ScrollDot → 연락하기 버튼이
 * 모두 같은 점으로 이어져 보이도록 크기·색·전환 시점을 이곳에서만 정한다.
 * (헤더 로고 점·파비콘과도 같은 색)
 */

export const DOT_SIZE = 10;

export const DOT_COLOR = {
  light: '#1d1d1f',
  dark: '#f5f5f7',
} as const;

export const dotColor = (isDark: boolean) => (isDark ? DOT_COLOR.dark : DOT_COLOR.light);

/** 히어로 컨테이너 id — ScrollDot이 핸드오프 구간을 계산할 때 찾는다 */
export const HERO_ID = 'hero';

/** 히어로 스크롤 진행도. 이 지점부터 캔버스 대신 ScrollDot이 점을 그린다 */
export const P_HANDOFF = 0.95;

/** ScrollDot이 버튼 중앙에 내려앉았을 때 그 버튼 요소에 보내는 이벤트 */
export const DOT_ARRIVED_EVENT = 'dot:arrived';

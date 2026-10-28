import s from './design.module.css';

/**
 * 경력기술서 — /design/
 * 이력서(resume/design-resume.html)와 같은 토스 톤: 흰 바탕, 회색 카드와 칩, 핵심 숫자만 파랑.
 * 화면과 인쇄(PDF) 모양이 같고, 이력서와 같은 사실만 담는다.
 */

const EMAIL = 'qazseeszaq3219@gmail.com';

type Project = {
  name: string;
  period: string;
  role: string;
  team?: string;
  background: string;
  tasks: string[];
  results: string[];
  tools: string;
  url?: string;
};

type Career = {
  company: string;
  period: string;
  months: string;
  type: string;
  position: string;
  about: string;
  url?: string;
  projects: Project[];
};

const CAREERS: Career[] = [
  {
    company: '동훈아이텍',
    period: '2023.08 – 재직 중',
    months: '3년 3개월',
    type: '정규직',
    position: 'R&D센터 / UI/UX 디자인 및 구현',
    about: '기업 보안 솔루션 회사. 디자이너 없이 UI/UX 디자인부터 구현까지 담당.',
    projects: [
      {
        name: '보안 자산관리 솔루션 Keyrke',
        period: '2023.08 – 현재',
        role: 'UI/UX 디자인 및 구현 (1인 담당)',
        team: '백엔드 3, 디자인 · 프론트엔드 1 (본인), PM 1',
        background: '기능이 많고 화면마다 버튼, 표, 필터 모양이 달라 하나의 제품으로 보이지 않았습니다.',
        tasks: [
          '전체 화면의 정보 구조와 흐름을 설계하고 Figma로 시안을 직접 디자인',
          '공통 UI 요소의 크기, 간격, 상태 규칙을 정리해 디자인 시스템과 공통 컴포넌트 62종 구축',
          '날짜, 사용자, 상태, 정책별로 나뉘어 있던 검색을 태그 필터 하나로 통합',
          '500개 이상의 노드를 다루는 조직도 트리 화면 설계 (펼치기, 끌어서 이동, 다중 선택)',
          '스토리지 사용량, 정책 준수율 등 보고서 차트 화면 설계',
        ],
        results: [
          '화면마다 달랐던 UI를 하나의 규칙으로 통일',
          '새 화면 제작 속도 약 2배 향상',
          '현대모비스, 현대오토에버, 현대케피코 납품 및 운영',
        ],
        tools: 'Figma, Vue',
      },
      {
        name: '골프장 운영 시스템 HILLMARU',
        period: '2026',
        role: '요구사항 수집, UI/UX 디자인 및 구현, 시연',
        background: '골프장 본사, 운영팀, 지점이 운영 개선 제안과 매출 현황을 함께 보고 결정할 화면이 필요했습니다.',
        tasks: [
          '골프장 현장을 방문해 실사용자 요구사항 수집',
          '제안 등록부터 검토, 승인까지 이어지는 운영 제안 흐름과 처리 이력 화면 디자인',
          '운영 현황과 매출을 한눈에 보는 대시보드 디자인',
          '조직과 결재 단계에 따라 보이는 지점과 권한이 달라지는 관리 화면 설계',
          '시안을 화면으로 구현해 시연하고 피드백 반영',
        ],
        results: ['시연 후 실제 운영에 채택'],
        tools: 'Figma, React',
        url: 'https://pocheon.hillmaru.com/',
      },
    ],
  },
  {
    company: 'SnapClub',
    period: '2026.04 – 진행 중',
    months: '7개월',
    type: '프리랜서 (본업 병행)',
    position: '키오스크 UI 설계 및 제작',
    about: '호주 멜버른 셀프 포토부스 브랜드.',
    url: 'https://snap-club.com/',
    projects: [
      {
        name: '셀프 포토부스 키오스크 리뉴얼',
        period: '2026.04 – 현재',
        role: 'UI/UX 디자인 및 구현, 운영',
        background: '손님이 직원 도움 없이 결제부터 촬영, 꾸미기, 저장까지 혼자 진행해야 했습니다.',
        tasks: [
          '한 화면에 결정 하나만 두는 원칙으로 대기부터 QR 저장까지 15단계 흐름 재설계',
          '키오스크 전 화면과 관리자 화면의 UI를 Figma로 직접 디자인',
          '매장별로 색과 글꼴만 바꿔 적용하는 테마 시스템 설계 (기본 화면은 유지)',
          '촬영 전 보정 정도를 손님이 직접 고르는 화면 설계 (기본값 끔)',
          '사진 합성, 프레임 편집기, 매출 및 기기 상태 관리자 화면 17개 제작',
        ],
        results: ['직원 안내 없이 손님 혼자 끝까지 이용', '호주 매장에서 실제 운영 중'],
        tools: 'Figma, React',
      },
    ],
  },
  {
    company: '윈앤티켓',
    period: '2025.11 – 2026.03',
    months: '5개월',
    type: '프리랜서',
    position: 'UI/UX 디자인 및 구현',
    about: '공연, 레저, 숙박 티켓 커머스 플랫폼.',
    url: 'https://www.winnticket.co.kr/',
    projects: [
      {
        name: '티켓 커머스 플랫폼',
        period: '2025.11 – 2026.03',
        role: 'UI/UX 디자인 및 구현 전담',
        team: '풀스택 1, 백엔드 2',
        background: '고객, 관리자, 현장 직원이 하나의 서비스를 서로 다른 목적으로 사용해야 했습니다.',
        tasks: [
          '쇼핑몰, 관리자, 현장 입장 화면을 사용자별로 나누어 Figma로 디자인',
          '상품 탐색부터 결제, 포인트 결제까지 구매 흐름 설계',
          '배너와 팝업을 기간별로 예약 노출하는 관리 화면 디자인',
          'QR을 찍으면 바로 입장 결과를 보여주는 현장 입장 화면 디자인',
        ],
        results: ['세 가지 사용자 화면을 하나의 서비스로 출시', '현장 입장 처리 3초 이내'],
        tools: 'Figma, React',
      },
    ],
  },
  {
    company: '통인익스프레스',
    period: '2025.03 – 2025.08',
    months: '6개월',
    type: '프리랜서',
    position: 'UI/UX 디자인 및 구현',
    about: '이사 전문 브랜드. 이전 근무처에서 재의뢰.',
    url: 'https://www.tongin.com/#/',
    projects: [
      {
        name: '태블릿 전자계약 웹앱',
        period: '2025.03 – 2025.08',
        role: 'UI/UX 디자인 및 구현 (1인 담당)',
        team: '백엔드 1, 디자인 · 프론트엔드 1 (본인), 기획 1',
        background: '종이 계약서 한 건 처리에 25분이 걸렸고, 서명까지 완료하는 고객이 절반 정도였습니다.',
        tasks: [
          '고객이 실제로 확인하는 순서에 맞춰 계약 항목 재구성',
          '태블릿 계약 화면과 관리자 화면을 Figma로 직접 디자인',
          '태블릿 터치 환경 기준 설계 (버튼 최소 44px, 넘기기 동작)',
          '문자 링크로 고객이 서명하면 영업사원 화면에 실시간 반영',
          '계약 현황 및 일별, 월별 추이 관리자 화면 제작',
        ],
        results: ['현장 계약 처리 시간 25분 → 10분', '전자서명 완료율 52% → 87%'],
        tools: 'Figma, React',
      },
    ],
  },
  {
    company: '통인익스프레스',
    period: '2022.05 – 2022.11',
    months: '7개월',
    type: '정규직',
    position: '디자인팀 / 웹 퍼블리셔',
    about: '이사 전문 브랜드.',
    url: 'https://www.tongin.com/#/',
    projects: [
      {
        name: '홈앤무브 웹사이트 전면 개편',
        period: '2022.05 – 2022.11',
        role: 'UI 디자인 및 마크업 (1인 담당)',
        background: '디자인 시안 전달과 수정이 반복되며 작업 기간이 길어졌습니다.',
        tasks: [
          'UI 디자인부터 마크업까지 한 사람이 맡아 화면에서 바로 확인하며 작업',
          '개편 이후 사내 웹사이트 기능 추가 및 유지보수',
        ],
        results: ['디자인과 퍼블리싱 1인 수행으로 시안 왕복 없이 개편 완료'],
        tools: 'Photoshop, Illustrator, HTML / CSS',
      },
    ],
  },
];

/** 성과 문장 안의 숫자(→ 포함)만 파랗게 */
function Highlight({ text }: { text: string }) {
  const parts = text.split(/(\d[\d.,]*\s*(?:→\s*\d[\d.,]*)?\s*(?:%|배|분|초|종|개)?)/);
  return (
    <>
      {parts.map((part, i) => (i % 2 === 1 ? <b key={i}>{part}</b> : part))}
    </>
  );
}

export default function DesignPortfolio() {
  return (
    <main className={s.page}>
      <header className={s.head}>
        <p className={s.role}>경력기술서 · 프로덕트 UI/UX 디자이너 지원</p>
        <h1 className={s.name}>허정연</h1>
        <p className={s.one}>시각디자인을 전공하고, 화면 설계부터 구현까지 직접 해온 디자이너</p>
        <div className={s.chips}>
          <span><b>메일</b>{EMAIL}</span>
          <span><b>총 경력</b>약 4년</span>
          <span><b>학력</b>한양여자대학교 시각미디어디자인과 졸업</span>
        </div>
      </header>

      <section className={s.section}>
        <h2>경력 요약</h2>
        <ul className={s.summary}>
          {CAREERS.map((c) => (
            <li key={c.company + c.period}>
              <div className={s.when}>
                {c.period.replace(' – 재직 중', ' – 현재').replace(' – 진행 중', ' – 현재')}
                <span className={c.period.includes('중') ? s.tagNow : s.tag}>
                  {c.period.includes('재직') ? '재직 중' : c.type}
                </span>
              </div>
              <div>
                <strong>{c.company}</strong>
                <span className={s.muted}>{c.position}</span>
              </div>
              <span className={s.months}>{c.months}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={s.section}>
        <h2>경력 상세</h2>
        {CAREERS.map((c) => (
          <article key={c.company + c.period} className={s.career}>
            <header className={s.careerHead}>
              <h3>{c.company}</h3>
              <p className={s.muted}>
                {c.period} · {c.type} · {c.position}
              </p>
              <p className={s.about}>
                {c.about}
                {c.url && (
                  <a href={c.url} target="_blank" rel="noreferrer">
                    {new URL(c.url).hostname.replace(/^www\./, '')}
                  </a>
                )}
              </p>
            </header>

            {c.projects.map((p) => (
              <div key={p.name} className={s.card}>
                <div className={s.cardTop}>
                  <h4>{p.name}</h4>
                  <span>{p.period}</span>
                </div>
                <p className={s.cardRole}>
                  {p.role}
                  {p.team && <> · 팀 {p.team}</>}
                </p>

                <dl className={s.rows}>
                  <div>
                    <dt>배경</dt>
                    <dd>{p.background}</dd>
                  </div>
                  <div>
                    <dt>주요 업무</dt>
                    <dd>
                      <ul>
                        {p.tasks.map((x) => <li key={x}>{x}</li>)}
                      </ul>
                    </dd>
                  </div>
                  <div>
                    <dt>성과</dt>
                    <dd>
                      <ul>
                        {p.results.map((x) => (
                          <li key={x}>
                            <Highlight text={x} />
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                  <div>
                    <dt>사용 도구</dt>
                    <dd>
                      {p.tools}
                      {p.url && (
                        <a href={p.url} target="_blank" rel="noreferrer">
                          {new URL(p.url).hostname}
                        </a>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            ))}
          </article>
        ))}
      </section>

      <section className={s.section}>
        <h2>보유 기술</h2>
        <dl className={s.skills}>
          <dt>디자인</dt>
          <dd>
            {['Figma', 'Illustrator', 'Photoshop'].map((x) => <span key={x}>{x}</span>)}
          </dd>
          <dt>구현</dt>
          <dd>
            {['HTML · CSS', 'JavaScript', 'React', 'Vue'].map((x) => <span key={x}>{x}</span>)}
          </dd>
        </dl>
      </section>
    </main>
  );
}

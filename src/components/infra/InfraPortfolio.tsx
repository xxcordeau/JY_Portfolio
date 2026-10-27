import s from './infra.module.css';

/**
 * IT 고객 엔지니어(인프라) 직무용 단독 페이지 — /infra/
 * 프론트엔드 포트폴리오와 달리 정적 콘텐츠만 쓴다 (Supabase 미사용).
 * 이력서(영문)와 같은 사실만 담고, 해보지 않은 기술은 '학습 중'으로 구분한다.
 */

const EMAIL = 'qazseeszaq3219@gmail.com';

type Level = 'done' | 'near' | 'next';

const LEVEL_LABEL: Record<Level, string> = {
  done: '해봤어요',
  near: '비슷한 경험',
  next: '학습 중',
};

const FIT: { req: string; level: Level; evidence: string }[] = [
  {
    req: '컴퓨팅 인프라 문제 진단·해결',
    level: 'done',
    evidence: '호주 매장 키오스크 PC에 원격으로 들어가 로그로 원인을 찾고 복구했어요.',
  },
  {
    req: '장비 장애 대응·복구',
    level: 'done',
    evidence: '카메라, 결제 단말, 프린터가 멈추면 현장 복구 순서를 안내하고 코드에서 원인을 고쳤어요.',
  },
  {
    req: '외부 협력업체와 문제 해결',
    level: 'done',
    evidence: '결제 단말 장애가 단말 펌웨어 문제인 걸 확인하고, 근거를 정리해 벤더(Nayax)에 넘겼어요.',
  },
  {
    req: 'Windows · Linux 서버 관리',
    level: 'done',
    evidence: 'Windows 키오스크 PC 여러 대의 환경변수, 권한, 드라이버를 관리하고 AWS EC2 Linux 서버를 운영해요.',
  },
  {
    req: '모니터링 · 로그 분석',
    level: 'done',
    evidence: '부스마다 상태를 주기적으로 보내게 하고, 관리자 화면에서 장치 상태를 한눈에 보게 만들었어요.',
  },
  {
    req: '배포 · 설치 · 업그레이드',
    level: 'done',
    evidence: 'Jenkins, Ansible, Harbor로 배포 파이프라인을 만들었어요. 신규 부스 설치와 서버 이전도 맡았어요.',
  },
  {
    req: '스토리지 · 백업',
    level: 'near',
    evidence: 'DB 일일 백업과 디스크 증설을 했고, 업로드가 실패해도 PC에 남은 백업으로 복구할 수 있게 했어요.',
  },
  {
    req: '가상화 · 컨테이너',
    level: 'near',
    evidence: 'Docker로 서비스를 배포하고 Harbor 레지스트리를 운영했어요. VMware와 Kubernetes는 아직 실무 경험이 없어요.',
  },
  {
    req: '기술 영어',
    level: 'near',
    evidence: 'Canon EDSDK, Nayax 같은 영문 SDK 문서와 API 레퍼런스를 읽고 연동했어요.',
  },
];

type Incident = {
  title: string;
  area: string;
  symptom: string;
  cause: string;
  action: string;
  prevent: string;
};

const INCIDENTS: Incident[] = [
  {
    title: '운영 서버가 메모리 부족으로 멈췄어요',
    area: 'Linux · AWS EC2',
    symptom: '서버가 응답하지 않아 부스의 사진 업로드와 QR 다운로드가 멈췄어요.',
    cause: '영상 변환(ffmpeg) 작업이 여러 개 동시에 돌면서 메모리를 다 썼어요.',
    action: '서버를 살리고 메모리 4GB 인스턴스로 올린 뒤 스왑 2GB를 추가했어요.',
    prevent: '영상 변환은 한 번에 하나씩만 돌게 바꿨어요. DB 일일 백업(7일 보관)도 이때 설정했어요.',
  },
  {
    title: '인쇄는 됐는데 QR에 사진이 없었어요',
    area: '네트워크 · 데이터 유실',
    symptom: '손님이 사진은 받았는데 QR로 들어가면 사진이 없다는 문의가 반복됐어요.',
    cause: '업로드 재시도가 서버 오류(400)나 50번 실패 후에 작업을 버리고 있었어요.',
    action: '부스 PC에 남아 있던 백업에서 빠진 사진을 찾아 다시 올렸어요.',
    prevent: '성공할 때까지 계속 재시도하도록 바꾸고, PC 백업으로 복구하는 방법을 정식 절차로 만들었어요.',
  },
  {
    title: '업데이트 후 카메라가 촬영을 못 했어요',
    area: '하드웨어 · USB',
    symptom: '카메라는 연결돼 있는데 촬영이 전혀 안 됐어요.',
    cause: '업데이트하면서 앱이 강제 종료됐고, 카메라 연결 세션이 반납되지 않아 다시 열 수 없었어요.',
    action: '현장에 카메라 전원을 껐다 켜는 순서를 안내해서 바로 영업을 다시 했어요.',
    prevent: '앱이 종료될 때 카메라 세션을 꼭 닫도록 고쳐서, 업데이트해도 다시 생기지 않아요.',
  },
  {
    title: '두 지점 카드 결제가 동시에 거절됐어요',
    area: '결제 단말 · 벤더 협업',
    symptom: '두 지점 모두 카드 결제가 거절되면서 판매가 멈췄어요.',
    cause: '단말에 들어간 테스트 단계 펌웨어와 비어 있는 최대 금액 설정이 겹친 문제였어요.',
    action: '우리 코드로는 고칠 수 없는 설정인 걸 확인하고, 펌웨어 버전과 로그를 정리해 Nayax에 전달했어요.',
    prevent: '단말 문제인지 우리 문제인지 구분하는 확인 순서와 복구 순서를 정리했어요.',
  },
  {
    title: '재시작할 때마다 남은 용지 수가 되돌아갔어요',
    area: 'Windows · 권한',
    symptom: '여러 부스에서 프린터 남은 용지 수가 재시작하면 예전 값으로 돌아갔어요.',
    cause: 'ProgramData 폴더에 쓰기 권한이 없어서 저장이 안 되고 있었어요. 같은 증상인 PC가 7대였어요.',
    action: '로그로 쓰기가 거부된 PC를 골라내서 영향 범위를 확인했어요.',
    prevent: '쓰기가 막히면 사용자 폴더(LocalAppData)에 저장하도록 바꿨어요.',
  },
  {
    title: '새로 설치한 부스가 관리 화면에 안 보였어요',
    area: 'Windows · 장비 등록',
    symptom: '신규 부스를 설치했는데 관리자 화면에 나타나지 않았어요.',
    cause: '같은 이미지로 설치해서 PC 이름이 겹쳤고, 서버가 중복 장비로 보고 등록을 막았어요.',
    action: '부스마다 고유 시리얼을 환경변수로 넣어 다시 등록했어요.',
    prevent: '환경변수가 바로 반영되지 않는 문제까지 처리한 설치 스크립트를 만들었어요.',
  },
];

const FLOW = [
  {
    title: '매장 장비',
    items: ['Canon 카메라 · USB', 'Nayax 결제 단말 · 시리얼(COM)', '포토 프린터 · USB 드라이버'],
  },
  {
    title: 'Windows 키오스크 PC',
    items: ['C# 장치 데몬이 장비 제어', '앱과 데몬은 IPC로 통신', '사진 로컬 백업 · 업로드 재시도'],
  },
  {
    title: 'AWS 서버 (Linux)',
    items: ['NestJS API · PostgreSQL', '영상 변환 작업 큐', 'DB 일일 백업 · 관리자 화면'],
  },
];

const EXPERIENCE = [
  {
    company: '동훈아이텍',
    role: 'R&D센터 · 개발자 (정규직)',
    period: '2023.08 – 재직 중',
    items: [
      'Jenkins, Ansible, Harbor로 CI/CD 파이프라인을 처음부터 만들어 수동 배포를 없앴어요.',
      '보안 자산관리 플랫폼 Keyrke를 개발하고 유지보수해요. 자산 탐지, 인벤토리, 취약점 점검, 보고서 기능이 있어요.',
      'Keyrke는 현대모비스, 현대오토에버, 현대케피코에 납품돼 운영 중이에요.',
      '기업 고객이 쓰는 CyberArk, BigID 관리 콘솔을 만들었어요.',
      'HILLMARU 골프장 관리 시스템은 포천 현장에 직접 가서 요구사항을 듣고 시연까지 했어요. 시제품이 실제 운영에 채택됐어요.',
    ],
  },
  {
    company: 'SnapClub (호주 멜버른)',
    role: '포토부스 키오스크 · 프리랜서 (본업 병행)',
    period: '2026.04 – 현재',
    items: [
      '오래된 WPF 키오스크를 분석해서 Electron, React, NestJS로 새로 만들었어요. 호주 매장에서 운영 중이에요.',
      '카메라, 결제 단말, 프린터를 C# 데몬으로 연결했어요.',
      '장치 원격 관리와 매출 분석이 되는 관리자 화면을 만들었어요.',
      'AWS 계정 간 서버 이전, 백업, 장애 대응까지 운영을 맡고 있어요.',
    ],
  },
  {
    company: '윈앤티켓',
    role: '티켓 커머스 · 프리랜서',
    period: '2025.11 – 2026.03',
    items: [
      'Spring Boot, MyBatis, PostgreSQL로 API 50개 이상을 만들었어요.',
      '공연장 입구 QR·바코드 검증을 1건당 3초 안에 처리하게 했어요.',
      'KCP 결제와 3단계 권한 관리를 붙였어요.',
    ],
  },
  {
    company: '통인익스프레스',
    role: '전자계약 시스템 · 프리랜서',
    period: '2025.03 – 2025.08',
    items: ['종이 이사 계약을 태블릿 웹앱으로 바꿔 현장 처리 시간을 25분에서 10분으로 줄였어요.'],
  },
  {
    company: '통인익스프레스',
    role: '웹 퍼블리셔 (정규직)',
    period: '2022.05 – 2022.11',
    items: ['홈앤무브 웹사이트를 혼자 다시 만들고 사내 웹 시스템을 유지보수했어요.'],
  },
];

const SKILLS: { group: string; items: { name: string; level?: Level }[] }[] = [
  {
    group: 'OS · 서버',
    items: [{ name: 'Windows' }, { name: 'Linux (Ubuntu)' }, { name: 'Nginx' }, { name: 'AWS EC2 · S3' }],
  },
  {
    group: '배포 · 컨테이너',
    items: [
      { name: 'Docker' },
      { name: 'Jenkins' },
      { name: 'Ansible' },
      { name: 'Harbor' },
      { name: 'Kubernetes', level: 'next' },
      { name: 'VMware', level: 'next' },
    ],
  },
  {
    group: '하드웨어 연동',
    items: [{ name: 'Canon EDSDK' }, { name: 'Nayax 결제 단말' }, { name: '포토 프린터' }, { name: 'C# 데몬 · IPC' }],
  },
  {
    group: '백엔드 · 데이터',
    items: [{ name: 'PostgreSQL' }, { name: 'NestJS' }, { name: 'Spring Boot' }, { name: 'REST · WebSocket' }],
  },
  {
    group: '보안 솔루션',
    items: [{ name: 'CyberArk' }, { name: 'BigID' }, { name: '자산 탐지 · 취약점 점검' }],
  },
];

function Badge({ level }: { level: Level }) {
  return <span className={`${s.badge} ${s[`badge_${level}`]}`}>{LEVEL_LABEL[level]}</span>;
}

export default function InfraPortfolio() {
  return (
    <div className={s.root}>
      <main className={s.page}>
        <header className={s.hero}>
          <p className={s.heroLabel}>IT 고객 엔지니어 지원 · 툴 컴퓨팅 및 서버 인프라</p>
          <h1 className={s.heroTitle}>
            장비에 붙은 컴퓨터를
            <br />
            고치고 지켜온
            <br />
            허정연이에요
          </h1>
          <p className={s.heroDesc}>
            보안 솔루션 회사에서 4년 가까이 기업용 시스템을 만들고 고객사에 배포해왔어요.
            호주 매장 키오스크의 PC, 장비, 서버도 직접 운영하고 있어요.
          </p>

          <ul className={s.stats}>
            <li>
              <span>납품·운영</span>
              <strong>현대 계열 3곳</strong>
            </li>
            <li>
              <span>장애 대응 사례</span>
              <strong>6건</strong>
            </li>
            <li>
              <span>배포 자동화</span>
              <strong>CI/CD 구축</strong>
            </li>
          </ul>

          <div className={s.heroActions}>
            <a className={s.btnPrimary} href={`mailto:${EMAIL}`}>메일 보내기</a>
            <a className={s.btnSecondary} href="https://github.com/xxcordeau" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </header>

        <section className={s.section} aria-labelledby="fit">
          <h2 id="fit" className={s.title}>공고에 맞춰 정리했어요</h2>
          <p className={s.desc}>주요 책임과 핵심 역량을 제 경험과 하나씩 맞춰봤어요.</p>
          <ul className={s.list}>
            {FIT.map((f) => (
              <li key={f.req} className={s.listItem}>
                <div className={s.listHead}>
                  <strong>{f.req}</strong>
                  <Badge level={f.level} />
                </div>
                <p>{f.evidence}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className={s.section} aria-labelledby="incidents">
          <h2 id="incidents" className={s.title}>이런 장애를 해결했어요</h2>
          <p className={s.desc}>호주 매장 키오스크와 서버를 운영하면서 직접 맡은 일이에요. 눌러서 자세히 볼 수 있어요.</p>
          <div className={s.accordion}>
            {INCIDENTS.map((inc, i) => (
              <details key={inc.title} className={s.acc} open={i === 0}>
                <summary className={s.accHead}>
                  <span className={s.accText}>
                    <span className={s.accArea}>{inc.area}</span>
                    <strong>{inc.title}</strong>
                  </span>
                  <span className={s.chevron} aria-hidden="true" />
                </summary>
                <dl className={s.accBody}>
                  <div><dt>증상</dt><dd>{inc.symptom}</dd></div>
                  <div><dt>원인</dt><dd>{inc.cause}</dd></div>
                  <div><dt>조치</dt><dd>{inc.action}</dd></div>
                  <div className={s.accPrevent}><dt>재발 방지</dt><dd>{inc.prevent}</dd></div>
                </dl>
              </details>
            ))}
          </div>
        </section>

        <section className={s.section} aria-labelledby="system">
          <h2 id="system" className={s.title}>지금 운영하는 시스템이에요</h2>
          <p className={s.desc}>장비에 붙은 PC와 서버를 같이 다룬다는 점이 툴 컴퓨팅과 가장 닮았어요.</p>
          <ol className={s.flow}>
            {FLOW.map((step, i) => (
              <li key={step.title} className={s.flowStep}>
                <span className={s.flowNum}>{i + 1}</span>
                <strong>{step.title}</strong>
                <ul>
                  {step.items.map((it) => <li key={it}>{it}</li>)}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        <section className={s.section} aria-labelledby="exp">
          <h2 id="exp" className={s.title}>경력</h2>
          <ol className={s.jobs}>
            {EXPERIENCE.map((e) => (
              <li key={e.company + e.period} className={s.job}>
                <div className={s.jobHead}>
                  <strong>{e.company}</strong>
                  <span>{e.period}</span>
                </div>
                <p className={s.jobRole}>{e.role}</p>
                <ul className={s.jobItems}>
                  {e.items.map((it) => <li key={it}>{it}</li>)}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        <section className={s.section} aria-labelledby="skills">
          <h2 id="skills" className={s.title}>다룰 수 있는 기술</h2>
          <div className={s.skillGroups}>
            {SKILLS.map((g) => (
              <div key={g.group} className={s.skillGroup}>
                <p className={s.skillName}>{g.group}</p>
                <ul className={s.chips}>
                  {g.items.map((it) => (
                    <li key={it.name} className={it.level === 'next' ? s.chipNext : s.chip}>
                      {it.name}
                      {it.level === 'next' && <em>{LEVEL_LABEL.next}</em>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className={s.section} aria-labelledby="edu">
          <h2 id="edu" className={s.title}>학력</h2>
          <div className={s.job}>
            <div className={s.jobHead}>
              <strong>한양여자대학교</strong>
              <span>2019.03 – 2021.02</span>
            </div>
            <p className={s.jobRole}>시각미디어디자인과</p>
          </div>
        </section>

        <footer className={s.footer}>
          <p>
            <strong>허정연</strong>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </p>
          <a href="/" className={s.footLink}>개발 포트폴리오 보기</a>
        </footer>
      </main>

      {/* 모바일 하단 고정 버튼 */}
      <div className={s.bottomBar}>
        <a className={s.btnPrimary} href={`mailto:${EMAIL}`}>메일 보내기</a>
      </div>
    </div>
  );
}

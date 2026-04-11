import { useRef, useCallback } from 'react';
import styled from 'styled-components';
import { useAbout } from '../hooks/useAbout';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { User, Mail, Phone, Calendar } from 'lucide-react';

/* ── Wrapper ── */
const AboutSection = styled.section<{ $isDark: boolean }>`
  min-height: 100vh;
  padding: 120px 0;
  background: ${p => p.$isDark ? '#0a0a0a' : '#f5f5f7'};
  transition: background 0.3s ease;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    padding: 80px 0;
    display: block;
  }
`;

const Inner = styled.div`
  width: 100%;
`;

const TitleRow = styled.div`
  padding: 0 12vw;
  margin-bottom: 48px;

  @media (max-width: 768px) {
    padding: 0 20px;
    margin-bottom: 32px;
  }
`;

const SectionTitle = styled.h2<{ $isDark: boolean }>`
  font-size: 52px;
  font-weight: 700;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 12px 0;
  letter-spacing: -1.5px;
  line-height: 1;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 17px;
  color: #86868b;
  margin: 0;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

/* ── 가로 스크롤 트랙 ── */
const ScrollTrack = styled.div`
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding: 10px 0 20px 12vw;
  scroll-snap-type: x proximity;
  scroll-padding-left: 12vw;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  cursor: grab;
  user-select: none;
  align-items: flex-start;
  &::-webkit-scrollbar { display: none; }

  @media (max-width: 768px) {
    padding: 0 0 0 20px;
    gap: 16px;
  }
`;

/* ── 공통 카드 ── */
const Card = styled.div<{ $isDark: boolean; $width?: string }>`
  flex: 0 0 ${p => p.$width ?? '340px'};
  scroll-snap-align: start;
  border-radius: 24px;
  background: ${p => p.$isDark ? '#111111' : '#ffffff'};
  padding: 32px;

  @media (max-width: 768px) {
    flex: 0 0 280px;
    padding: 24px;
  }
`;

/* ── 카드 상단 레이블 ── */
const CardLabel = styled.div<{ $isDark: boolean }>`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${p => p.$isDark ? '#6e6e73' : '#aeaeb2'};
  margin-bottom: 24px;
`;

/* ── 카드 타이틀 ── */
const CardTitle = styled.h3<{ $isDark: boolean }>`
  font-size: 28px;
  font-weight: 700;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 6px 0;
  letter-spacing: -0.7px;
  line-height: 1.1;
  transition: color 0.3s ease;
`;

const CardSubtitle = styled.div`
  font-size: 15px;
  color: #86868b;
  margin-bottom: 20px;
  font-weight: 400;
`;

/* ── 프로필 아이템 ── */
const ProfileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const ProfileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ProfileIcon = styled.div<{ $isDark: boolean }>`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 15px;
    height: 15px;
    color: #86868b;
  }
`;

const ProfileContent = styled.div``;

const ProfileLabelText = styled.div`
  font-size: 10px;
  color: #86868b;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 2px;
`;

const ProfileValue = styled.div<{ $isDark: boolean }>`
  font-size: 15px;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  font-weight: 400;
  letter-spacing: -0.2px;
  transition: color 0.3s ease;
  word-break: break-all;
`;

/* ── 기술 스택 ── */
const SkillCategories = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SkillCategory = styled.div``;

const CategoryName = styled.h4<{ $isDark: boolean }>`
  font-size: 11px;
  font-weight: 500;
  color: ${p => p.$isDark ? '#6e6e73' : '#aeaeb2'};
  margin: 0 0 10px 0;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const BadgeList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
`;

const CATEGORY_COLORS = {
  frontend: { bg: 'rgba(0,122,255,0.1)',   border: 'rgba(0,122,255,0.25)',  text: '#007AFF' },
  backend:  { bg: 'rgba(52,199,89,0.1)',   border: 'rgba(52,199,89,0.25)', text: '#34C759' },
  design:   { bg: 'rgba(255,45,85,0.1)',   border: 'rgba(255,45,85,0.25)', text: '#FF2D55' },
  other:    { bg: 'rgba(88,86,214,0.1)',   border: 'rgba(88,86,214,0.25)', text: '#5856D6' },
} as const;

const SkillBadge = styled.span<{ $category: keyof typeof CATEGORY_COLORS }>`
  display: inline-flex;
  align-items: center;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  background: ${p => CATEGORY_COLORS[p.$category].bg};
  border: 1px solid ${p => CATEGORY_COLORS[p.$category].border};
  color: ${p => CATEGORY_COLORS[p.$category].text};
`;

/* ── 경력/학력 카드 내용 ── */
const InfoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
`;

const InfoTitle = styled.h4<{ $isDark: boolean }>`
  font-size: 20px;
  font-weight: 600;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 4px 0;
  letter-spacing: -0.4px;
  transition: color 0.3s ease;
`;

const InfoSubtitle = styled.div`
  font-size: 14px;
  color: #86868b;
`;

const InfoPeriod = styled.div<{ $isDark: boolean }>`
  font-size: 12px;
  color: ${p => p.$isDark ? '#a1a1a6' : '#86868b'};
  font-weight: 500;
  white-space: nowrap;
  padding: 5px 12px;
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'};
  border-radius: 20px;
  flex-shrink: 0;
`;

const InfoDescription = styled.p`
  font-size: 14px;
  color: #86868b;
  line-height: 1.65;
  margin: 0;
  letter-spacing: -0.1px;
`;

const AchievementList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 12px 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

const AchievementItem = styled.li<{ $isDark: boolean }>`
  font-size: 13px;
  color: ${p => p.$isDark ? '#c7c7cc' : '#6e6e73'};
  padding-left: 16px;
  position: relative;
  line-height: 1.6;

  &::before {
    content: '–';
    position: absolute;
    left: 0;
    color: #86868b;
  }
`;

/* ── 스켈레톤 ── */
const shimmer = `
  @keyframes sk-shimmer {
    0%   { background-position: -400% 0; }
    100% { background-position:  400% 0; }
  }
`;

const SkeletonBlock = styled.div<{ $isDark: boolean; $w?: string; $h?: string }>`
  height: ${p => p.$h ?? '14px'};
  border-radius: 8px;
  width: ${p => p.$w ?? '100%'};
  background: linear-gradient(90deg,
    ${p => p.$isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} 25%,
    ${p => p.$isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.09)'} 50%,
    ${p => p.$isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} 75%
  );
  background-size: 400% 100%;
  animation: sk-shimmer 1.4s ease infinite;
  ${shimmer}
`;

/* ── 번역 ── */
const translations = {
  ko: {
    title: '소개',
    subtitle: '사용자 중심의 인터페이스를 만드는 프론트엔드 개발자입니다.',
    profile: '프로필',
    skills: '기술 스택',
    education: '학력',
    experience: '경력',
    name: '이름', birth: '생년월일', email: '이메일', phone: '연락처',
  },
  en: {
    title: 'About',
    subtitle: 'Frontend developer creating user-centered interfaces.',
    profile: 'Profile',
    skills: 'Skills',
    education: 'Education',
    experience: 'Experience',
    name: 'Name', birth: 'Birth', email: 'Email', phone: 'Phone',
  },
};

const categoryTranslations = {
  ko: { frontend: '프론트엔드', backend: '백엔드', design: '디자인', other: '기타' },
  en: { frontend: 'Frontend',   backend: 'Backend',  design: 'Design',  other: 'Other'  },
};

export default function About() {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const { skills, education, experiences, loading } = useAbout();
  const t = translations[language];
  const ct = categoryTranslations[language];

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (trackRef.current?.offsetLeft ?? 0);
    scrollLeft.current = trackRef.current?.scrollLeft ?? 0;
    if (trackRef.current) trackRef.current.style.cursor = 'grabbing';
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    trackRef.current.scrollLeft = scrollLeft.current - walk;
  }, []);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = 'grab';
  }, []);

  return (
    <AboutSection id="about" $isDark={isDark}>
      <Inner>
        <TitleRow>
          <SectionTitle $isDark={isDark}>{t.title}</SectionTitle>
          <SectionSubtitle>{t.subtitle}</SectionSubtitle>
        </TitleRow>

        <ScrollTrack
          ref={trackRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {/* ── 프로필 카드 ── */}
          <Card $isDark={isDark} $width="300px">
            <CardLabel $isDark={isDark}>{t.profile}</CardLabel>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <SkeletonBlock $isDark={isDark} $w="34px" $h="34px" style={{ borderRadius: 10, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <SkeletonBlock $isDark={isDark} $w="40%" $h="10px" style={{ marginBottom: 6 }} />
                      <SkeletonBlock $isDark={isDark} $w="70%" $h="15px" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ProfileList>
                {[
                  { icon: <User />,     label: t.name,  value: '허정연' },
                  { icon: <Calendar />, label: t.birth, value: '2000.01.28' },
                  { icon: <Mail />,     label: t.email, value: 'qazseeszaq3219@gmail.com' },
                  { icon: <Phone />,    label: t.phone, value: '010-2863-7447' },
                ].map(({ icon, label, value }) => (
                  <ProfileItem key={label}>
                    <ProfileIcon $isDark={isDark}>{icon}</ProfileIcon>
                    <ProfileContent>
                      <ProfileLabelText>{label}</ProfileLabelText>
                      <ProfileValue $isDark={isDark}>{value}</ProfileValue>
                    </ProfileContent>
                  </ProfileItem>
                ))}
              </ProfileList>
            )}
          </Card>

          {/* ── 기술 스택 카드 ── */}
          <Card $isDark={isDark} $width="400px">
            <CardLabel $isDark={isDark}>{t.skills}</CardLabel>
            {loading ? (
              <SkillCategories>
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkillCategory key={i}>
                    <SkeletonBlock $isDark={isDark} $w="30%" $h="11px" style={{ marginBottom: 10 }} />
                    <BadgeList>
                      {Array.from({ length: 4 }).map((__, j) => (
                        <SkeletonBlock key={j} $isDark={isDark} $w="72px" $h="30px" style={{ borderRadius: 20 }} />
                      ))}
                    </BadgeList>
                  </SkillCategory>
                ))}
              </SkillCategories>
            ) : (
              <SkillCategories>
                {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                  <SkillCategory key={category}>
                    <CategoryName $isDark={isDark}>{ct[category as keyof typeof ct]}</CategoryName>
                    <BadgeList>
                      {categorySkills.map((skill, i) => (
                        <SkillBadge key={i} $category={skill.category}>{skill.name}</SkillBadge>
                      ))}
                    </BadgeList>
                  </SkillCategory>
                ))}
              </SkillCategories>
            )}
          </Card>

          {/* ── 학력 카드들 ── */}
          {loading
            ? Array.from({ length: 2 }).map((_, i) => (
                <Card key={`edu-sk-${i}`} $isDark={isDark} $width="340px">
                  <CardLabel $isDark={isDark}>{t.education}</CardLabel>
                  <SkeletonBlock $isDark={isDark} $w="55%" $h="20px" style={{ marginBottom: 8 }} />
                  <SkeletonBlock $isDark={isDark} $w="40%" $h="14px" style={{ marginBottom: 16 }} />
                  <SkeletonBlock $isDark={isDark} $w="100%" $h="13px" style={{ marginBottom: 6 }} />
                  <SkeletonBlock $isDark={isDark} $w="80%" $h="13px" />
                </Card>
              ))
            : education.map((edu, i) => (
                <Card key={`edu-${i}`} $isDark={isDark} $width="340px">
                  <CardLabel $isDark={isDark}>{t.education}</CardLabel>
                  <InfoHeader>
                    <div>
                      <InfoTitle $isDark={isDark}>{edu.school[language]}</InfoTitle>
                      <InfoSubtitle>{edu.degree[language]} · {edu.major[language]}</InfoSubtitle>
                    </div>
                    <InfoPeriod $isDark={isDark}>{edu.period}</InfoPeriod>
                  </InfoHeader>
                  {edu.description[language] && (
                    <InfoDescription>{edu.description[language]}</InfoDescription>
                  )}
                </Card>
              ))
          }

          {/* ── 경력 카드들 ── */}
          {loading
            ? Array.from({ length: 2 }).map((_, i) => (
                <Card key={`exp-sk-${i}`} $isDark={isDark} $width="360px">
                  <CardLabel $isDark={isDark}>{t.experience}</CardLabel>
                  <SkeletonBlock $isDark={isDark} $w="50%" $h="20px" style={{ marginBottom: 8 }} />
                  <SkeletonBlock $isDark={isDark} $w="35%" $h="14px" style={{ marginBottom: 16 }} />
                  <SkeletonBlock $isDark={isDark} $w="100%" $h="13px" style={{ marginBottom: 6 }} />
                  <SkeletonBlock $isDark={isDark} $w="85%" $h="13px" style={{ marginBottom: 6 }} />
                  <SkeletonBlock $isDark={isDark} $w="70%" $h="13px" />
                </Card>
              ))
            : experiences.map((exp, i) => (
                <Card key={`exp-${i}`} $isDark={isDark} $width="380px">
                  <CardLabel $isDark={isDark}>{t.experience}</CardLabel>
                  <InfoHeader>
                    <div>
                      <InfoTitle $isDark={isDark}>{exp.company[language]}</InfoTitle>
                      <InfoSubtitle>{exp.position[language]}</InfoSubtitle>
                    </div>
                    <InfoPeriod $isDark={isDark}>{exp.period}</InfoPeriod>
                  </InfoHeader>
                  {exp.description[language] && (
                    <InfoDescription>{exp.description[language]}</InfoDescription>
                  )}
                  {exp.achievements[language].length > 0 && (
                    <AchievementList>
                      {exp.achievements[language].map((a, idx) => (
                        <AchievementItem key={idx} $isDark={isDark}>{a}</AchievementItem>
                      ))}
                    </AchievementList>
                  )}
                </Card>
              ))
          }
        </ScrollTrack>
      </Inner>
    </AboutSection>
  );
}

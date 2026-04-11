import styled from 'styled-components';
import { useAbout } from '../hooks/useAbout';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Briefcase, GraduationCap, Code2, User, Mail, Phone, Calendar } from 'lucide-react';

/* ── Wrapper ── */
const AboutSection = styled.section<{ $isDark: boolean }>`
  min-height: 100vh;
  padding: 100px 0;
  background: ${p => p.$isDark ? '#0a0a0a' : '#f5f5f7'};
  transition: background 0.3s ease;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    padding: 80px 0;
    display: block;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 0 40px;

  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

/* ── 두 컬럼 레이아웃 ── */
const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: start;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 48px;
  }
`;

const ColLeft = styled.div``;
const ColRight = styled.div``;

/* ── 섹션 타이틀 ── */
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
  margin: 0 0 48px 0;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 15px;
    margin-bottom: 32px;
  }
`;

/* ── 프로필 ── */
const ProfileGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ProfileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const ProfileIcon = styled.div<{ $isDark: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 16px;
    height: 16px;
    color: #86868b;
  }
`;

const ProfileContent = styled.div``;

const ProfileLabel = styled.div`
  font-size: 11px;
  color: #86868b;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 2px;
`;

const ProfileValue = styled.div<{ $isDark: boolean }>`
  font-size: 16px;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  font-weight: 400;
  letter-spacing: -0.2px;
  transition: color 0.3s ease;
  word-break: break-all;
`;

/* ── 기술 스택 ── */
const BlockTitle = styled.h3<{ $isDark: boolean }>`
  font-size: 38px;
  font-weight: 700;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 32px 0;
  letter-spacing: -1px;
  line-height: 1;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 28px;
    margin-bottom: 24px;
  }
`;

const SkillCategories = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SkillCategory = styled.div``;

const CategoryTitle = styled.h4<{ $isDark: boolean }>`
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
  frontend: { bg: 'rgba(0,122,255,0.1)', border: 'rgba(0,122,255,0.25)', text: '#007AFF' },
  backend:  { bg: 'rgba(52,199,89,0.1)',  border: 'rgba(52,199,89,0.25)',  text: '#34C759' },
  design:   { bg: 'rgba(255,45,85,0.1)',  border: 'rgba(255,45,85,0.25)',  text: '#FF2D55' },
  other:    { bg: 'rgba(88,86,214,0.1)',  border: 'rgba(88,86,214,0.25)', text: '#5856D6' },
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

/* ── 카드 (경력/학력) ── */
const CardsStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Card = styled.div<{ $isDark: boolean }>`
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.9)'};
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'};
  border-radius: 20px;
  padding: 28px;
  backdrop-filter: blur(20px);

  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 16px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;
`;

const CardTitle = styled.h4<{ $isDark: boolean }>`
  font-size: 20px;
  font-weight: 600;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 4px 0;
  letter-spacing: -0.4px;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 17px;
  }
`;

const CardSubtitle = styled.div`
  font-size: 15px;
  color: #86868b;
  font-weight: 400;
`;

const CardPeriod = styled.div<{ $isDark: boolean }>`
  font-size: 12px;
  color: ${p => p.$isDark ? '#a1a1a6' : '#86868b'};
  font-weight: 500;
  white-space: nowrap;
  padding: 5px 12px;
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'};
  border-radius: 20px;
  align-self: flex-start;
  flex-shrink: 0;
`;

const CardDescription = styled.p`
  font-size: 14px;
  color: #86868b;
  line-height: 1.65;
  margin: 10px 0 0 0;
  letter-spacing: -0.1px;
`;

const CardAchievements = styled.ul`
  list-style: none;
  padding: 0;
  margin: 10px 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const CardAchievementItem = styled.li<{ $isDark: boolean }>`
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

/* ── Skeleton ── */
const shimmer = `
  @keyframes sk-shimmer {
    0%   { background-position: -400% 0; }
    100% { background-position:  400% 0; }
  }
`;
const SkeletonLine = styled.div<{ $isDark: boolean; $w?: string; $h?: string }>`
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
const SkeletonBadge = styled.div<{ $isDark: boolean }>`
  height: 30px; width: 72px; border-radius: 20px;
  background: linear-gradient(90deg,
    ${p => p.$isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} 25%,
    ${p => p.$isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.09)'} 50%,
    ${p => p.$isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} 75%
  );
  background-size: 400% 100%;
  animation: sk-shimmer 1.4s ease infinite;
`;
const SkeletonCard = styled.div<{ $isDark: boolean }>`
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)'};
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'};
  border-radius: 20px; padding: 28px;
  display: flex; flex-direction: column; gap: 12px;
`;

/* ── 번역 ── */
const translations = {
  ko: {
    title: '소개', subtitle: '사용자 중심의 인터페이스를 만드는 프론트엔드 개발자입니다.',
    careerTitle: '경력 & 학력', careerSubtitle: '지금까지의 여정과 함께한 팀들입니다.',
    skills: '기술 스택', education: '학력', experience: '경력',
    name: '이름', birth: '생년월일', email: '이메일', phone: '연락처',
  },
  en: {
    title: 'About', subtitle: 'Frontend developer creating user-centered interfaces.',
    careerTitle: 'Career & Education', careerSubtitle: 'The journey and teams I have been part of.',
    skills: 'Skills', education: 'Education', experience: 'Experience',
    name: 'Name', birth: 'Birth', email: 'Email', phone: 'Phone',
  },
};

const categoryTranslations = {
  ko: { frontend: '프론트엔드', backend: '백엔드', design: '디자인', other: '기타' },
  en: { frontend: 'Frontend', backend: 'Backend', design: 'Design', other: 'Other' },
};

interface AboutProps { chapter?: 'profile' | 'career'; }

export default function About({ chapter }: AboutProps = {}) {
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

  const isCareer = chapter === 'career';
  const sectionId = isCareer ? 'career' : 'about';

  /* ── 소개 페이지 ── */
  if (!isCareer) return (
    <AboutSection id={sectionId} $isDark={isDark}>
      <Container>
        <TwoCol>
          {/* 왼쪽: 타이틀 + 프로필 */}
          <ColLeft>
            <SectionTitle $isDark={isDark}>{t.title}</SectionTitle>
            <SectionSubtitle>{t.subtitle}</SectionSubtitle>

            <ProfileGrid>
              {[
                { icon: <User />, label: t.name,  value: '허정연' },
                { icon: <Calendar />, label: t.birth, value: '2000.01.28' },
                { icon: <Mail />, label: t.email, value: 'qazseeszaq3219@gmail.com' },
                { icon: <Phone />, label: t.phone, value: '010-2863-7447' },
              ].map(({ icon, label, value }) => (
                <ProfileItem key={label}>
                  <ProfileIcon $isDark={isDark}>{icon}</ProfileIcon>
                  <ProfileContent>
                    <ProfileLabel>{label}</ProfileLabel>
                    <ProfileValue $isDark={isDark}>{value}</ProfileValue>
                  </ProfileContent>
                </ProfileItem>
              ))}
            </ProfileGrid>
          </ColLeft>

          {/* 오른쪽: 기술 스택 */}
          <ColRight>
            <BlockTitle $isDark={isDark}>{t.skills}</BlockTitle>
            {loading ? (
              <SkillCategories>
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkillCategory key={i}>
                    <SkeletonLine $isDark={isDark} $w="30%" $h="11px" style={{ marginBottom: 10 }} />
                    <BadgeList>
                      {Array.from({ length: 4 }).map((__, j) => <SkeletonBadge key={j} $isDark={isDark} />)}
                    </BadgeList>
                  </SkillCategory>
                ))}
              </SkillCategories>
            ) : (
              <SkillCategories>
                {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                  <SkillCategory key={category}>
                    <CategoryTitle $isDark={isDark}>{ct[category as keyof typeof ct]}</CategoryTitle>
                    <BadgeList>
                      {categorySkills.map((skill, i) => (
                        <SkillBadge key={i} $category={skill.category}>{skill.name}</SkillBadge>
                      ))}
                    </BadgeList>
                  </SkillCategory>
                ))}
              </SkillCategories>
            )}
          </ColRight>
        </TwoCol>
      </Container>
    </AboutSection>
  );

  /* ── 경력 & 학력 페이지 ── */
  return (
    <AboutSection id={sectionId} $isDark={isDark}>
      <Container>
        <SectionTitle $isDark={isDark}>{t.careerTitle}</SectionTitle>
        <SectionSubtitle>{t.careerSubtitle}</SectionSubtitle>

        <TwoCol>
          {/* 왼쪽: 학력 */}
          <ColLeft>
            <BlockTitle $isDark={isDark}>{t.education}</BlockTitle>
            <CardsStack>
              {loading ? Array.from({ length: 2 }).map((_, i) => (
                <SkeletonCard key={i} $isDark={isDark}>
                  <SkeletonLine $isDark={isDark} $w="55%" $h="20px" />
                  <SkeletonLine $isDark={isDark} $w="40%" />
                  <SkeletonLine $isDark={isDark} $w="85%" />
                </SkeletonCard>
              )) : education.map((edu, i) => (
                <Card key={i} $isDark={isDark}>
                  <CardHeader>
                    <div>
                      <CardTitle $isDark={isDark}>{edu.school[language]}</CardTitle>
                      <CardSubtitle>{edu.degree[language]} · {edu.major[language]}</CardSubtitle>
                    </div>
                    <CardPeriod $isDark={isDark}>{edu.period}</CardPeriod>
                  </CardHeader>
                  {edu.description[language] && (
                    <CardDescription>{edu.description[language]}</CardDescription>
                  )}
                </Card>
              ))}
            </CardsStack>
          </ColLeft>

          {/* 오른쪽: 경력 */}
          <ColRight>
            <BlockTitle $isDark={isDark}>{t.experience}</BlockTitle>
            <CardsStack>
              {loading ? Array.from({ length: 2 }).map((_, i) => (
                <SkeletonCard key={i} $isDark={isDark}>
                  <SkeletonLine $isDark={isDark} $w="50%" $h="20px" />
                  <SkeletonLine $isDark={isDark} $w="35%" />
                  <SkeletonLine $isDark={isDark} $w="90%" />
                  <SkeletonLine $isDark={isDark} $w="75%" />
                </SkeletonCard>
              )) : experiences.map((exp, i) => (
                <Card key={i} $isDark={isDark}>
                  <CardHeader>
                    <div>
                      <CardTitle $isDark={isDark}>{exp.company[language]}</CardTitle>
                      <CardSubtitle>{exp.position[language]}</CardSubtitle>
                    </div>
                    <CardPeriod $isDark={isDark}>{exp.period}</CardPeriod>
                  </CardHeader>
                  {exp.description[language] && (
                    <CardDescription>{exp.description[language]}</CardDescription>
                  )}
                  {exp.achievements[language].length > 0 && (
                    <CardAchievements>
                      {exp.achievements[language].map((a, idx) => (
                        <CardAchievementItem key={idx} $isDark={isDark}>{a}</CardAchievementItem>
                      ))}
                    </CardAchievements>
                  )}
                </Card>
              ))}
            </CardsStack>
          </ColRight>
        </TwoCol>
      </Container>
    </AboutSection>
  );
}

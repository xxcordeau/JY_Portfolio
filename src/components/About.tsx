import styled, { css } from 'styled-components';
import { useAbout } from '../hooks/useAbout';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Briefcase, GraduationCap, Code2, User, Mail, Phone, Calendar } from 'lucide-react';

const AboutSection = styled.section<{ $isDark: boolean; $compact: boolean }>`
  min-height: 100vh;
  padding: ${p => p.$compact ? '100px 40px 60px' : '120px 40px'};
  background: ${props => props.$isDark ? '#0a0a0a' : '#f5f5f7'};
  transition: background 0.3s ease;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    padding: 80px 20px;
    display: block;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const SectionTitle = styled.h2<{ $isDark: boolean; $compact: boolean }>`
  font-size: 52px;
  font-weight: 700;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 14px 0;
  letter-spacing: -1.5px;
  line-height: 1;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 36px;
    margin-bottom: 10px;
  }
`;

const SectionSubtitle = styled.p<{ $compact: boolean }>`
  font-size: 18px;
  color: #86868b;
  margin: 0 0 52px 0;
  line-height: 1.5;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 15px;
    margin-bottom: 36px;
  }
`;

const ProfileCard = styled.div<{ $isDark: boolean; $compact: boolean }>`
  margin-bottom: 52px;
  padding-bottom: 52px;
  border-bottom: 1px solid ${props => props.$isDark ? 'rgba(245, 245, 247, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
  transition: border-color 0.3s ease;

  @media (max-width: 768px) {
    margin-bottom: 36px;
    padding-bottom: 36px;
  }
`;

const ProfileGrid = styled.div<{ $compact: boolean }>`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${p => p.$compact ? '16px 32px' : '24px 40px'};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const ProfileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ProfileIcon = styled.div<{ $isDark: boolean; $compact: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;

  svg {
    width: ${p => p.$compact ? '16px' : '18px'};
    height: ${p => p.$compact ? '16px' : '18px'};
    color: #86868b;
  }

  @media (max-width: 768px) {
    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const ProfileContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ProfileLabel = styled.div<{ $isDark: boolean; $compact: boolean }>`
  font-size: 12px;
  color: #86868b;
  margin-bottom: 3px;
  font-weight: 500;
  letter-spacing: 0.2px;
  text-transform: uppercase;

  @media (max-width: 768px) {
    font-size: 11px;
  }
`;

const ProfileValue = styled.div<{ $isDark: boolean; $compact: boolean }>`
  font-size: 16px;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  font-weight: 400;
  letter-spacing: -0.2px;
  transition: color 0.3s ease;
  word-break: break-all;

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const BlocksContainer = styled.div<{ $compact: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 64px;

  @media (max-width: 768px) {
    gap: 48px;
  }
`;

const Block = styled.div``;

const BlockHeader = styled.div<{ $compact: boolean }>`
  margin-bottom: 32px;

  @media (max-width: 768px) {
    margin-bottom: 24px;
  }
`;

const BlockIcon = styled.div<{ $isDark: boolean; $compact: boolean }>`
  display: none;
`;

const BlockTitle = styled.h3<{ $isDark: boolean; $compact: boolean }>`
  font-size: 38px;
  font-weight: 700;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0;
  letter-spacing: -1px;
  line-height: 1;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const SkillCategories = styled.div<{ $compact: boolean }>`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${p => p.$compact ? '20px 32px' : '40px'};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const SkillCategory = styled.div``;

const CategoryTitle = styled.h4<{ $isDark: boolean; $compact: boolean }>`
  font-size: ${p => p.$compact ? '11px' : '12px'};
  font-weight: 400;
  color: ${props => props.$isDark ? '#6e6e73' : '#aeaeb2'};
  margin: 0 0 ${p => p.$compact ? '10px' : '14px'} 0;
  letter-spacing: 1.2px;
  text-transform: uppercase;
`;

const BadgeList = styled.div<{ $compact: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: ${p => p.$compact ? '6px' : '8px'};
`;

const CATEGORY_COLORS = {
  frontend: { bg: 'rgba(0, 122, 255, 0.1)', border: 'rgba(0, 122, 255, 0.25)', text: '#007AFF' },
  backend:  { bg: 'rgba(52, 199, 89, 0.1)',  border: 'rgba(52, 199, 89, 0.25)',  text: '#34C759' },
  design:   { bg: 'rgba(255, 45, 85, 0.1)',  border: 'rgba(255, 45, 85, 0.25)',  text: '#FF2D55' },
  other:    { bg: 'rgba(88, 86, 214, 0.1)',  border: 'rgba(88, 86, 214, 0.25)', text: '#5856D6' },
} as const;

const SkillBadge = styled.span<{ $category: keyof typeof CATEGORY_COLORS; $compact: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: ${p => p.$compact ? '4px 10px' : '6px 14px'};
  border-radius: 20px;
  font-size: ${p => p.$compact ? '12px' : '14px'};
  font-weight: 500;
  letter-spacing: -0.1px;
  background: ${p => CATEGORY_COLORS[p.$category].bg};
  border: 1px solid ${p => CATEGORY_COLORS[p.$category].border};
  color: ${p => CATEGORY_COLORS[p.$category].text};
  transition: all 0.2s ease;

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 4px 10px;
  }
`;

const CardsContainer = styled.div<{ $compact: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${p => p.$compact ? '14px' : '24px'};
`;

const Card = styled.div<{ $isDark: boolean; $compact: boolean }>`
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.9)'};
  border: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
  border-radius: 20px;
  padding: 32px;
  transition: all 0.3s ease;
  backdrop-filter: blur(20px);

  @media (max-width: 768px) {
    padding: 22px;
    border-radius: 16px;
  }
`;

const CardHeader = styled.div<{ $compact: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const CardInfo = styled.div`
  flex: 1;
`;

const CardTitle = styled.h4<{ $isDark: boolean; $compact: boolean }>`
  font-size: 22px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 6px 0;
  letter-spacing: -0.4px;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const CardSubtitle = styled.div<{ $compact: boolean }>`
  font-size: 16px;
  color: #86868b;
  font-weight: 400;
  letter-spacing: -0.2px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const CardPeriod = styled.div<{ $isDark: boolean; $compact: boolean }>`
  font-size: 13px;
  color: ${props => props.$isDark ? '#a1a1a6' : '#86868b'};
  font-weight: 500;
  white-space: nowrap;
  padding: 6px 14px;
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)'};
  border-radius: 20px;
  align-self: flex-start;

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 4px 10px;
  }
`;

const CardDescription = styled.p<{ $compact: boolean }>`
  font-size: 15px;
  color: #86868b;
  line-height: 1.65;
  margin: 16px 0 16px 0;
  letter-spacing: -0.1px;

  @media (max-width: 768px) {
    font-size: 14px;
    margin: 12px 0 12px 0;
  }
`;

const CardAchievements = styled.ul<{ $compact: boolean }>`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CardAchievementItem = styled.li<{ $isDark: boolean; $compact: boolean }>`
  font-size: 14px;
  color: ${props => props.$isDark ? '#c7c7cc' : '#6e6e73'};
  padding-left: 18px;
  position: relative;
  line-height: 1.6;

  &::before {
    content: '–';
    position: absolute;
    left: 0;
    color: #86868b;
  }

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;




// ── Skeleton ─────────────────────────────────────
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
  background: linear-gradient(
    90deg,
    ${p => p.$isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} 25%,
    ${p => p.$isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.09)'} 50%,
    ${p => p.$isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} 75%
  );
  background-size: 400% 100%;
  animation: sk-shimmer 1.4s ease infinite;
  ${shimmer}
`;
const SkeletonBadge = styled.div<{ $isDark: boolean }>`
  height: 32px; width: 80px;
  border-radius: 20px;
  background: linear-gradient(
    90deg,
    ${p => p.$isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} 25%,
    ${p => p.$isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.09)'} 50%,
    ${p => p.$isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} 75%
  );
  background-size: 400% 100%;
  animation: sk-shimmer 1.4s ease infinite;
  ${shimmer}
`;
const SkeletonCard = styled.div<{ $isDark: boolean }>`
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)'};
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'};
  border-radius: 16px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;
// ─────────────────────────────────────────────────

const translations = {
  ko: {
    title: '소개',
    subtitle: '사용자 중심의 인터페이스를 만드는 프론트엔드 개발자입니다.',
    careerTitle: '경력 & 학력',
    careerSubtitle: '지금까지의 여정과 함께한 팀들입니다.',
    skills: '기술 스택',
    education: '학력',
    experience: '경력',
    frontend: '프론트엔드',
    backend: '백엔드',
    design: '디자인',
    other: '기타',
    name: '이름',
    birth: '생년월일',
    email: '이메일',
    phone: '연락처'
  },
  en: {
    title: 'About',
    subtitle: 'Frontend developer creating user-centered interfaces.',
    careerTitle: 'Career & Education',
    careerSubtitle: 'The journey and teams I have been part of.',
    skills: 'Skills',
    education: 'Education',
    experience: 'Experience',
    frontend: 'Frontend',
    backend: 'Backend',
    design: 'Design',
    other: 'Other',
    name: 'Name',
    birth: 'Birth',
    email: 'Email',
    phone: 'Phone'
  }
};

const categoryTranslations = {
  ko: {
    frontend: '프론트엔드',
    backend: '백엔드',
    design: '디자인',
    other: '기타'
  },
  en: {
    frontend: 'Frontend',
    backend: 'Backend',
    design: 'Design',
    other: 'Other'
  }
};

interface AboutProps {
  /**
   * Which chapter to render on a split layout:
   * - 'profile' → title + profile info card + skills
   * - 'career'  → education + experience
   * - undefined → render everything (legacy single-section layout)
   */
  chapter?: 'profile' | 'career';
}

export default function About({ chapter }: AboutProps = {}) {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const { skills, education, experiences, loading } = useAbout();
  const t = translations[language];
  const ct = categoryTranslations[language];

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  const showProfile = chapter === undefined || chapter === 'profile';
  const showSkills = chapter === undefined || chapter === 'profile';
  const showEducation = chapter === undefined || chapter === 'career';
  const showExperience = chapter === undefined || chapter === 'career';
  const sectionId = chapter === 'career' ? 'career' : 'about';
  const compact = chapter !== undefined;

  return (
    <AboutSection id={sectionId} $isDark={isDark} $compact={compact}>
      <Container>
        <SectionTitle $isDark={isDark} $compact={compact}>
          {chapter === 'career' ? t.careerTitle : t.title}
        </SectionTitle>
        <SectionSubtitle $compact={compact}>
          {chapter === 'career' ? t.careerSubtitle : t.subtitle}
        </SectionSubtitle>

        {showProfile && (
          <ProfileCard $isDark={isDark} $compact={compact}>
            <ProfileGrid $compact={compact}>
              <ProfileItem>
                <ProfileIcon $isDark={isDark} $compact={compact}>
                  <User />
                </ProfileIcon>
                <ProfileContent>
                  <ProfileLabel $isDark={isDark} $compact={compact}>{t.name}</ProfileLabel>
                  <ProfileValue $isDark={isDark} $compact={compact}>허정연</ProfileValue>
                </ProfileContent>
              </ProfileItem>

              <ProfileItem>
                <ProfileIcon $isDark={isDark} $compact={compact}>
                  <Calendar />
                </ProfileIcon>
                <ProfileContent>
                  <ProfileLabel $isDark={isDark} $compact={compact}>{t.birth}</ProfileLabel>
                  <ProfileValue $isDark={isDark} $compact={compact}>2000.01.28</ProfileValue>
                </ProfileContent>
              </ProfileItem>

              <ProfileItem>
                <ProfileIcon $isDark={isDark} $compact={compact}>
                  <Mail />
                </ProfileIcon>
                <ProfileContent>
                  <ProfileLabel $isDark={isDark} $compact={compact}>{t.email}</ProfileLabel>
                  <ProfileValue $isDark={isDark} $compact={compact}>qazseeszaq3219@gmail.com</ProfileValue>
                </ProfileContent>
              </ProfileItem>

              <ProfileItem>
                <ProfileIcon $isDark={isDark} $compact={compact}>
                  <Phone />
                </ProfileIcon>
                <ProfileContent>
                  <ProfileLabel $isDark={isDark} $compact={compact}>{t.phone}</ProfileLabel>
                  <ProfileValue $isDark={isDark} $compact={compact}>010-2863-7447</ProfileValue>
                </ProfileContent>
              </ProfileItem>
            </ProfileGrid>
          </ProfileCard>
        )}

        <BlocksContainer $compact={compact}>
          {showSkills && (
            <Block>
              <BlockHeader $compact={compact}>
                <BlockIcon $isDark={isDark} $compact={compact}><Code2 /></BlockIcon>
                <BlockTitle $isDark={isDark} $compact={compact}>{t.skills}</BlockTitle>
              </BlockHeader>
              {loading ? (
                <SkillCategories $compact={compact}>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <SkillCategory key={i}>
                      <SkeletonLine $isDark={isDark} $w="30%" $h="12px" style={{ marginBottom: 14 }} />
                      <BadgeList $compact={compact}>
                        {Array.from({ length: 4 }).map((__, j) => <SkeletonBadge key={j} $isDark={isDark} />)}
                      </BadgeList>
                    </SkillCategory>
                  ))}
                </SkillCategories>
              ) : (
                <SkillCategories $compact={compact}>
                  {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                    <SkillCategory key={category}>
                      <CategoryTitle $isDark={isDark} $compact={compact}>{ct[category as keyof typeof ct]}</CategoryTitle>
                      <BadgeList $compact={compact}>
                        {categorySkills.map((skill, index) => (
                          <SkillBadge key={index} $category={skill.category} $compact={compact}>{skill.name}</SkillBadge>
                        ))}
                      </BadgeList>
                    </SkillCategory>
                  ))}
                </SkillCategories>
              )}
            </Block>
          )}

          {showEducation && (
            <Block>
              <BlockHeader $compact={compact}>
                <BlockIcon $isDark={isDark} $compact={compact}><GraduationCap /></BlockIcon>
                <BlockTitle $isDark={isDark} $compact={compact}>{t.education}</BlockTitle>
              </BlockHeader>
              <CardsContainer $compact={compact}>
                {loading ? (
                  Array.from({ length: 2 }).map((_, i) => (
                    <SkeletonCard key={i} $isDark={isDark}>
                      <SkeletonLine $isDark={isDark} $w="55%" $h="22px" />
                      <SkeletonLine $isDark={isDark} $w="40%" />
                      <SkeletonLine $isDark={isDark} $w="85%" />
                    </SkeletonCard>
                  ))
                ) : education.map((edu, index) => (
                  <Card key={index} $isDark={isDark} $compact={compact}>
                    <CardHeader $compact={compact}>
                      <CardInfo>
                        <CardTitle $isDark={isDark} $compact={compact}>{edu.school[language]}</CardTitle>
                        <CardSubtitle $compact={compact}>{edu.degree[language]} · {edu.major[language]}</CardSubtitle>
                      </CardInfo>
                      <CardPeriod $isDark={isDark} $compact={compact}>{edu.period}</CardPeriod>
                    </CardHeader>
                    <CardDescription $compact={compact}>{edu.description[language]}</CardDescription>
                  </Card>
                ))}
              </CardsContainer>
            </Block>
          )}

          {showExperience && (
            <Block>
              <BlockHeader $compact={compact}>
                <BlockIcon $isDark={isDark} $compact={compact}><Briefcase /></BlockIcon>
                <BlockTitle $isDark={isDark} $compact={compact}>{t.experience}</BlockTitle>
              </BlockHeader>
              <CardsContainer $compact={compact}>
                {loading ? (
                  Array.from({ length: 2 }).map((_, i) => (
                    <SkeletonCard key={i} $isDark={isDark}>
                      <SkeletonLine $isDark={isDark} $w="50%" $h="22px" />
                      <SkeletonLine $isDark={isDark} $w="35%" />
                      <SkeletonLine $isDark={isDark} $w="90%" />
                      <SkeletonLine $isDark={isDark} $w="75%" />
                    </SkeletonCard>
                  ))
                ) : experiences.map((exp, index) => (
                  <Card key={index} $isDark={isDark} $compact={compact}>
                    <CardHeader $compact={compact}>
                      <CardInfo>
                        <CardTitle $isDark={isDark} $compact={compact}>{exp.company[language]}</CardTitle>
                        <CardSubtitle $compact={compact}>{exp.position[language]}</CardSubtitle>
                      </CardInfo>
                      <CardPeriod $isDark={isDark} $compact={compact}>{exp.period}</CardPeriod>
                    </CardHeader>
                    <CardDescription $compact={compact}>{exp.description[language]}</CardDescription>
                    {exp.achievements[language].length > 0 && (
                      <CardAchievements $compact={compact}>
                        {exp.achievements[language].map((achievement, idx) => (
                          <CardAchievementItem key={idx} $isDark={isDark} $compact={compact}>{achievement}</CardAchievementItem>
                        ))}
                      </CardAchievements>
                    )}
                  </Card>
                ))}
              </CardsContainer>
            </Block>
          )}
        </BlocksContainer>
      </Container>
    </AboutSection>
  );
}

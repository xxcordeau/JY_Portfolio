import styled, { keyframes } from 'styled-components';
import { useAbout } from '../hooks/useAbout';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Briefcase, GraduationCap, Code2, User, Mail, Phone, Calendar } from 'lucide-react';

const AboutSection = styled.section<{ $isDark: boolean }>`
  min-height: 100vh;
  padding: 120px 40px;
  background: ${props => props.$isDark ? '#0a0a0a' : '#f5f5f7'};
  transition: background 0.3s ease;

  @media (max-width: 768px) {
    padding: 80px 20px;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const SectionTitle = styled.h2<{ $isDark: boolean }>`
  font-size: 56px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 20px 0;
  letter-spacing: -1.5px;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 36px;
    margin-bottom: 16px;
    letter-spacing: -1px;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 20px;
  color: #86868b;
  margin: 0 0 40px 0;
  line-height: 1.7;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 30px;
  }
`;

const ProfileCard = styled.div<{ $isDark: boolean }>`
  margin-bottom: 60px;
  padding-bottom: 40px;
  border-bottom: 1px solid ${props => props.$isDark ? 'rgba(245, 245, 247, 0.1)' : 'rgba(0, 0, 0, 0.06)'};
  transition: border-color 0.3s ease;

  @media (max-width: 768px) {
    margin-bottom: 40px;
    padding-bottom: 30px;
  }
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const ProfileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ProfileIcon = styled.div<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;

  svg {
    width: 18px;
    height: 18px;
    color: #86868b;
  }

  @media (max-width: 768px) {
    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const ProfileContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ProfileLabel = styled.div<{ $isDark: boolean }>`
  font-size: 13px;
  color: #86868b;
  margin-bottom: 4px;
  font-weight: 500;
  letter-spacing: -0.1px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const ProfileValue = styled.div<{ $isDark: boolean }>`
  font-size: 17px;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  font-weight: 400;
  letter-spacing: -0.2px;
  transition: color 0.3s ease;
  word-break: break-all;

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const BlocksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 100px;

  @media (max-width: 768px) {
    gap: 80px;
  }
`;

const Block = styled.div``;

const BlockHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    margin-bottom: 28px;
  }
`;

const BlockIcon = styled.div<{ $isDark: boolean }>`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  transition: all 0.3s ease;

  svg {
    width: 24px;
    height: 24px;
  }

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const BlockTitle = styled.h3<{ $isDark: boolean }>`
  font-size: 32px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0;
  letter-spacing: -0.5px;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const SkillCategories = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const SkillCategory = styled.div``;

const CategoryTitle = styled.h4<{ $isDark: boolean }>`
  font-size: 12px;
  font-weight: 400;
  color: ${props => props.$isDark ? '#6e6e73' : '#aeaeb2'};
  margin: 0 0 14px 0;
  letter-spacing: 1.2px;
  text-transform: uppercase;
`;

const BadgeList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const CATEGORY_COLORS = {
  frontend: { bg: 'rgba(0, 122, 255, 0.1)', border: 'rgba(0, 122, 255, 0.25)', text: '#007AFF' },
  backend:  { bg: 'rgba(52, 199, 89, 0.1)',  border: 'rgba(52, 199, 89, 0.25)',  text: '#34C759' },
  design:   { bg: 'rgba(255, 45, 85, 0.1)',  border: 'rgba(255, 45, 85, 0.25)',  text: '#FF2D55' },
  other:    { bg: 'rgba(88, 86, 214, 0.1)',  border: 'rgba(88, 86, 214, 0.25)', text: '#5856D6' },
} as const;

const SkillBadge = styled.span<{ $category: keyof typeof CATEGORY_COLORS }>`
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.1px;
  background: ${p => CATEGORY_COLORS[p.$category].bg};
  border: 1px solid ${p => CATEGORY_COLORS[p.$category].border};
  color: ${p => CATEGORY_COLORS[p.$category].text};
  transition: all 0.2s ease;

  @media (max-width: 768px) {
    font-size: 13px;
    padding: 5px 12px;
  }
`;

const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Card = styled.div<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.8)'};
  border: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
  border-radius: 16px;
  padding: 32px;
  transition: all 0.3s ease;
  backdrop-filter: blur(20px);

  @media (max-width: 768px) {
    padding: 24px;
    border-radius: 12px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const CardInfo = styled.div`
  flex: 1;
`;

const CardTitle = styled.h4<{ $isDark: boolean }>`
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 8px 0;
  letter-spacing: -0.4px;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const CardSubtitle = styled.div`
  font-size: 18px;
  color: #86868b;
  font-weight: 500;
  letter-spacing: -0.2px;

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const CardPeriod = styled.div<{ $isDark: boolean }>`
  font-size: 16px;
  color: ${props => props.$isDark ? '#a1a1a6' : '#86868b'};
  font-weight: 500;
  white-space: nowrap;
  padding: 8px 16px;
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
  border-radius: 8px;

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 6px 12px;
  }
`;

const CardDescription = styled.p`
  font-size: 17px;
  color: #86868b;
  line-height: 1.7;
  margin: 0 0 16px 0;
  letter-spacing: -0.1px;

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const CardAchievements = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CardAchievementItem = styled.li<{ $isDark: boolean }>`
  font-size: 16px;
  color: ${props => props.$isDark ? '#d4d4d8' : '#6e6e73'};
  padding-left: 20px;
  position: relative;
  line-height: 1.6;

  &::before {
    content: '•';
    position: absolute;
    left: 6px;
    color: ${props => props.$isDark ? '#4ECDC4' : '#FF6B6B'};
    font-weight: bold;
  }

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;




// ── Skeleton ─────────────────────────────────────
const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
`;
const skBase = (isDark: boolean) => `
  background: linear-gradient(
    90deg,
    ${isDark ? '#1a1a1a' : '#e8e8ed'} 25%,
    ${isDark ? '#262626' : '#f0f0f5'} 50%,
    ${isDark ? '#1a1a1a' : '#e8e8ed'} 75%
  );
  background-size: 600px 100%;
  animation: ${shimmer} 1.4s infinite linear;
`;
const SkeletonLine = styled.div<{ $isDark: boolean; $w?: string; $h?: string }>`
  height: ${p => p.$h ?? '14px'};
  border-radius: 8px;
  width: ${p => p.$w ?? '100%'};
  ${p => skBase(p.$isDark)}
`;
const SkeletonBadge = styled.div<{ $isDark: boolean }>`
  height: 32px; width: 80px;
  border-radius: 20px;
  ${p => skBase(p.$isDark)}
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

export default function About() {
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

  return (
    <AboutSection id="about" $isDark={isDark}>
      <Container>
        <SectionTitle $isDark={isDark}>{t.title}</SectionTitle>
        <SectionSubtitle>{t.subtitle}</SectionSubtitle>
        
        {/* Profile Info Card */}
        <ProfileCard $isDark={isDark}>
          <ProfileGrid>
            <ProfileItem>
              <ProfileIcon $isDark={isDark}>
                <User />
              </ProfileIcon>
              <ProfileContent>
                <ProfileLabel $isDark={isDark}>{t.name}</ProfileLabel>
                <ProfileValue $isDark={isDark}>허정연</ProfileValue>
              </ProfileContent>
            </ProfileItem>

            <ProfileItem>
              <ProfileIcon $isDark={isDark}>
                <Calendar />
              </ProfileIcon>
              <ProfileContent>
                <ProfileLabel $isDark={isDark}>{t.birth}</ProfileLabel>
                <ProfileValue $isDark={isDark}>2000.01.28</ProfileValue>
              </ProfileContent>
            </ProfileItem>

            <ProfileItem>
              <ProfileIcon $isDark={isDark}>
                <Mail />
              </ProfileIcon>
              <ProfileContent>
                <ProfileLabel $isDark={isDark}>{t.email}</ProfileLabel>
                <ProfileValue $isDark={isDark}>qazseeszaq3219@gmail.com</ProfileValue>
              </ProfileContent>
            </ProfileItem>

            <ProfileItem>
              <ProfileIcon $isDark={isDark}>
                <Phone />
              </ProfileIcon>
              <ProfileContent>
                <ProfileLabel $isDark={isDark}>{t.phone}</ProfileLabel>
                <ProfileValue $isDark={isDark}>010-2863-7447</ProfileValue>
              </ProfileContent>
            </ProfileItem>
          </ProfileGrid>
        </ProfileCard>
        
        <BlocksContainer>
          {/* Skills Section */}
          <Block>
            <BlockHeader>
              <BlockIcon $isDark={isDark}><Code2 /></BlockIcon>
              <BlockTitle $isDark={isDark}>{t.skills}</BlockTitle>
            </BlockHeader>
            {loading ? (
              <SkillCategories>
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkillCategory key={i}>
                    <SkeletonLine $isDark={isDark} $w="30%" $h="12px" style={{ marginBottom: 14 }} />
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
                      {categorySkills.map((skill, index) => (
                        <SkillBadge key={index} $category={skill.category}>{skill.name}</SkillBadge>
                      ))}
                    </BadgeList>
                  </SkillCategory>
                ))}
              </SkillCategories>
            )}
          </Block>

          {/* Education Section */}
          <Block>
            <BlockHeader>
              <BlockIcon $isDark={isDark}><GraduationCap /></BlockIcon>
              <BlockTitle $isDark={isDark}>{t.education}</BlockTitle>
            </BlockHeader>
            <CardsContainer>
              {loading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <SkeletonCard key={i} $isDark={isDark}>
                    <SkeletonLine $isDark={isDark} $w="55%" $h="22px" />
                    <SkeletonLine $isDark={isDark} $w="40%" />
                    <SkeletonLine $isDark={isDark} $w="85%" />
                  </SkeletonCard>
                ))
              ) : education.map((edu, index) => (
                <Card key={index} $isDark={isDark}>
                  <CardHeader>
                    <CardInfo>
                      <CardTitle $isDark={isDark}>{edu.school[language]}</CardTitle>
                      <CardSubtitle>{edu.degree[language]} · {edu.major[language]}</CardSubtitle>
                    </CardInfo>
                    <CardPeriod $isDark={isDark}>{edu.period}</CardPeriod>
                  </CardHeader>
                  <CardDescription>{edu.description[language]}</CardDescription>
                </Card>
              ))}
            </CardsContainer>
          </Block>

          {/* Experience Section */}
          <Block>
            <BlockHeader>
              <BlockIcon $isDark={isDark}><Briefcase /></BlockIcon>
              <BlockTitle $isDark={isDark}>{t.experience}</BlockTitle>
            </BlockHeader>
            <CardsContainer>
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
                <Card key={index} $isDark={isDark}>
                  <CardHeader>
                    <CardInfo>
                      <CardTitle $isDark={isDark}>{exp.company[language]}</CardTitle>
                      <CardSubtitle>{exp.position[language]}</CardSubtitle>
                    </CardInfo>
                    <CardPeriod $isDark={isDark}>{exp.period}</CardPeriod>
                  </CardHeader>
                  <CardDescription>{exp.description[language]}</CardDescription>
                  {exp.achievements[language].length > 0 && (
                    <CardAchievements>
                      {exp.achievements[language].map((achievement, idx) => (
                        <CardAchievementItem key={idx} $isDark={isDark}>{achievement}</CardAchievementItem>
                      ))}
                    </CardAchievements>
                  )}
                </Card>
              ))}
            </CardsContainer>
          </Block>
        </BlocksContainer>
      </Container>
    </AboutSection>
  );
}

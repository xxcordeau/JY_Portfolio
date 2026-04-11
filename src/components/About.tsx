import styled, { keyframes } from 'styled-components';
import { useAbout } from '../hooks/useAbout';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Mail, Phone, Calendar, MapPin } from 'lucide-react';

/* ── Section ── */
const AboutSection = styled.section<{ $isDark: boolean }>`
  min-height: 100vh;
  padding: 100px 0 80px;
  background: ${p => p.$isDark ? '#000000' : '#f5f5f7'};
  transition: background 0.3s ease;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    padding: 80px 0 60px;
    display: block;
  }
`;

const Container = styled.div`
  width: 100%;
  padding: 0 12vw;

  @media (max-width: 960px) {
    padding: 0 20px;
  }
`;

const SectionTitle = styled.h2<{ $isDark: boolean }>`
  font-size: 52px;
  font-weight: 700;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 40px 0;
  letter-spacing: -1.5px;
  line-height: 1;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 36px;
    margin-bottom: 28px;
  }
`;

/* ── Bento Grid ── */
const BentoGrid = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  grid-template-rows: auto auto;
  gap: 14px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

/* ── Hero Tile (left, spans both rows) ── */
const HeroTile = styled.div`
  grid-column: 1;
  grid-row: 1 / 3;
  border-radius: 28px;
  padding: 52px;
  background: #1d1d1f;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 520px;
  position: relative;
  overflow: hidden;

  /* subtle gradient overlay */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 20% 80%, rgba(0,122,255,0.08) 0%, transparent 60%),
                radial-gradient(ellipse at 80% 20%, rgba(88,86,214,0.06) 0%, transparent 60%);
    pointer-events: none;
  }

  @media (max-width: 960px) {
    grid-column: 1;
    grid-row: auto;
    min-height: 360px;
  }

  @media (max-width: 768px) {
    padding: 36px;
    min-height: 300px;
  }
`;

const HeroTop = styled.div`
  position: relative;
  z-index: 1;
`;

const HeroLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.4);
  margin-bottom: 20px;
`;

const HeroName = styled.h3`
  font-size: 52px;
  font-weight: 700;
  color: #f5f5f7;
  margin: 0 0 12px 0;
  letter-spacing: -2px;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 38px;
  }
`;

const HeroBio = styled.p`
  font-size: 16px;
  color: rgba(255,255,255,0.45);
  line-height: 1.6;
  margin: 0;
  max-width: 360px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const HeroBottom = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ContactIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: rgba(255,255,255,0.07);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 14px;
    height: 14px;
    color: rgba(255,255,255,0.5);
  }
`;

const ContactText = styled.div``;

const ContactLabel = styled.div`
  font-size: 10px;
  color: rgba(255,255,255,0.3);
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 1px;
`;

const ContactValue = styled.div`
  font-size: 14px;
  color: rgba(255,255,255,0.7);
  letter-spacing: -0.1px;
`;

/* ── Right column tiles ── */
const RightStack = styled.div`
  grid-column: 2;
  grid-row: 1 / 3;
  display: flex;
  flex-direction: column;
  gap: 14px;

  @media (max-width: 960px) {
    grid-column: 1;
    grid-row: auto;
  }
`;

const Tile = styled.div<{ $isDark: boolean }>`
  border-radius: 24px;
  padding: 36px;
  background: ${p => p.$isDark ? '#111111' : '#ffffff'};
  transition: background 0.3s ease;

  @media (max-width: 768px) {
    padding: 28px;
    border-radius: 20px;
  }
`;

const TileLabel = styled.div<{ $isDark: boolean }>`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)'};
  margin-bottom: 20px;
`;

/* ── Skills ── */
const SkillCategories = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SkillCategory = styled.div``;

const CategoryName = styled.div<{ $isDark: boolean }>`
  font-size: 11px;
  font-weight: 500;
  color: ${p => p.$isDark ? '#6e6e73' : '#aeaeb2'};
  margin-bottom: 8px;
  letter-spacing: 0.5px;
`;

const BadgeList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const CATEGORY_COLORS = {
  frontend: { bg: 'rgba(0,122,255,0.1)',  border: 'rgba(0,122,255,0.25)', text: '#007AFF' },
  backend:  { bg: 'rgba(52,199,89,0.1)',  border: 'rgba(52,199,89,0.25)', text: '#34C759' },
  design:   { bg: 'rgba(255,45,85,0.1)',  border: 'rgba(255,45,85,0.25)', text: '#FF2D55' },
  other:    { bg: 'rgba(88,86,214,0.1)',  border: 'rgba(88,86,214,0.25)', text: '#5856D6' },
} as const;

const SkillBadge = styled.span<{ $category: keyof typeof CATEGORY_COLORS }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 11px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: ${p => CATEGORY_COLORS[p.$category].bg};
  border: 1px solid ${p => CATEGORY_COLORS[p.$category].border};
  color: ${p => CATEGORY_COLORS[p.$category].text};
`;

/* ── Career items ── */
const CareerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CareerItem = styled.div<{ $isDark: boolean }>`
  padding-bottom: 20px;
  border-bottom: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'};

  &:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const CareerRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 4px;
`;

const CareerName = styled.div<{ $isDark: boolean }>`
  font-size: 16px;
  font-weight: 600;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  letter-spacing: -0.3px;
  transition: color 0.3s ease;
`;

const CareerSub = styled.div`
  font-size: 13px;
  color: #86868b;
  margin-bottom: 6px;
`;

const CareerPeriod = styled.div<{ $isDark: boolean }>`
  font-size: 11px;
  color: ${p => p.$isDark ? '#a1a1a6' : '#86868b'};
  font-weight: 500;
  white-space: nowrap;
  padding: 4px 10px;
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'};
  border-radius: 20px;
  flex-shrink: 0;
`;

const CareerDesc = styled.p`
  font-size: 13px;
  color: #86868b;
  line-height: 1.6;
  margin: 0;
`;

const AchievementList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 8px 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const AchievementItem = styled.li<{ $isDark: boolean }>`
  font-size: 12px;
  color: ${p => p.$isDark ? '#c7c7cc' : '#6e6e73'};
  padding-left: 14px;
  position: relative;
  line-height: 1.55;

  &::before {
    content: '–';
    position: absolute;
    left: 0;
    color: #86868b;
  }
`;

/* ── Skeleton ── */
const shimmerAnim = keyframes`
  0%   { background-position: -400% 0; }
  100% { background-position:  400% 0; }
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
  animation: ${shimmerAnim} 1.4s ease infinite;
`;

/* ── Translations ── */
const translations = {
  ko: {
    title: '소개',
    jobTitle: '프론트엔드 개발자',
    bio: '사용자 중심의 인터페이스를 설계하고, 섬세한 UI와 부드러운 경험을 만드는 것을 좋아합니다.',
    skills: '기술 스택',
    education: '학력',
    experience: '경력',
    birth: '생년월일', email: '이메일', phone: '연락처', location: '위치',
  },
  en: {
    title: 'About',
    jobTitle: 'Frontend Developer',
    bio: 'I love designing user-centered interfaces and crafting delicate UI with smooth, thoughtful experiences.',
    skills: 'Skills',
    education: 'Education',
    experience: 'Experience',
    birth: 'Birth', email: 'Email', phone: 'Phone', location: 'Location',
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

  return (
    <AboutSection id="about" $isDark={isDark}>
      <Container>
        <SectionTitle $isDark={isDark}>{t.title}</SectionTitle>

        <BentoGrid>
          {/* ── Hero Tile (left) ── */}
          <HeroTile>
            <HeroTop>
              <HeroLabel>{t.jobTitle}</HeroLabel>
              <HeroName>허정연</HeroName>
              <HeroBio>{t.bio}</HeroBio>
            </HeroTop>

            <HeroBottom>
              {[
                { icon: <Calendar />, label: t.birth,    value: '2000.01.28' },
                { icon: <Mail />,     label: t.email,    value: 'qazseeszaq3219@gmail.com' },
                { icon: <Phone />,    label: t.phone,    value: '010-2863-7447' },
                { icon: <MapPin />,   label: t.location, value: '서울, 대한민국' },
              ].map(({ icon, label, value }) => (
                <ContactItem key={label}>
                  <ContactIcon>{icon}</ContactIcon>
                  <ContactText>
                    <ContactLabel>{label}</ContactLabel>
                    <ContactValue>{value}</ContactValue>
                  </ContactText>
                </ContactItem>
              ))}
            </HeroBottom>
          </HeroTile>

          {/* ── Right column ── */}
          <RightStack>
            {/* 기술 스택 */}
            <Tile $isDark={isDark}>
              <TileLabel $isDark={isDark}>{t.skills}</TileLabel>
              {loading ? (
                <SkillCategories>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <SkillCategory key={i}>
                      <SkeletonBlock $isDark={isDark} $w="25%" $h="11px" style={{ marginBottom: 8 }} />
                      <BadgeList>
                        {Array.from({ length: 4 }).map((__, j) => (
                          <SkeletonBlock key={j} $isDark={isDark} $w="68px" $h="26px" style={{ borderRadius: 20 }} />
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
            </Tile>

            {/* 학력 */}
            <Tile $isDark={isDark}>
              <TileLabel $isDark={isDark}>{t.education}</TileLabel>
              {loading ? (
                <CareerList>
                  {Array.from({ length: 2 }).map((_, i) => (
                    <CareerItem key={i} $isDark={isDark}>
                      <SkeletonBlock $isDark={isDark} $w="55%" $h="16px" style={{ marginBottom: 6 }} />
                      <SkeletonBlock $isDark={isDark} $w="40%" $h="13px" style={{ marginBottom: 8 }} />
                      <SkeletonBlock $isDark={isDark} $w="85%" $h="12px" />
                    </CareerItem>
                  ))}
                </CareerList>
              ) : (
                <CareerList>
                  {education.map((edu, i) => (
                    <CareerItem key={i} $isDark={isDark}>
                      <CareerRow>
                        <CareerName $isDark={isDark}>{edu.school[language]}</CareerName>
                        <CareerPeriod $isDark={isDark}>{edu.period}</CareerPeriod>
                      </CareerRow>
                      <CareerSub>{edu.degree[language]} · {edu.major[language]}</CareerSub>
                      {edu.description[language] && (
                        <CareerDesc>{edu.description[language]}</CareerDesc>
                      )}
                    </CareerItem>
                  ))}
                </CareerList>
              )}
            </Tile>

            {/* 경력 */}
            <Tile $isDark={isDark}>
              <TileLabel $isDark={isDark}>{t.experience}</TileLabel>
              {loading ? (
                <CareerList>
                  {Array.from({ length: 2 }).map((_, i) => (
                    <CareerItem key={i} $isDark={isDark}>
                      <SkeletonBlock $isDark={isDark} $w="50%" $h="16px" style={{ marginBottom: 6 }} />
                      <SkeletonBlock $isDark={isDark} $w="35%" $h="13px" style={{ marginBottom: 8 }} />
                      <SkeletonBlock $isDark={isDark} $w="90%" $h="12px" style={{ marginBottom: 4 }} />
                      <SkeletonBlock $isDark={isDark} $w="75%" $h="12px" />
                    </CareerItem>
                  ))}
                </CareerList>
              ) : (
                <CareerList>
                  {experiences.map((exp, i) => (
                    <CareerItem key={i} $isDark={isDark}>
                      <CareerRow>
                        <CareerName $isDark={isDark}>{exp.company[language]}</CareerName>
                        <CareerPeriod $isDark={isDark}>{exp.period}</CareerPeriod>
                      </CareerRow>
                      <CareerSub>{exp.position[language]}</CareerSub>
                      {exp.description[language] && (
                        <CareerDesc>{exp.description[language]}</CareerDesc>
                      )}
                      {exp.achievements[language].length > 0 && (
                        <AchievementList>
                          {exp.achievements[language].map((a, idx) => (
                            <AchievementItem key={idx} $isDark={isDark}>{a}</AchievementItem>
                          ))}
                        </AchievementList>
                      )}
                    </CareerItem>
                  ))}
                </CareerList>
              )}
            </Tile>
          </RightStack>
        </BentoGrid>
      </Container>
    </AboutSection>
  );
}

import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Plus, Trash2, Save } from 'lucide-react';
import { adminSupabase as supabase } from '../../lib/supabase';
import { useTheme } from '../../contexts/ThemeContext';
import type { DbSkill, DbEducation, DbExperience } from '../../lib/types/database';
import {
  PageHeader, PageTitle, PageSubtitle,
  Card, FormSection, SectionTitle, FormGroup, FormLabel,
  FormInput, FormTextarea, FormRow, FormSelect,
  PrimaryButton, SecondaryButton, GhostButton,
  TabRow, Tab, EmptyState
} from './AdminStyles';

const ItemCard = styled.div<{ $isDark: boolean }>`
  padding: 16px;
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CategorySection = styled.div<{ $isDark: boolean }>`
  padding: 16px;
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CategoryLabel = styled.div<{ $isDark: boolean }>`
  font-size: 12px;
  font-weight: 600;
  color: ${p => p.$isDark ? '#a1a1a6' : '#86868b'};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 32px;
`;

const BADGE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  frontend: { bg: 'rgba(0,122,255,0.12)',   border: 'rgba(0,122,255,0.3)',   text: '#007AFF' },
  backend:  { bg: 'rgba(52,199,89,0.12)',   border: 'rgba(52,199,89,0.3)',   text: '#34C759' },
  design:   { bg: 'rgba(255,45,85,0.12)',   border: 'rgba(255,45,85,0.3)',   text: '#FF2D55' },
  other:    { bg: 'rgba(88,86,214,0.12)',   border: 'rgba(88,86,214,0.3)',   text: '#5856D6' },
};

const Badge = styled.span<{ $cat: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  background: ${p => BADGE_COLORS[p.$cat]?.bg ?? 'rgba(128,128,128,0.1)'};
  border: 1px solid ${p => BADGE_COLORS[p.$cat]?.border ?? 'rgba(128,128,128,0.2)'};
  color: ${p => BADGE_COLORS[p.$cat]?.text ?? '#86868b'};
`;

const BadgeRemove = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: 14px;
  line-height: 1;
  opacity: 0.6;
  color: inherit;
  &:hover { opacity: 1; }
`;

const AddSkillRow = styled.div`
  display: flex;
  gap: 8px;
`;

type ActiveTab = 'skills' | 'education' | 'experience';

export default function AboutEditor() {
  const { isDark } = useTheme();
  const [tab, setTab] = useState<ActiveTab>('skills');
  const [skills, setSkills] = useState<DbSkill[]>([]);
  const [education, setEducation] = useState<DbEducation[]>([]);
  const [experiences, setExperiences] = useState<DbExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [s, e, x] = await Promise.all([
      supabase.from('skills').select('*').order('sort_order'),
      supabase.from('education').select('*').order('sort_order'),
      supabase.from('experiences').select('*').order('sort_order'),
    ]);
    setSkills((s.data as DbSkill[]) ?? []);
    setEducation((e.data as DbEducation[]) ?? []);
    setExperiences((x.data as DbExperience[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // === Skills ===
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCat, setNewSkillCat] = useState<DbSkill['category']>('frontend');

  const addSkill = () => {
    const name = newSkillName.trim();
    if (!name) return;
    setSkills(prev => [...prev, {
      id: crypto.randomUUID(),
      name,
      category: newSkillCat,
      sort_order: prev.length,
    }]);
    setNewSkillName('');
  };

  const removeSkill = (id: string) => {
    setSkills(prev => prev.filter(s => s.id !== id));
  };

  const CATEGORIES: DbSkill['category'][] = ['frontend', 'backend', 'design', 'other'];
  const CATEGORY_LABELS: Record<DbSkill['category'], string> = {
    frontend: 'Frontend',
    backend: 'Backend',
    design: 'Design',
    other: 'Other',
  };

  const groupedSkills = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = skills.filter(s => s.category === cat);
    return acc;
  }, {} as Record<DbSkill['category'], DbSkill[]>);

  // === Education ===
  const addEducation = () => {
    setEducation(prev => [...prev, {
      id: crypto.randomUUID(),
      school_ko: '', school_en: '',
      degree_ko: '', degree_en: '',
      major_ko: '', major_en: '',
      period: '',
      description_ko: null, description_en: null,
      sort_order: prev.length,
    }]);
  };

  const updateEdu = (index: number, field: keyof DbEducation, value: string | null) => {
    setEducation(prev => prev.map((e, i) => i === index ? { ...e, [field]: value } : e));
  };

  const removeEdu = (index: number) => {
    setEducation(prev => prev.filter((_, i) => i !== index));
  };

  // === Experiences ===
  const addExperience = () => {
    setExperiences(prev => [...prev, {
      id: crypto.randomUUID(),
      company_ko: '', company_en: '',
      position_ko: '', position_en: '',
      period: '',
      description_ko: null, description_en: null,
      achievements_ko: [], achievements_en: [],
      sort_order: prev.length,
    }]);
  };

  const updateExp = (index: number, field: keyof DbExperience, value: unknown) => {
    setExperiences(prev => prev.map((e, i) => i === index ? { ...e, [field]: value } : e));
  };

  const removeExp = (index: number) => {
    setExperiences(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        supabase.from('skills').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('education').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('experiences').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
      ]);
      await Promise.all([
        skills.length > 0 && supabase.from('skills').insert(skills),
        education.length > 0 && supabase.from('education').insert(education),
        experiences.length > 0 && supabase.from('experiences').insert(experiences),
      ]);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <EmptyState $isDark={isDark}>불러오는 중...</EmptyState>;
  }

  return (
    <>
      <PageHeader>
        <div>
          <PageTitle $isDark={isDark}>About 관리</PageTitle>
          <PageSubtitle>스킬, 학력, 경력 정보를 관리합니다</PageSubtitle>
        </div>
        <PrimaryButton onClick={handleSave} disabled={saving}>
          <Save /> {saving ? '저장 중...' : '전체 저장'}
        </PrimaryButton>
      </PageHeader>

      <Card $isDark={isDark}>
        <TabRow $isDark={isDark}>
          <Tab $isDark={isDark} $active={tab === 'skills'} onClick={() => setTab('skills')}>
            스킬 ({skills.length})
          </Tab>
          <Tab $isDark={isDark} $active={tab === 'education'} onClick={() => setTab('education')}>
            학력 ({education.length})
          </Tab>
          <Tab $isDark={isDark} $active={tab === 'experience'} onClick={() => setTab('experience')}>
            경력 ({experiences.length})
          </Tab>
        </TabRow>

        {/* === Skills Tab === */}
        {tab === 'skills' && (
          <FormSection $isDark={isDark}>
            <SectionTitle $isDark={isDark}>기술 스택 뱃지</SectionTitle>

            {/* 뱃지 추가 */}
            <AddSkillRow>
              <FormInput
                $isDark={isDark}
                value={newSkillName}
                onChange={e => setNewSkillName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSkill()}
                placeholder="기술명 입력 (예: React)"
                style={{ flex: 1 }}
              />
              <FormSelect
                $isDark={isDark}
                value={newSkillCat}
                onChange={e => setNewSkillCat(e.target.value as DbSkill['category'])}
                style={{ width: 130 }}
              >
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="design">Design</option>
                <option value="other">Other</option>
              </FormSelect>
              <SecondaryButton $isDark={isDark} onClick={addSkill}>
                <Plus /> 추가
              </SecondaryButton>
            </AddSkillRow>

            {/* 카테고리별 뱃지 목록 */}
            {CATEGORIES.map(cat => (
              <CategorySection key={cat} $isDark={isDark}>
                <CategoryLabel $isDark={isDark}>{CATEGORY_LABELS[cat]}</CategoryLabel>
                <BadgeRow>
                  {groupedSkills[cat].length === 0
                    ? <span style={{ fontSize: 13, color: '#86868b' }}>뱃지 없음</span>
                    : groupedSkills[cat].map(skill => (
                        <Badge key={skill.id} $cat={skill.category}>
                          {skill.name}
                          <BadgeRemove onClick={() => removeSkill(skill.id)} title="삭제">×</BadgeRemove>
                        </Badge>
                      ))
                  }
                </BadgeRow>
              </CategorySection>
            ))}
          </FormSection>
        )}

        {/* === Education Tab === */}
        {tab === 'education' && (
          <FormSection $isDark={isDark}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <SectionTitle $isDark={isDark}>학력 목록</SectionTitle>
              <SecondaryButton $isDark={isDark} onClick={addEducation}><Plus /> 추가</SecondaryButton>
            </div>
            {education.map((edu, i) => (
              <ItemCard key={edu.id} $isDark={isDark}>
                <FormRow>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>학교 (KO)</FormLabel>
                    <FormInput $isDark={isDark} value={edu.school_ko}
                      onChange={e => updateEdu(i, 'school_ko', e.target.value)} />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>학교 (EN)</FormLabel>
                    <FormInput $isDark={isDark} value={edu.school_en}
                      onChange={e => updateEdu(i, 'school_en', e.target.value)} />
                  </FormGroup>
                </FormRow>
                <FormRow>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>학위 (KO)</FormLabel>
                    <FormInput $isDark={isDark} value={edu.degree_ko}
                      onChange={e => updateEdu(i, 'degree_ko', e.target.value)} />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>학위 (EN)</FormLabel>
                    <FormInput $isDark={isDark} value={edu.degree_en}
                      onChange={e => updateEdu(i, 'degree_en', e.target.value)} />
                  </FormGroup>
                </FormRow>
                <FormRow>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>전공 (KO)</FormLabel>
                    <FormInput $isDark={isDark} value={edu.major_ko}
                      onChange={e => updateEdu(i, 'major_ko', e.target.value)} />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>전공 (EN)</FormLabel>
                    <FormInput $isDark={isDark} value={edu.major_en}
                      onChange={e => updateEdu(i, 'major_en', e.target.value)} />
                  </FormGroup>
                </FormRow>
                <FormRow>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>기간</FormLabel>
                    <FormInput $isDark={isDark} value={edu.period}
                      onChange={e => updateEdu(i, 'period', e.target.value)} placeholder="2020.03 - 2024.02" />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>정렬 순서</FormLabel>
                    <FormInput $isDark={isDark} type="number" value={edu.sort_order}
                      onChange={e => updateEdu(i, 'sort_order', Number(e.target.value) as any)} />
                  </FormGroup>
                </FormRow>
                <GhostButton $isDark={isDark} onClick={() => removeEdu(i)} style={{ color: '#d4183d', alignSelf: 'flex-end' }}>
                  <Trash2 />
                </GhostButton>
              </ItemCard>
            ))}
            {education.length === 0 && <EmptyState $isDark={isDark}>학력 정보가 없습니다</EmptyState>}
          </FormSection>
        )}

        {/* === Experience Tab === */}
        {tab === 'experience' && (
          <FormSection $isDark={isDark}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <SectionTitle $isDark={isDark}>경력 목록</SectionTitle>
              <SecondaryButton $isDark={isDark} onClick={addExperience}><Plus /> 추가</SecondaryButton>
            </div>
            {experiences.map((exp, i) => (
              <ItemCard key={exp.id} $isDark={isDark}>
                <FormRow>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>회사 (KO)</FormLabel>
                    <FormInput $isDark={isDark} value={exp.company_ko}
                      onChange={e => updateExp(i, 'company_ko', e.target.value)} />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>회사 (EN)</FormLabel>
                    <FormInput $isDark={isDark} value={exp.company_en}
                      onChange={e => updateExp(i, 'company_en', e.target.value)} />
                  </FormGroup>
                </FormRow>
                <FormRow>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>직위 (KO)</FormLabel>
                    <FormInput $isDark={isDark} value={exp.position_ko}
                      onChange={e => updateExp(i, 'position_ko', e.target.value)} />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>직위 (EN)</FormLabel>
                    <FormInput $isDark={isDark} value={exp.position_en}
                      onChange={e => updateExp(i, 'position_en', e.target.value)} />
                  </FormGroup>
                </FormRow>
                <FormRow>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>기간</FormLabel>
                    <FormInput $isDark={isDark} value={exp.period}
                      onChange={e => updateExp(i, 'period', e.target.value)} placeholder="2023.01 - 현재" />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>정렬 순서</FormLabel>
                    <FormInput $isDark={isDark} type="number" value={exp.sort_order}
                      onChange={e => updateExp(i, 'sort_order', Number(e.target.value) as any)} />
                  </FormGroup>
                </FormRow>
                <FormGroup>
                  <FormLabel $isDark={isDark}>설명 (KO)</FormLabel>
                  <FormTextarea $isDark={isDark} value={exp.description_ko ?? ''}
                    onChange={e => updateExp(i, 'description_ko', e.target.value || null)}
                    style={{ minHeight: 60 }} />
                </FormGroup>
                <FormGroup>
                  <FormLabel $isDark={isDark}>설명 (EN)</FormLabel>
                  <FormTextarea $isDark={isDark} value={exp.description_en ?? ''}
                    onChange={e => updateExp(i, 'description_en', e.target.value || null)}
                    style={{ minHeight: 60 }} />
                </FormGroup>
                <GhostButton $isDark={isDark} onClick={() => removeExp(i)} style={{ color: '#d4183d', alignSelf: 'flex-end' }}>
                  <Trash2 />
                </GhostButton>
              </ItemCard>
            ))}
            {experiences.length === 0 && <EmptyState $isDark={isDark}>경력 정보가 없습니다</EmptyState>}
          </FormSection>
        )}
      </Card>
    </>
  );
}

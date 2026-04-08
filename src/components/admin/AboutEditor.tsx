import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Plus, Trash2, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
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

const SkillBar = styled.div<{ $isDark: boolean }>`
  height: 6px;
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'};
  border-radius: 3px;
  overflow: hidden;
`;

const SkillFill = styled.div<{ $level: number }>`
  height: 100%;
  width: ${p => p.$level}%;
  background: #0c8ce9;
  border-radius: 3px;
  transition: width 0.3s ease;
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
  const addSkill = () => {
    setSkills(prev => [...prev, {
      id: crypto.randomUUID(),
      name: '',
      level: 50,
      category: 'frontend',
      sort_order: prev.length,
    }]);
  };

  const updateSkill = (index: number, field: keyof DbSkill, value: string | number) => {
    setSkills(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const removeSkill = (index: number) => {
    setSkills(prev => prev.filter((_, i) => i !== index));
  };

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
        supabase.from('skills').delete().neq('id', ''),
        supabase.from('education').delete().neq('id', ''),
        supabase.from('experiences').delete().neq('id', ''),
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <SectionTitle $isDark={isDark}>스킬 목록</SectionTitle>
              <SecondaryButton $isDark={isDark} onClick={addSkill}><Plus /> 추가</SecondaryButton>
            </div>
            {skills.map((skill, i) => (
              <ItemCard key={skill.id} $isDark={isDark}>
                <FormRow>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>이름</FormLabel>
                    <FormInput $isDark={isDark} value={skill.name}
                      onChange={e => updateSkill(i, 'name', e.target.value)} placeholder="React" />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>카테고리</FormLabel>
                    <FormSelect $isDark={isDark} value={skill.category}
                      onChange={e => updateSkill(i, 'category', e.target.value)}>
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="design">Design</option>
                      <option value="other">Other</option>
                    </FormSelect>
                  </FormGroup>
                </FormRow>
                <FormGroup>
                  <FormLabel $isDark={isDark}>레벨: {skill.level}%</FormLabel>
                  <input type="range" min={0} max={100} value={skill.level}
                    onChange={e => updateSkill(i, 'level', Number(e.target.value))} />
                  <SkillBar $isDark={isDark}><SkillFill $level={skill.level} /></SkillBar>
                </FormGroup>
                <FormGroup>
                  <FormLabel $isDark={isDark}>정렬 순서</FormLabel>
                  <FormInput $isDark={isDark} type="number" value={skill.sort_order}
                    onChange={e => updateSkill(i, 'sort_order', Number(e.target.value))} />
                </FormGroup>
                <GhostButton $isDark={isDark} onClick={() => removeSkill(i)} style={{ color: '#d4183d', alignSelf: 'flex-end' }}>
                  <Trash2 />
                </GhostButton>
              </ItemCard>
            ))}
            {skills.length === 0 && <EmptyState $isDark={isDark}>스킬이 없습니다</EmptyState>}
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

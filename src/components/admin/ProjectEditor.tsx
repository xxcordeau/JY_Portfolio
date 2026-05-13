import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';
import { supabase } from '../../lib/supabase';
import type { DbProject } from '../../lib/types/database';
import { toast } from '../ui/sonner';
import {
  Plus, Edit2, Trash2, X, Star,
} from 'lucide-react';
import {
  PageHeader, PageTitle, PageSubtitle,
  Card, CardHeader, CardBody,
  PrimaryButton, SecondaryButton, DestructiveButton, GhostButton,
  FormGroup, FormLabel, FormInput, FormTextarea, FormSelect, FormRow,
  FormSection, SectionTitle as FormSectionTitle,
  TabRow, Tab,
  Table, Badge,
  ToggleWrapper, ToggleSwitch, ToggleLabel,
  EmptyState, ActionsRow,
} from './AdminStyles';

/* ── Extra styled ── */

const TypeBadge = styled.span<{ $type: 'freelance' | 'personal' }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.3px;
  ${p => p.$type === 'freelance'
    ? 'background: rgba(12,140,233,0.12); color: #0c8ce9;'
    : 'background: rgba(16,185,129,0.12); color: #10b981;'
  }
`;

const GroupLabel = styled.div<{ $isDark: boolean }>`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)'};
  padding: 16px 16px 8px;
`;

const Overlay = styled.div<{ $open: boolean }>`
  display: ${p => p.$open ? 'block' : 'none'};
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  z-index: 200;
  backdrop-filter: blur(2px);
`;

const Panel = styled.div<{ $isDark: boolean; $open: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(580px, 100vw);
  background: ${p => p.$isDark ? '#161616' : '#ffffff'};
  border-left: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'};
  z-index: 300;
  display: flex;
  flex-direction: column;
  transform: translateX(${p => p.$open ? '0' : '100%'});
  transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
  overflow: hidden;
`;

const PanelHeader = styled.div<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'};
  flex-shrink: 0;
`;

const PanelTitle = styled.h2<{ $isDark: boolean }>`
  font-size: 17px;
  font-weight: 700;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  letter-spacing: -0.3px;
`;

const PanelBody = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const PanelFooter = styled.div<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'};
  flex-shrink: 0;
`;

const ConfirmModal = styled.div<{ $isDark: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ConfirmBox = styled.div<{ $isDark: boolean }>`
  background: ${p => p.$isDark ? '#1e1e1e' : '#ffffff'};
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'};
  border-radius: 16px;
  padding: 28px;
  width: 100%;
  max-width: 380px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);

  h3 {
    font-size: 17px;
    font-weight: 700;
    color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
    margin-bottom: 8px;
  }
  p {
    font-size: 14px;
    color: #86868b;
    line-height: 1.5;
    margin-bottom: 20px;
  }
`;

const ConfirmActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const SortInput = styled.input<{ $isDark: boolean }>`
  width: 52px;
  height: 30px;
  padding: 0 8px;
  font-size: 13px;
  text-align: center;
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'};
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'};
  border-radius: 6px;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #0c8ce9;
  }
`;

const Hint = styled.p<{ $isDark: boolean }>`
  font-size: 11px;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)'};
  margin-top: 4px;
  line-height: 1.4;
`;

/* ── Form state ── */
interface FormState {
  project_type: 'freelance' | 'personal';
  id: string;
  title_ko: string;
  title_en: string;
  description_ko: string;
  description_en: string;
  full_description_ko: string;
  full_description_en: string;
  role_ko: string;
  role_en: string;
  year: string;
  cover_image_url: string;
  tech_frontend: string;
  tech_backend: string;
  tech_design: string;
  tech_others: string;
  tags: string;
  highlights_ko: string;
  highlights_en: string;
  challenge_ko: string;
  challenge_en: string;
  solution_ko: string;
  solution_en: string;
  link_github: string;
  link_demo: string;
  link_website: string;
  is_featured: boolean;
  sort_order: string;
}

const EMPTY_FORM: FormState = {
  project_type: 'personal',
  id: '',
  title_ko: '',
  title_en: '',
  description_ko: '',
  description_en: '',
  full_description_ko: '',
  full_description_en: '',
  role_ko: '',
  role_en: '',
  year: new Date().getFullYear().toString(),
  cover_image_url: '',
  tech_frontend: '',
  tech_backend: '',
  tech_design: '',
  tech_others: '',
  tags: '',
  highlights_ko: '',
  highlights_en: '',
  challenge_ko: '',
  challenge_en: '',
  solution_ko: '',
  solution_en: '',
  link_github: '',
  link_demo: '',
  link_website: '',
  is_featured: false,
  sort_order: '0',
};

function dbToForm(row: DbProject): FormState {
  const joinArr = (a: string[] | null | undefined) => (a ?? []).join(', ');
  const joinLines = (a: string[] | null | undefined) => (a ?? []).join('\n');
  return {
    project_type: (row.project_type as 'freelance' | 'personal') ?? 'personal',
    id: row.id,
    title_ko: row.title_ko,
    title_en: row.title_en,
    description_ko: row.description_ko,
    description_en: row.description_en,
    full_description_ko: row.full_description_ko,
    full_description_en: row.full_description_en,
    role_ko: row.role_ko,
    role_en: row.role_en,
    year: row.year,
    cover_image_url: row.cover_image_url ?? '',
    tech_frontend: joinArr(row.tech_frontend),
    tech_backend: joinArr(row.tech_backend),
    tech_design: joinArr(row.tech_design),
    tech_others: joinArr(row.tech_others),
    tags: joinArr(row.tags),
    highlights_ko: joinLines(row.highlights_ko),
    highlights_en: joinLines(row.highlights_en),
    challenge_ko: row.challenge_ko ?? '',
    challenge_en: row.challenge_en ?? '',
    solution_ko: row.solution_ko ?? '',
    solution_en: row.solution_en ?? '',
    link_github: row.link_github ?? '',
    link_demo: row.link_demo ?? '',
    link_website: row.link_website ?? '',
    is_featured: row.is_featured,
    sort_order: String(row.sort_order ?? 0),
  };
}

function formToDb(form: FormState): Omit<DbProject, 'created_at' | 'updated_at'> {
  const splitArr   = (s: string) => s.split(',').map(x => x.trim()).filter(Boolean);
  const splitLines = (s: string) => s.split('\n').map(x => x.trim()).filter(Boolean);
  return {
    id: form.id.trim(),
    project_type: form.project_type,
    title_ko: form.title_ko,
    title_en: form.title_en,
    description_ko: form.description_ko,
    description_en: form.description_en,
    full_description_ko: form.full_description_ko,
    full_description_en: form.full_description_en,
    role_ko: form.role_ko,
    role_en: form.role_en,
    year: form.year,
    cover_image_url: form.cover_image_url || null,
    tech_frontend: splitArr(form.tech_frontend),
    tech_backend: splitArr(form.tech_backend),
    tech_design: splitArr(form.tech_design),
    tech_others: splitArr(form.tech_others),
    tags: splitArr(form.tags),
    highlights_ko: splitLines(form.highlights_ko),
    highlights_en: splitLines(form.highlights_en),
    challenge_ko: form.challenge_ko || null,
    challenge_en: form.challenge_en || null,
    solution_ko: form.solution_ko || null,
    solution_en: form.solution_en || null,
    link_github: form.link_github || null,
    link_demo: form.link_demo || null,
    link_website: form.link_website || null,
    is_featured: form.is_featured,
    sort_order: parseInt(form.sort_order) || 0,
  };
}

/* ── Component ── */
export default function ProjectEditor() {
  const { isDark } = useTheme();

  const [projects, setProjects] = useState<DbProject[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);

  const [panelOpen, setPanelOpen]   = useState(false);
  const [isNew,     setIsNew]       = useState(false);
  const [form,      setForm]        = useState<FormState>(EMPTY_FORM);
  const [activeTab, setActiveTab]   = useState<'basic' | 'detail' | 'tech'>('basic');

  const [confirmId, setConfirmId] = useState<string | null>(null);

  /* ── Fetch ── */
  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order');
    if (error) {
      toast.error('불러오기 실패: ' + error.message);
    } else {
      setProjects((data as DbProject[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  /* ── Helpers ── */
  const openAdd = () => {
    setIsNew(true);
    setForm(EMPTY_FORM);
    setActiveTab('basic');
    setPanelOpen(true);
  };

  const openEdit = (row: DbProject) => {
    setIsNew(false);
    setForm(dbToForm(row));
    setActiveTab('basic');
    setPanelOpen(true);
  };

  const closePanel = () => setPanelOpen(false);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  /* ── Save ── */
  const handleSave = async () => {
    if (!form.title_ko.trim()) { toast.error('제목(한국어)을 입력해주세요.'); return; }
    if (isNew && !form.id.trim()) { toast.error('ID를 입력해주세요.'); return; }

    setSaving(true);
    const payload = formToDb(form);

    if (isNew) {
      const { error } = await supabase.from('projects').insert(payload);
      if (error) { toast.error('추가 실패: ' + error.message); }
      else        { toast.success('프로젝트가 추가되었습니다.'); closePanel(); fetchProjects(); }
    } else {
      const { error } = await supabase
        .from('projects')
        .update({ ...payload, id: undefined })
        .eq('id', payload.id);
      if (error) { toast.error('수정 실패: ' + error.message); }
      else        { toast.success('저장되었습니다.'); closePanel(); fetchProjects(); }
    }

    setSaving(false);
  };

  /* ── Delete ── */
  const handleDelete = async () => {
    if (!confirmId) return;
    const { error } = await supabase.from('projects').delete().eq('id', confirmId);
    if (error) { toast.error('삭제 실패: ' + error.message); }
    else        { toast.success('삭제되었습니다.'); fetchProjects(); }
    setConfirmId(null);
  };

  /* ── Sort order inline edit ── */
  const handleSortChange = async (id: string, value: number) => {
    await supabase.from('projects').update({ sort_order: value }).eq('id', id);
    setProjects(prev => prev.map(p => p.id === id ? { ...p, sort_order: value } : p));
  };

  /* ── Render ── */
  const freelance = projects.filter(p => (p.project_type ?? 'personal') === 'freelance');
  const personal  = projects.filter(p => (p.project_type ?? 'personal') !== 'freelance');

  const renderTable = (list: DbProject[]) => (
    <Table $isDark={isDark}>
      <thead>
        <tr>
          <th>순서</th>
          <th>제목</th>
          <th>연도</th>
          <th>역할</th>
          <th>구분</th>
          <th style={{ textAlign: 'right' }}>관리</th>
        </tr>
      </thead>
      <tbody>
        {list.map(row => (
          <tr key={row.id}>
            <td>
              <SortInput
                $isDark={isDark}
                type="number"
                defaultValue={row.sort_order ?? 0}
                onBlur={e => handleSortChange(row.id, parseInt(e.target.value) || 0)}
              />
            </td>
            <td>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {row.is_featured && <Star size={12} color="#f59e0b" fill="#f59e0b" />}
                <strong>{row.title_ko}</strong>
              </div>
              <div style={{ fontSize: 11, color: '#86868b', marginTop: 2 }}>{row.title_en}</div>
            </td>
            <td>{row.year}</td>
            <td>{row.role_ko}</td>
            <td>
              <TypeBadge $type={(row.project_type ?? 'personal') as 'freelance' | 'personal'}>
                {(row.project_type ?? 'personal') === 'freelance' ? '외주' : '개인'}
              </TypeBadge>
            </td>
            <td>
              <ActionsRow style={{ justifyContent: 'flex-end' }}>
                <GhostButton $isDark={isDark} title="수정" onClick={() => openEdit(row)}>
                  <Edit2 size={15} />
                </GhostButton>
                <GhostButton
                  $isDark={isDark}
                  title="삭제"
                  style={{ color: '#d4183d' }}
                  onClick={() => setConfirmId(row.id)}
                >
                  <Trash2 size={15} />
                </GhostButton>
              </ActionsRow>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  return (
    <>
      {/* ── Main ── */}
      <PageHeader>
        <div>
          <PageTitle $isDark={isDark}>프로젝트 관리</PageTitle>
          <PageSubtitle>외주 · 개인 프로젝트를 관리합니다</PageSubtitle>
        </div>
        <PrimaryButton onClick={openAdd}>
          <Plus size={16} />
          프로젝트 추가
        </PrimaryButton>
      </PageHeader>

      {loading ? (
        <EmptyState $isDark={isDark}>불러오는 중...</EmptyState>
      ) : projects.length === 0 ? (
        <EmptyState $isDark={isDark}>등록된 프로젝트가 없습니다.</EmptyState>
      ) : (
        <>
          {/* CLIENT WORK */}
          {freelance.length > 0 && (
            <Card $isDark={isDark} style={{ marginBottom: 20 }}>
              <CardHeader $isDark={isDark}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <TypeBadge $type="freelance">CLIENT WORK</TypeBadge>
                  <span style={{ fontSize: 13, color: '#86868b' }}>외주 프로젝트 · {freelance.length}개</span>
                </div>
              </CardHeader>
              {renderTable(freelance)}
            </Card>
          )}

          {/* PERSONAL */}
          {personal.length > 0 && (
            <Card $isDark={isDark}>
              <CardHeader $isDark={isDark}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <TypeBadge $type="personal">PERSONAL</TypeBadge>
                  <span style={{ fontSize: 13, color: '#86868b' }}>개인 프로젝트 · {personal.length}개</span>
                </div>
              </CardHeader>
              {renderTable(personal)}
            </Card>
          )}
        </>
      )}

      {/* ── Slide Panel ── */}
      <Overlay $open={panelOpen} onClick={closePanel} />
      <Panel $isDark={isDark} $open={panelOpen}>
        <PanelHeader $isDark={isDark}>
          <PanelTitle $isDark={isDark}>
            {isNew ? '프로젝트 추가' : '프로젝트 수정'}
          </PanelTitle>
          <GhostButton $isDark={isDark} onClick={closePanel}>
            <X size={18} />
          </GhostButton>
        </PanelHeader>

        <TabRow $isDark={isDark} style={{ padding: '0 20px' }}>
          {(['basic', 'detail', 'tech'] as const).map(tab => (
            <Tab
              key={tab}
              $isDark={isDark}
              $active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {{ basic: '기본 정보', detail: '상세 내용', tech: '기술·링크' }[tab]}
            </Tab>
          ))}
        </TabRow>

        <PanelBody>
          {/* ── 기본 정보 ── */}
          {activeTab === 'basic' && (
            <>
              <FormSection $isDark={isDark}>
                <FormRow>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>구분 *</FormLabel>
                    <FormSelect
                      $isDark={isDark}
                      value={form.project_type}
                      onChange={e => setField('project_type', e.target.value as 'freelance' | 'personal')}
                    >
                      <option value="freelance">외주 (CLIENT WORK)</option>
                      <option value="personal">개인 (PERSONAL)</option>
                    </FormSelect>
                  </FormGroup>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>ID (slug) *</FormLabel>
                    <FormInput
                      $isDark={isDark}
                      placeholder="my-project"
                      value={form.id}
                      onChange={e => setField('id', e.target.value)}
                      disabled={!isNew}
                    />
                  </FormGroup>
                </FormRow>

                <FormRow>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>제목 (한국어) *</FormLabel>
                    <FormInput $isDark={isDark} value={form.title_ko}
                      onChange={e => setField('title_ko', e.target.value)} />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>제목 (영어)</FormLabel>
                    <FormInput $isDark={isDark} value={form.title_en}
                      onChange={e => setField('title_en', e.target.value)} />
                  </FormGroup>
                </FormRow>

                <FormGroup>
                  <FormLabel $isDark={isDark}>한 줄 설명 (한국어)</FormLabel>
                  <FormInput $isDark={isDark} value={form.description_ko}
                    onChange={e => setField('description_ko', e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <FormLabel $isDark={isDark}>한 줄 설명 (영어)</FormLabel>
                  <FormInput $isDark={isDark} value={form.description_en}
                    onChange={e => setField('description_en', e.target.value)} />
                </FormGroup>

                <FormRow>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>연도</FormLabel>
                    <FormInput $isDark={isDark} placeholder="2024" value={form.year}
                      onChange={e => setField('year', e.target.value)} />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>정렬 순서</FormLabel>
                    <FormInput $isDark={isDark} type="number" value={form.sort_order}
                      onChange={e => setField('sort_order', e.target.value)} />
                  </FormGroup>
                </FormRow>

                <FormRow>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>역할 (한국어)</FormLabel>
                    <FormInput $isDark={isDark} placeholder="Fullstack Engineer" value={form.role_ko}
                      onChange={e => setField('role_ko', e.target.value)} />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>역할 (영어)</FormLabel>
                    <FormInput $isDark={isDark} placeholder="Fullstack Engineer" value={form.role_en}
                      onChange={e => setField('role_en', e.target.value)} />
                  </FormGroup>
                </FormRow>

                <FormGroup>
                  <FormLabel $isDark={isDark}>커버 이미지 URL</FormLabel>
                  <FormInput $isDark={isDark} placeholder="https://..." value={form.cover_image_url}
                    onChange={e => setField('cover_image_url', e.target.value)} />
                </FormGroup>

                <ToggleWrapper>
                  <ToggleSwitch $on={form.is_featured}
                    onClick={() => setField('is_featured', !form.is_featured)} />
                  <ToggleLabel $isDark={isDark}>대표 프로젝트 (Featured)</ToggleLabel>
                </ToggleWrapper>
              </FormSection>
            </>
          )}

          {/* ── 상세 내용 ── */}
          {activeTab === 'detail' && (
            <>
              <FormSection $isDark={isDark}>
                <FormSectionTitle $isDark={isDark}>전체 설명</FormSectionTitle>
                <FormGroup>
                  <FormLabel $isDark={isDark}>전체 설명 (한국어)</FormLabel>
                  <FormTextarea $isDark={isDark} rows={6} value={form.full_description_ko}
                    onChange={e => setField('full_description_ko', e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <FormLabel $isDark={isDark}>전체 설명 (영어)</FormLabel>
                  <FormTextarea $isDark={isDark} rows={6} value={form.full_description_en}
                    onChange={e => setField('full_description_en', e.target.value)} />
                </FormGroup>
              </FormSection>

              <FormSection $isDark={isDark}>
                <FormSectionTitle $isDark={isDark}>주요 성과</FormSectionTitle>
                <FormGroup>
                  <FormLabel $isDark={isDark}>하이라이트 (한국어) — 줄바꿈으로 구분</FormLabel>
                  <FormTextarea $isDark={isDark} rows={5} value={form.highlights_ko}
                    placeholder={"성과 1\n성과 2\n성과 3"}
                    onChange={e => setField('highlights_ko', e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <FormLabel $isDark={isDark}>하이라이트 (영어)</FormLabel>
                  <FormTextarea $isDark={isDark} rows={5} value={form.highlights_en}
                    placeholder={"Achievement 1\nAchievement 2"}
                    onChange={e => setField('highlights_en', e.target.value)} />
                </FormGroup>
              </FormSection>

              <FormSection $isDark={isDark}>
                <FormSectionTitle $isDark={isDark}>도전 과제 / 해결</FormSectionTitle>
                <FormGroup>
                  <FormLabel $isDark={isDark}>도전 (한국어)</FormLabel>
                  <FormTextarea $isDark={isDark} rows={3} value={form.challenge_ko}
                    onChange={e => setField('challenge_ko', e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <FormLabel $isDark={isDark}>도전 (영어)</FormLabel>
                  <FormTextarea $isDark={isDark} rows={3} value={form.challenge_en}
                    onChange={e => setField('challenge_en', e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <FormLabel $isDark={isDark}>해결 (한국어)</FormLabel>
                  <FormTextarea $isDark={isDark} rows={3} value={form.solution_ko}
                    onChange={e => setField('solution_ko', e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <FormLabel $isDark={isDark}>해결 (영어)</FormLabel>
                  <FormTextarea $isDark={isDark} rows={3} value={form.solution_en}
                    onChange={e => setField('solution_en', e.target.value)} />
                </FormGroup>
              </FormSection>
            </>
          )}

          {/* ── 기술·링크 ── */}
          {activeTab === 'tech' && (
            <>
              <FormSection $isDark={isDark}>
                <FormSectionTitle $isDark={isDark}>기술 스택 — 쉼표로 구분</FormSectionTitle>
                <FormGroup>
                  <FormLabel $isDark={isDark}>프론트엔드</FormLabel>
                  <FormInput $isDark={isDark} placeholder="React, TypeScript, Tailwind CSS"
                    value={form.tech_frontend}
                    onChange={e => setField('tech_frontend', e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <FormLabel $isDark={isDark}>백엔드</FormLabel>
                  <FormInput $isDark={isDark} placeholder="Node.js, Express, PostgreSQL"
                    value={form.tech_backend}
                    onChange={e => setField('tech_backend', e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <FormLabel $isDark={isDark}>디자인</FormLabel>
                  <FormInput $isDark={isDark} placeholder="Figma, Photoshop"
                    value={form.tech_design}
                    onChange={e => setField('tech_design', e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <FormLabel $isDark={isDark}>기타 (DevOps, CI/CD 등)</FormLabel>
                  <FormInput $isDark={isDark} placeholder="Vercel, GitHub Actions, AWS S3"
                    value={form.tech_others}
                    onChange={e => setField('tech_others', e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <FormLabel $isDark={isDark}>태그 (카드에 표시)</FormLabel>
                  <FormInput $isDark={isDark} placeholder="React, TypeScript, Production"
                    value={form.tags}
                    onChange={e => setField('tags', e.target.value)} />
                </FormGroup>
              </FormSection>

              <FormSection $isDark={isDark}>
                <FormSectionTitle $isDark={isDark}>링크</FormSectionTitle>
                <FormGroup>
                  <FormLabel $isDark={isDark}>GitHub</FormLabel>
                  <FormInput $isDark={isDark} placeholder="https://github.com/..."
                    value={form.link_github}
                    onChange={e => setField('link_github', e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <FormLabel $isDark={isDark}>데모 / Figma</FormLabel>
                  <FormInput $isDark={isDark} placeholder="https://..."
                    value={form.link_demo}
                    onChange={e => setField('link_demo', e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <FormLabel $isDark={isDark}>실제 서비스 URL</FormLabel>
                  <FormInput $isDark={isDark} placeholder="https://..."
                    value={form.link_website}
                    onChange={e => setField('link_website', e.target.value)} />
                </FormGroup>
              </FormSection>
            </>
          )}
        </PanelBody>

        <PanelFooter $isDark={isDark}>
          <SecondaryButton $isDark={isDark} onClick={closePanel}>취소</SecondaryButton>
          <PrimaryButton onClick={handleSave} disabled={saving}>
            {saving ? '저장 중...' : isNew ? '추가' : '저장'}
          </PrimaryButton>
        </PanelFooter>
      </Panel>

      {/* ── Delete Confirm ── */}
      {confirmId && (
        <ConfirmModal $isDark={isDark}>
          <Overlay $open style={{ zIndex: 350 }} onClick={() => setConfirmId(null)} />
          <ConfirmBox $isDark={isDark} style={{ position: 'relative', zIndex: 400 }}>
            <h3>프로젝트 삭제</h3>
            <p>
              <strong>{projects.find(p => p.id === confirmId)?.title_ko}</strong> 프로젝트를
              삭제할까요? 이 작업은 되돌릴 수 없습니다.
            </p>
            <ConfirmActions>
              <SecondaryButton $isDark={isDark} onClick={() => setConfirmId(null)}>취소</SecondaryButton>
              <DestructiveButton onClick={handleDelete}>삭제</DestructiveButton>
            </ConfirmActions>
          </ConfirmBox>
        </ConfirmModal>
      )}
    </>
  );
}

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, Trash2, Save, ChevronDown, ChevronRight } from 'lucide-react';
import { adminSupabase as supabase } from '../../lib/supabase';
import { useTheme } from '../../contexts/ThemeContext';
import type { DbChatbotCategory, DbChatbotQuestion } from '../../lib/types/database';
import {
  PageHeader, PageTitle, PageSubtitle,
  Card, FormSection, SectionTitle, FormGroup, FormLabel,
  FormInput, FormTextarea, FormRow,
  PrimaryButton, SecondaryButton, GhostButton,
  Badge, EmptyState
} from './AdminStyles';

const CategoryCard = styled.div<{ $isDark: boolean }>`
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'};
  border-radius: 10px;
  overflow: hidden;
`;

const CategoryHeader = styled.div<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'};

  &:hover { background: ${p => p.$isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'}; }
`;

const CategoryTitle = styled.span<{ $isDark: boolean }>`
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
`;

const CategoryIcon = styled.span`
  font-size: 18px;
`;

const QuestionsArea = styled.div<{ $isDark: boolean }>`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-top: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'};
`;

const QuestionCard = styled.div<{ $isDark: boolean }>`
  padding: 12px;
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export default function ChatbotEditor() {
  const { isDark } = useTheme();
  const [categories, setCategories] = useState<DbChatbotCategory[]>([]);
  const [questions, setQuestions] = useState<DbChatbotQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const fetchAll = async () => {
    setLoading(true);
    const [c, q] = await Promise.all([
      supabase.from('chatbot_categories').select('*').order('sort_order'),
      supabase.from('chatbot_questions').select('*').order('sort_order'),
    ]);
    setCategories((c.data as DbChatbotCategory[]) ?? []);
    setQuestions((q.data as DbChatbotQuestion[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const toggle = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Category CRUD
  const addCategory = () => {
    const newCat: DbChatbotCategory = {
      id: `cat-${Date.now()}`,
      icon: '💬',
      title_ko: '새 카테고리',
      title_en: 'New Category',
      sort_order: categories.length,
    };
    setCategories(prev => [...prev, newCat]);
  };

  const updateCategory = (index: number, field: keyof DbChatbotCategory, value: string | number) => {
    setCategories(prev => prev.map((c, i) => i === index ? { ...c, [field]: value } : c));
  };

  const removeCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    setQuestions(prev => prev.filter(q => q.category_id !== id));
  };

  // Question CRUD
  const addQuestion = (categoryId: string) => {
    const catQuestions = questions.filter(q => q.category_id === categoryId);
    const newQ: DbChatbotQuestion = {
      id: crypto.randomUUID(),
      category_id: categoryId,
      question_ko: '', question_en: '',
      answer_ko: '', answer_en: '',
      action: null,
      sort_order: catQuestions.length,
    };
    setQuestions(prev => [...prev, newQ]);
  };

  const updateQuestion = (id: string, field: keyof DbChatbotQuestion, value: string | null) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const removeQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        supabase.from('chatbot_questions').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('chatbot_categories').delete().neq('id', '_'),
      ]);
      if (categories.length > 0) {
        await supabase.from('chatbot_categories').insert(categories);
      }
      if (questions.length > 0) {
        await supabase.from('chatbot_questions').insert(questions);
      }
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
          <PageTitle $isDark={isDark}>챗봇 관리</PageTitle>
          <PageSubtitle>{categories.length}개 카테고리 · {questions.length}개 질문</PageSubtitle>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <SecondaryButton $isDark={isDark} onClick={addCategory}><Plus /> 카테고리 추가</SecondaryButton>
          <PrimaryButton onClick={handleSave} disabled={saving}>
            <Save /> {saving ? '저장 중...' : '전체 저장'}
          </PrimaryButton>
        </div>
      </PageHeader>

      <Card $isDark={isDark}>
        <FormSection $isDark={isDark}>
          {categories.length === 0 ? (
            <EmptyState $isDark={isDark}>카테고리가 없습니다</EmptyState>
          ) : (
            categories.map((cat, ci) => {
              const catQuestions = questions.filter(q => q.category_id === cat.id);
              const isOpen = expanded.has(cat.id);

              return (
                <CategoryCard key={cat.id} $isDark={isDark}>
                  <CategoryHeader $isDark={isDark} onClick={() => toggle(cat.id)}>
                    {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    <CategoryIcon>{cat.icon}</CategoryIcon>
                    <CategoryTitle $isDark={isDark}>{cat.title_ko}</CategoryTitle>
                    <Badge $isDark={isDark}>{catQuestions.length}개</Badge>
                    <GhostButton $isDark={isDark} onClick={e => { e.stopPropagation(); removeCategory(cat.id); }}
                      style={{ color: '#d4183d' }}>
                      <Trash2 />
                    </GhostButton>
                  </CategoryHeader>

                  {isOpen && (
                    <QuestionsArea $isDark={isDark}>
                      <FormRow>
                        <FormGroup>
                          <FormLabel $isDark={isDark}>아이콘</FormLabel>
                          <FormInput $isDark={isDark} value={cat.icon} style={{ width: 60 }}
                            onChange={e => updateCategory(ci, 'icon', e.target.value)} />
                        </FormGroup>
                        <FormGroup>
                          <FormLabel $isDark={isDark}>정렬 순서</FormLabel>
                          <FormInput $isDark={isDark} type="number" value={cat.sort_order}
                            onChange={e => updateCategory(ci, 'sort_order', Number(e.target.value))} />
                        </FormGroup>
                      </FormRow>
                      <FormRow>
                        <FormGroup>
                          <FormLabel $isDark={isDark}>카테고리명 (KO)</FormLabel>
                          <FormInput $isDark={isDark} value={cat.title_ko}
                            onChange={e => updateCategory(ci, 'title_ko', e.target.value)} />
                        </FormGroup>
                        <FormGroup>
                          <FormLabel $isDark={isDark}>카테고리명 (EN)</FormLabel>
                          <FormInput $isDark={isDark} value={cat.title_en}
                            onChange={e => updateCategory(ci, 'title_en', e.target.value)} />
                        </FormGroup>
                      </FormRow>

                      <SectionTitle $isDark={isDark} style={{ marginTop: 8 }}>질문 목록</SectionTitle>
                      {catQuestions.map(q => (
                        <QuestionCard key={q.id} $isDark={isDark}>
                          <FormRow>
                            <FormGroup>
                              <FormLabel $isDark={isDark}>질문 (KO)</FormLabel>
                              <FormInput $isDark={isDark} value={q.question_ko}
                                onChange={e => updateQuestion(q.id, 'question_ko', e.target.value)} />
                            </FormGroup>
                            <FormGroup>
                              <FormLabel $isDark={isDark}>질문 (EN)</FormLabel>
                              <FormInput $isDark={isDark} value={q.question_en}
                                onChange={e => updateQuestion(q.id, 'question_en', e.target.value)} />
                            </FormGroup>
                          </FormRow>
                          <FormGroup>
                            <FormLabel $isDark={isDark}>답변 (KO)</FormLabel>
                            <FormTextarea $isDark={isDark} value={q.answer_ko}
                              onChange={e => updateQuestion(q.id, 'answer_ko', e.target.value)}
                              style={{ minHeight: 60 }} />
                          </FormGroup>
                          <FormGroup>
                            <FormLabel $isDark={isDark}>답변 (EN)</FormLabel>
                            <FormTextarea $isDark={isDark} value={q.answer_en}
                              onChange={e => updateQuestion(q.id, 'answer_en', e.target.value)}
                              style={{ minHeight: 60 }} />
                          </FormGroup>
                          <FormGroup>
                            <FormLabel $isDark={isDark}>액션 (optional)</FormLabel>
                            <FormInput $isDark={isDark} value={q.action ?? ''}
                              onChange={e => updateQuestion(q.id, 'action', e.target.value || null)}
                              placeholder="contact / navigate:url" />
                          </FormGroup>
                          <GhostButton $isDark={isDark} onClick={() => removeQuestion(q.id)}
                            style={{ color: '#d4183d', alignSelf: 'flex-end' }}>
                            <Trash2 />
                          </GhostButton>
                        </QuestionCard>
                      ))}
                      <SecondaryButton $isDark={isDark} onClick={() => addQuestion(cat.id)}>
                        <Plus /> 질문 추가
                      </SecondaryButton>
                    </QuestionsArea>
                  )}
                </CategoryCard>
              );
            })
          )}
        </FormSection>
      </Card>
    </>
  );
}

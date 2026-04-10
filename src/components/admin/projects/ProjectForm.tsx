import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, Upload, Save, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { adminSupabase as supabase } from '../../../lib/supabase';
import { uploadFile } from '../../../lib/uploadFile';
import { useTheme } from '../../../contexts/ThemeContext';
import type { DbProject, DbProjectImage } from '../../../lib/types/database';
import TagInput from '../../ui/TagInput';
import {
  Card, FormSection, SectionTitle, FormGroup, FormLabel,
  FormInput, FormTextarea, FormRow,
  PrimaryButton, SecondaryButton, DestructiveButton,
  TabRow, Tab, ToggleWrapper, ToggleSwitch, ToggleLabel,
  FileUploadArea, Badge
} from '../AdminStyles';

// ============================================
// Page-level styles
// ============================================

const PageTop = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const BackBtn = styled.button<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'};
  font-size: 14px;
  cursor: pointer;
  font-family: inherit;
  padding: 6px 0;

  &:hover { color: #0c8ce9; }
  svg { width: 18px; height: 18px; }
`;

const PageTitle = styled.h1<{ $isDark: boolean }>`
  font-size: 22px;
  font-weight: 700;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  letter-spacing: -0.5px;
`;

const FormActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: 1px solid rgba(128,128,128,0.1);
`;

const ListItemRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-start;
`;

const ListItemInput = styled.textarea<{ $isDark: boolean }>`
  flex: 1;
  padding: 8px 12px;
  font-size: 14px;
  line-height: 1.5;
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.05)' : '#f3f3f5'};
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
  border-radius: 8px;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  font-family: inherit;
  resize: vertical;
  min-height: 40px;

  &:focus { outline: none; border-color: #0c8ce9; }
`;

const RemoveBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  background: rgba(212,24,61,0.08);
  color: #d4183d;
  cursor: pointer;
  flex-shrink: 0;
  margin-top: 4px;

  &:hover { background: rgba(212,24,61,0.15); }
  svg { width: 14px; height: 14px; }
`;

const AddItemBtn = styled.button<{ $isDark: boolean }>`
  font-size: 13px;
  color: #0c8ce9;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  padding: 4px 0;

  &:hover { text-decoration: underline; }
`;

const CoverPreview = styled.img`
  width: 100%;
  max-width: 300px;
  border-radius: 12px;
  object-fit: cover;
  margin-top: 8px;
`;

const GalleryItem = styled.div<{ $isDark: boolean }>`
  display: flex;
  gap: 16px;
  padding: 16px;
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'};
  border-radius: 12px;
  margin-bottom: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const GalleryPreview = styled.img`
  width: 160px;
  max-height: 120px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
`;

const GalleryMeta = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const GalleryBtns = styled.div`
  display: flex;
  gap: 4px;
  align-items: flex-start;
`;

const SmallBtn = styled.button<{ $isDark: boolean; $danger?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  border: none;
  background: ${p => p.$danger ? 'rgba(212,24,61,0.08)' : p.$isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'};
  color: ${p => p.$danger ? '#d4183d' : p.$isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)'};
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background: ${p => p.$danger ? 'rgba(212,24,61,0.15)' : p.$isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
  }

  &:disabled { opacity: 0.3; cursor: default; }
  svg { width: 14px; height: 14px; }
`;

// ============================================
// Default empty project
// ============================================

const emptyProject: Omit<DbProject, 'created_at' | 'updated_at'> = {
  id: '',
  title_ko: '', title_en: '',
  description_ko: '', description_en: '',
  full_description_ko: '', full_description_en: '',
  role_ko: '', role_en: '',
  year: '',
  tags: [],
  cover_image_url: null,
  tech_frontend: [], tech_backend: [], tech_design: [], tech_others: [],
  highlights_ko: [], highlights_en: [],
  challenge_ko: null, challenge_en: null,
  solution_ko: null, solution_en: null,
  link_github: null, link_demo: null, link_website: null,
  is_featured: false,
  sort_order: 0,
};

// ============================================
// Gallery image type
// ============================================

interface GalleryImage {
  id: string;
  url: string;
  caption_ko: string;
  caption_en: string;
  file?: File;
  isNew: boolean;
}

// ============================================
// Component
// ============================================

export default function ProjectForm() {
  const { isDark } = useTheme();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id && id !== 'new';

  const [form, setForm] = useState(emptyProject);
  const [langTab, setLangTab] = useState<'ko' | 'en'>('ko');
  const [saving, setSaving] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(isEdit);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);

  useEffect(() => {
    if (isEdit) {
      supabase.from('projects').select('*').eq('id', id).single()
        .then(({ data }) => {
          if (data) {
            const d = data as DbProject;
            setForm({
              ...d,
              tags:          d.tags          ?? [],
              tech_frontend: d.tech_frontend ?? [],
              tech_backend:  d.tech_backend  ?? [],
              tech_design:   d.tech_design   ?? [],
              tech_others:   d.tech_others   ?? [],
              highlights_ko: d.highlights_ko ?? [],
              highlights_en: d.highlights_en ?? [],
            });
          }
          setLoading(false);
        });
      supabase.from('project_images').select('*').eq('project_id', id).order('sort_order')
        .then(({ data }) => {
          if (data) {
            setGalleryImages((data as DbProjectImage[]).map(img => ({
              id: img.id,
              url: img.url,
              caption_ko: img.caption_ko ?? '',
              caption_en: img.caption_en ?? '',
              isNew: false,
            })));
          }
        });
    }
  }, [id, isEdit]);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const updateListItem = (field: 'highlights_ko' | 'highlights_en', index: number, value: string) => {
    const list = [...form[field]];
    list[index] = value;
    set(field, list);
  };

  const addListItem = (field: 'highlights_ko' | 'highlights_en') => {
    set(field, [...form[field], '']);
  };

  const removeListItem = (field: 'highlights_ko' | 'highlights_en', index: number) => {
    set(field, form[field].filter((_, i) => i !== index));
  };

  // Gallery management
  const handleGalleryAdd = (files: FileList | null) => {
    if (!files) return;
    const newImages: GalleryImage[] = Array.from(files).map(file => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      caption_ko: '',
      caption_en: '',
      file,
      isNew: true,
    }));
    setGalleryImages(prev => [...prev, ...newImages]);
  };

  const updateGalleryCaption = (imgId: string, field: 'caption_ko' | 'caption_en', value: string) => {
    setGalleryImages(prev => prev.map(img => img.id === imgId ? { ...img, [field]: value } : img));
  };

  const removeGalleryImage = (imgId: string, isNew: boolean) => {
    setGalleryImages(prev => prev.filter(img => img.id !== imgId));
    if (!isNew) setDeletedImageIds(prev => [...prev, imgId]);
  };

  const moveGalleryImage = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= galleryImages.length) return;
    const updated = [...galleryImages];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setGalleryImages(updated);
  };

  const slugify = (val: string) => val.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

  const handleSave = async () => {
    const cleanId = slugify(form.id);
    if (!cleanId) { toast.error('프로젝트 ID를 입력해주세요.'); return; }
    if (!form.title_ko) { toast.error('제목(한국어)을 입력해주세요.'); return; }
    setSaving(true);

    try {
      let coverUrl = form.cover_image_url;
      if (coverFile) {
        const ext = coverFile.name.split('.').pop();
        coverUrl = await uploadFile(
          'project-images',
          `covers/${cleanId}.${ext}`,
          coverFile
        );
      }

      const payload = {
        ...form,
        id: cleanId,
        cover_image_url: coverUrl,
        updated_at: new Date().toISOString(),
      };

      if (isEdit) {
        const { error } = await supabase.from('projects').update(payload).eq('id', cleanId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('projects').insert({ ...payload, created_at: new Date().toISOString() });
        if (error) throw error;
      }

      // Save gallery images
      for (const delId of deletedImageIds) {
        await supabase.from('project_images').delete().eq('id', delId);
      }
      for (let i = 0; i < galleryImages.length; i++) {
        const img = galleryImages[i];
        if (img.isNew && img.file) {
          const ext = img.file.name.split('.').pop();
          const storagePath = `gallery/${cleanId}/${img.id}.${ext}`;
          const imgUrl = await uploadFile('project-images', storagePath, img.file);
          await supabase.from('project_images').insert({
            project_id: cleanId,
            url: imgUrl,
            caption_ko: img.caption_ko || null,
            caption_en: img.caption_en || null,
            sort_order: i,
          });
        } else if (!img.isNew) {
          await supabase.from('project_images').update({
            caption_ko: img.caption_ko || null,
            caption_en: img.caption_en || null,
            sort_order: i,
          }).eq('id', img.id);
        }
      }

      toast.success('저장되었습니다.');
      navigate('/admin/projects');
    } catch (err: unknown) {
      console.error('Save failed:', err);
      const msg = err && typeof err === 'object' && 'message' in err
        ? (err as { message: string }).message
        : '저장에 실패했습니다.';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 40, color: '#86868b' }}>불러오는 중...</div>;
  }

  return (
    <>
      <PageTop>
        <BackBtn $isDark={isDark} onClick={() => navigate('/admin/projects')}>
          <ArrowLeft /> 목록으로
        </BackBtn>
      </PageTop>

      <PageTitle $isDark={isDark} style={{ marginBottom: 24 }}>
        {isEdit ? '프로젝트 수정' : '새 프로젝트'}
      </PageTitle>

      <Card $isDark={isDark}>
        {/* === Basic Info === */}
        <FormSection $isDark={isDark}>
          <SectionTitle $isDark={isDark}>기본 정보</SectionTitle>
          <FormRow>
            <FormGroup>
              <FormLabel $isDark={isDark}>프로젝트 ID (URL slug)</FormLabel>
              <FormInput
                $isDark={isDark}
                value={form.id}
                onChange={e => set('id', e.target.value)}
                onBlur={e => set('id', slugify(e.target.value))}
                placeholder="my-project"
                disabled={isEdit}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel $isDark={isDark}>연도</FormLabel>
              <FormInput $isDark={isDark} value={form.year} onChange={e => set('year', e.target.value)} placeholder="2024-2025" />
            </FormGroup>
          </FormRow>

          <TabRow $isDark={isDark}>
            <Tab $isDark={isDark} $active={langTab === 'ko'} onClick={() => setLangTab('ko')}>한국어</Tab>
            <Tab $isDark={isDark} $active={langTab === 'en'} onClick={() => setLangTab('en')}>English</Tab>
          </TabRow>

          <FormRow>
            <FormGroup>
              <FormLabel $isDark={isDark}>제목 ({langTab.toUpperCase()})</FormLabel>
              <FormInput
                $isDark={isDark}
                value={langTab === 'ko' ? form.title_ko : form.title_en}
                onChange={e => set(langTab === 'ko' ? 'title_ko' : 'title_en', e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel $isDark={isDark}>역할 ({langTab.toUpperCase()})</FormLabel>
              <FormInput
                $isDark={isDark}
                value={langTab === 'ko' ? form.role_ko : form.role_en}
                onChange={e => set(langTab === 'ko' ? 'role_ko' : 'role_en', e.target.value)}
              />
            </FormGroup>
          </FormRow>

          <FormGroup>
            <FormLabel $isDark={isDark}>짧은 설명 ({langTab.toUpperCase()})</FormLabel>
            <FormTextarea
              $isDark={isDark}
              value={langTab === 'ko' ? form.description_ko : form.description_en}
              onChange={e => set(langTab === 'ko' ? 'description_ko' : 'description_en', e.target.value)}
              style={{ minHeight: 80 }}
            />
          </FormGroup>

          <FormGroup>
            <FormLabel $isDark={isDark}>상세 설명 ({langTab.toUpperCase()})</FormLabel>
            <FormTextarea
              $isDark={isDark}
              value={langTab === 'ko' ? form.full_description_ko : form.full_description_en}
              onChange={e => set(langTab === 'ko' ? 'full_description_ko' : 'full_description_en', e.target.value)}
              style={{ minHeight: 140 }}
            />
          </FormGroup>

          <FormRow>
            <FormGroup>
              <ToggleWrapper onClick={() => set('is_featured', !form.is_featured)}>
                <ToggleSwitch $on={form.is_featured} />
                <ToggleLabel $isDark={isDark}>Featured 프로젝트</ToggleLabel>
              </ToggleWrapper>
            </FormGroup>
            <FormGroup>
              <FormLabel $isDark={isDark}>정렬 순서</FormLabel>
              <FormInput $isDark={isDark} type="number" value={form.sort_order} onChange={e => set('sort_order', Number(e.target.value))} />
            </FormGroup>
          </FormRow>
        </FormSection>

        {/* === Challenge / Solution === */}
        <FormSection $isDark={isDark}>
          <SectionTitle $isDark={isDark}>Challenge & Solution</SectionTitle>
          <Badge $variant="success">프로젝트에서 어떤 문제를 어떻게 해결했는지</Badge>

          <FormGroup>
            <FormLabel $isDark={isDark}>Challenge ({langTab.toUpperCase()})</FormLabel>
            <FormTextarea
              $isDark={isDark}
              value={(langTab === 'ko' ? form.challenge_ko : form.challenge_en) ?? ''}
              onChange={e => set(langTab === 'ko' ? 'challenge_ko' : 'challenge_en', e.target.value)}
              placeholder="어떤 문제/과제가 있었나요?"
              style={{ minHeight: 100 }}
            />
          </FormGroup>

          <FormGroup>
            <FormLabel $isDark={isDark}>Solution ({langTab.toUpperCase()})</FormLabel>
            <FormTextarea
              $isDark={isDark}
              value={(langTab === 'ko' ? form.solution_ko : form.solution_en) ?? ''}
              onChange={e => set(langTab === 'ko' ? 'solution_ko' : 'solution_en', e.target.value)}
              placeholder="어떻게 해결했나요?"
              style={{ minHeight: 100 }}
            />
          </FormGroup>
        </FormSection>

        {/* === Tech Stack === */}
        <FormSection $isDark={isDark}>
          <SectionTitle $isDark={isDark}>기술 스택</SectionTitle>
          <TagInput label="Frontend" tags={form.tech_frontend} onChange={v => set('tech_frontend', v)} isDark={isDark} placeholder="React, TypeScript..." />
          <TagInput label="Backend" tags={form.tech_backend} onChange={v => set('tech_backend', v)} isDark={isDark} placeholder="Node.js, PostgreSQL..." />
          <TagInput label="Design" tags={form.tech_design} onChange={v => set('tech_design', v)} isDark={isDark} placeholder="Figma, Illustrator..." />
          <TagInput label="Others" tags={form.tech_others} onChange={v => set('tech_others', v)} isDark={isDark} placeholder="Git, Docker..." />
          <TagInput label="프로젝트 태그" tags={form.tags} onChange={v => set('tags', v)} isDark={isDark} placeholder="태그 추가" />
        </FormSection>

        {/* === Highlights === */}
        <FormSection $isDark={isDark}>
          <SectionTitle $isDark={isDark}>주요 성과 / Highlights ({langTab.toUpperCase()})</SectionTitle>
          {(langTab === 'ko' ? form.highlights_ko : form.highlights_en).map((item, i) => (
            <ListItemRow key={i}>
              <ListItemInput
                $isDark={isDark}
                value={item}
                onChange={e => updateListItem(langTab === 'ko' ? 'highlights_ko' : 'highlights_en', i, e.target.value)}
                rows={1}
              />
              <RemoveBtn onClick={() => removeListItem(langTab === 'ko' ? 'highlights_ko' : 'highlights_en', i)}>
                <Trash2 />
              </RemoveBtn>
            </ListItemRow>
          ))}
          <AddItemBtn $isDark={isDark} onClick={() => addListItem(langTab === 'ko' ? 'highlights_ko' : 'highlights_en')}>
            + 항목 추가
          </AddItemBtn>
        </FormSection>

        {/* === Links === */}
        <FormSection $isDark={isDark}>
          <SectionTitle $isDark={isDark}>링크</SectionTitle>
          <FormRow>
            <FormGroup>
              <FormLabel $isDark={isDark}>GitHub</FormLabel>
              <FormInput $isDark={isDark} value={form.link_github ?? ''} onChange={e => set('link_github', e.target.value || null)} placeholder="https://github.com/..." />
            </FormGroup>
            <FormGroup>
              <FormLabel $isDark={isDark}>Demo</FormLabel>
              <FormInput $isDark={isDark} value={form.link_demo ?? ''} onChange={e => set('link_demo', e.target.value || null)} placeholder="https://..." />
            </FormGroup>
          </FormRow>
          <FormGroup>
            <FormLabel $isDark={isDark}>Website</FormLabel>
            <FormInput $isDark={isDark} value={form.link_website ?? ''} onChange={e => set('link_website', e.target.value || null)} placeholder="https://..." />
          </FormGroup>
        </FormSection>

        {/* === Cover Image === */}
        <FormSection $isDark={isDark}>
          <SectionTitle $isDark={isDark}>커버 이미지</SectionTitle>
          <FileUploadArea $isDark={isDark} $hasFile={!!coverFile || !!form.cover_image_url}>
            <Upload />
            <span>{coverFile ? coverFile.name : '이미지를 클릭하거나 드래그하세요'}</span>
            <input type="file" accept="image/*" onChange={e => setCoverFile(e.target.files?.[0] ?? null)} />
          </FileUploadArea>
          {(coverFile || form.cover_image_url) && (
            <CoverPreview
              src={coverFile ? URL.createObjectURL(coverFile) : form.cover_image_url!}
              alt="Cover preview"
            />
          )}
        </FormSection>

        {/* === Gallery Images === */}
        <FormSection $isDark={isDark}>
          <SectionTitle $isDark={isDark}>상세 이미지</SectionTitle>
          <Badge $variant="success">프로젝트 상세페이지에 표시되는 설명 이미지 (세로로 길게 표시됩니다)</Badge>

          {galleryImages.map((img, idx) => (
            <GalleryItem key={img.id} $isDark={isDark}>
              <GalleryPreview
                src={img.file ? img.url : img.url}
                alt={img.caption_ko || `Image ${idx + 1}`}
              />
              <GalleryMeta>
                <FormInput
                  $isDark={isDark}
                  value={img.caption_ko}
                  onChange={e => updateGalleryCaption(img.id, 'caption_ko', e.target.value)}
                  placeholder="캡션 (한국어)"
                  style={{ fontSize: 13 }}
                />
                <FormInput
                  $isDark={isDark}
                  value={img.caption_en}
                  onChange={e => updateGalleryCaption(img.id, 'caption_en', e.target.value)}
                  placeholder="Caption (English)"
                  style={{ fontSize: 13 }}
                />
              </GalleryMeta>
              <GalleryBtns>
                <SmallBtn $isDark={isDark} onClick={() => moveGalleryImage(idx, -1)} disabled={idx === 0}>
                  <ChevronUp />
                </SmallBtn>
                <SmallBtn $isDark={isDark} onClick={() => moveGalleryImage(idx, 1)} disabled={idx === galleryImages.length - 1}>
                  <ChevronDown />
                </SmallBtn>
                <SmallBtn $isDark={isDark} $danger onClick={() => removeGalleryImage(img.id, img.isNew)}>
                  <Trash2 />
                </SmallBtn>
              </GalleryBtns>
            </GalleryItem>
          ))}

          <FileUploadArea $isDark={isDark} $hasFile={false}>
            <Upload />
            <span>이미지를 클릭하거나 드래그하세요 (여러 장 가능)</span>
            <input type="file" accept="image/*" multiple onChange={e => handleGalleryAdd(e.target.files)} />
          </FileUploadArea>
        </FormSection>

        {/* === Actions === */}
        <FormActions>
          <SecondaryButton $isDark={isDark} onClick={() => navigate('/admin/projects')}>
            취소
          </SecondaryButton>
          <PrimaryButton onClick={handleSave} disabled={saving || !form.id || !form.title_ko}>
            <Save /> {saving ? '저장 중...' : '저장'}
          </PrimaryButton>
        </FormActions>
      </Card>
    </>
  );
}

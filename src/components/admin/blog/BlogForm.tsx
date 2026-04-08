import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { uploadFile } from '../../../lib/uploadFile';
import { useTheme } from '../../../contexts/ThemeContext';
import type { DbBlogPost } from '../../../lib/types/database';
import TagInput from '../../ui/TagInput';
import MarkdownEditor from './MarkdownEditor';
import {
  Card, FormSection, SectionTitle, FormGroup, FormLabel,
  FormInput, FormTextarea, FormRow, FormSelect,
  PrimaryButton, SecondaryButton,
  TabRow, Tab, ToggleWrapper, ToggleSwitch, ToggleLabel,
  FileUploadArea, Badge
} from '../AdminStyles';

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

const EditorTabRow = styled.div<{ $isDark: boolean }>`
  display: flex;
  gap: 0;
  border-bottom: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'};
  margin-bottom: 16px;
`;

const EditorTab = styled.button<{ $isDark: boolean; $active: boolean }>`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: ${p => p.$active ? '600' : '500'};
  color: ${p => p.$active ? '#0c8ce9' : p.$isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)'};
  background: none;
  border: none;
  border-bottom: 2px solid ${p => p.$active ? '#0c8ce9' : 'transparent'};
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s ease;
  margin-bottom: -1px;

  &:hover {
    color: ${p => p.$active ? '#0c8ce9' : p.$isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'};
  }
`;

const PreviewArea = styled.div<{ $isDark: boolean }>`
  padding: 24px;
  min-height: 400px;
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.03)' : '#fafafa'};
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
  border-radius: 8px;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  font-size: 15px;
  line-height: 1.8;

  h1 { font-size: 28px; font-weight: 700; margin: 24px 0 12px; letter-spacing: -0.5px; }
  h2 { font-size: 22px; font-weight: 700; margin: 20px 0 10px; letter-spacing: -0.3px; }
  h3 { font-size: 18px; font-weight: 600; margin: 16px 0 8px; }
  p { margin: 8px 0; }
  ul { margin: 8px 0; padding-left: 24px; }
  li { margin: 4px 0; }

  code {
    padding: 2px 6px;
    background: ${p => p.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'};
    border-radius: 4px;
    font-size: 13px;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
  }

  pre {
    padding: 16px;
    background: ${p => p.$isDark ? 'rgba(0,0,0,0.4)' : '#1a1a2e'};
    border-radius: 8px;
    overflow-x: auto;
    margin: 12px 0;

    code {
      padding: 0;
      background: none;
      color: #e0e0e0;
      font-size: 13px;
    }
  }

  strong { font-weight: 700; }

  a {
    color: #0c8ce9;
    text-decoration: underline;
  }

  img {
    max-width: 100%;
    border-radius: 8px;
    margin: 12px 0;
  }
`;

const ThumbnailPreview = styled.img`
  width: 100%;
  max-width: 200px;
  border-radius: 8px;
  object-fit: cover;
  margin-top: 8px;
`;

const emptyPost: Omit<DbBlogPost, 'created_at' | 'updated_at'> = {
  id: '',
  title_ko: '', title_en: '',
  excerpt_ko: '', excerpt_en: '',
  category_ko: '', category_en: '',
  read_time_ko: '', read_time_en: '',
  content_ko: '', content_en: '',
  tags: [],
  thumbnail_url: null,
  status: 'draft',
  date: new Date().toISOString().split('T')[0],
};

export default function BlogForm() {
  const { isDark } = useTheme();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id && id !== 'new';

  const [form, setForm] = useState(emptyPost);
  const [langTab, setLangTab] = useState<'ko' | 'en'>('ko');
  const [editorTab, setEditorTab] = useState<'edit' | 'preview'>('edit');
  const [saving, setSaving] = useState(false);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      supabase.from('blog_posts').select('*').eq('id', id).single()
        .then(({ data }) => {
          if (data) setForm(data as DbBlogPost);
          setLoading(false);
        });
    }
  }, [id, isEdit]);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!form.id || !form.title_ko) return;
    setSaving(true);

    try {
      let thumbUrl = form.thumbnail_url;
      if (thumbFile) {
        const ext = thumbFile.name.split('.').pop();
        thumbUrl = await uploadFile(
          'blog-thumbnails',
          `${form.id}.${ext}`,
          thumbFile
        );
      }

      const payload = {
        ...form,
        thumbnail_url: thumbUrl,
        updated_at: new Date().toISOString(),
      };

      if (isEdit) {
        await supabase.from('blog_posts').update(payload).eq('id', form.id);
      } else {
        await supabase.from('blog_posts').insert({ ...payload, created_at: new Date().toISOString() });
      }

      navigate('/admin/blog');
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const renderPreview = (markdown: string) => {
    const lines = markdown.split('\n');
    const elements: JSX.Element[] = [];
    let inCodeBlock = false;
    let codeLines: string[] = [];
    let listItems: string[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`ul-${elements.length}`}>
            {listItems.map((item, i) => <li key={i}>{renderInline(item)}</li>)}
          </ul>
        );
        listItems = [];
      }
    };

    const renderInline = (text: string): React.ReactNode => {
      const parts: React.ReactNode[] = [];
      let remaining = text;
      let key = 0;

      while (remaining.length > 0) {
        // Bold
        const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
        // Inline code
        const codeMatch = remaining.match(/`(.+?)`/);
        // Link
        const linkMatch = remaining.match(/\[(.+?)\]\((.+?)\)/);
        // Image
        const imgMatch = remaining.match(/!\[(.+?)\]\((.+?)\)/);

        const matches = [
          boldMatch && { type: 'bold', index: boldMatch.index!, match: boldMatch },
          codeMatch && { type: 'code', index: codeMatch.index!, match: codeMatch },
          imgMatch && { type: 'img', index: imgMatch.index!, match: imgMatch },
          linkMatch && { type: 'link', index: linkMatch.index!, match: linkMatch },
        ].filter(Boolean).sort((a, b) => a!.index - b!.index);

        if (matches.length === 0) {
          parts.push(remaining);
          break;
        }

        const first = matches[0]!;
        if (first.index > 0) {
          parts.push(remaining.substring(0, first.index));
        }

        if (first.type === 'bold') {
          parts.push(<strong key={key++}>{first.match[1]}</strong>);
        } else if (first.type === 'code') {
          parts.push(<code key={key++}>{first.match[1]}</code>);
        } else if (first.type === 'img') {
          parts.push(<img key={key++} src={first.match[2]} alt={first.match[1]} />);
        } else if (first.type === 'link') {
          parts.push(<a key={key++} href={first.match[2]} target="_blank" rel="noopener noreferrer">{first.match[1]}</a>);
        }

        remaining = remaining.substring(first.index + first.match[0].length);
      }

      return parts.length === 1 ? parts[0] : parts;
    };

    lines.forEach((line, i) => {
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          flushList();
          inCodeBlock = true;
          codeLines = [];
        } else {
          elements.push(
            <pre key={`pre-${i}`}><code>{codeLines.join('\n')}</code></pre>
          );
          inCodeBlock = false;
          codeLines = [];
        }
        return;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        return;
      }

      if (line.startsWith('- ') || line.startsWith('* ')) {
        listItems.push(line.slice(2));
        return;
      }

      flushList();

      if (line.startsWith('### ')) {
        elements.push(<h3 key={`h-${i}`}>{renderInline(line.slice(4))}</h3>);
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={`h-${i}`}>{renderInline(line.slice(3))}</h2>);
      } else if (line.startsWith('# ')) {
        elements.push(<h1 key={`h-${i}`}>{renderInline(line.slice(2))}</h1>);
      } else if (line.trim() === '') {
        // skip empty lines — natural spacing via margins
      } else {
        elements.push(<p key={`p-${i}`}>{renderInline(line)}</p>);
      }
    });

    flushList();
    return elements;
  };

  if (loading) {
    return <div style={{ padding: 40, color: '#86868b' }}>불러오는 중...</div>;
  }

  const currentContent = langTab === 'ko' ? form.content_ko : form.content_en;

  return (
    <>
      <PageTop>
        <BackBtn $isDark={isDark} onClick={() => navigate('/admin/blog')}>
          <ArrowLeft /> 목록으로
        </BackBtn>
      </PageTop>

      <PageTitle $isDark={isDark} style={{ marginBottom: 24 }}>
        {isEdit ? '블로그 글 수정' : '새 블로그 글'}
      </PageTitle>

      <Card $isDark={isDark}>
        {/* === Meta === */}
        <FormSection $isDark={isDark}>
          <SectionTitle $isDark={isDark}>기본 정보</SectionTitle>
          <FormRow>
            <FormGroup>
              <FormLabel $isDark={isDark}>글 ID (URL slug)</FormLabel>
              <FormInput
                $isDark={isDark}
                value={form.id}
                onChange={e => set('id', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                placeholder="my-blog-post"
                disabled={isEdit}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel $isDark={isDark}>날짜</FormLabel>
              <FormInput $isDark={isDark} type="date" value={form.date} onChange={e => set('date', e.target.value)} />
            </FormGroup>
          </FormRow>

          <TabRow $isDark={isDark}>
            <Tab $isDark={isDark} $active={langTab === 'ko'} onClick={() => setLangTab('ko')}>한국어</Tab>
            <Tab $isDark={isDark} $active={langTab === 'en'} onClick={() => setLangTab('en')}>English</Tab>
          </TabRow>

          <FormGroup>
            <FormLabel $isDark={isDark}>제목 ({langTab.toUpperCase()})</FormLabel>
            <FormInput
              $isDark={isDark}
              value={langTab === 'ko' ? form.title_ko : form.title_en}
              onChange={e => set(langTab === 'ko' ? 'title_ko' : 'title_en', e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <FormLabel $isDark={isDark}>요약 ({langTab.toUpperCase()})</FormLabel>
            <FormTextarea
              $isDark={isDark}
              value={langTab === 'ko' ? form.excerpt_ko : form.excerpt_en}
              onChange={e => set(langTab === 'ko' ? 'excerpt_ko' : 'excerpt_en', e.target.value)}
              style={{ minHeight: 60 }}
            />
          </FormGroup>

          <FormRow>
            <FormGroup>
              <FormLabel $isDark={isDark}>카테고리 ({langTab.toUpperCase()})</FormLabel>
              <FormInput
                $isDark={isDark}
                value={langTab === 'ko' ? form.category_ko : form.category_en}
                onChange={e => set(langTab === 'ko' ? 'category_ko' : 'category_en', e.target.value)}
                placeholder="개발 / Development"
              />
            </FormGroup>
            <FormGroup>
              <FormLabel $isDark={isDark}>읽기 시간 ({langTab.toUpperCase()})</FormLabel>
              <FormInput
                $isDark={isDark}
                value={langTab === 'ko' ? form.read_time_ko : form.read_time_en}
                onChange={e => set(langTab === 'ko' ? 'read_time_ko' : 'read_time_en', e.target.value)}
                placeholder="5분 / 5 min"
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel $isDark={isDark}>상태</FormLabel>
              <FormSelect $isDark={isDark} value={form.status} onChange={e => set('status', e.target.value as 'draft' | 'published')}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </FormSelect>
            </FormGroup>
            <FormGroup />
          </FormRow>

          <TagInput label="태그" tags={form.tags} onChange={v => set('tags', v)} isDark={isDark} placeholder="태그 추가" />
        </FormSection>

        {/* === Content === */}
        <FormSection $isDark={isDark}>
          <SectionTitle $isDark={isDark}>콘텐츠 ({langTab.toUpperCase()})</SectionTitle>
          <Badge $variant="success">마크다운 형식으로 작성</Badge>

          <EditorTabRow $isDark={isDark}>
            <EditorTab $isDark={isDark} $active={editorTab === 'edit'} onClick={() => setEditorTab('edit')}>
              Edit
            </EditorTab>
            <EditorTab $isDark={isDark} $active={editorTab === 'preview'} onClick={() => setEditorTab('preview')}>
              Preview
            </EditorTab>
          </EditorTabRow>

          {editorTab === 'edit' ? (
            <MarkdownEditor
              value={currentContent}
              onChange={v => set(langTab === 'ko' ? 'content_ko' : 'content_en', v)}
              isDark={isDark}
            />
          ) : (
            <PreviewArea $isDark={isDark}>
              {currentContent ? renderPreview(currentContent) : (
                <span style={{ color: '#86868b' }}>미리보기할 내용이 없습니다</span>
              )}
            </PreviewArea>
          )}
        </FormSection>

        {/* === Thumbnail === */}
        <FormSection $isDark={isDark}>
          <SectionTitle $isDark={isDark}>썸네일 이미지</SectionTitle>
          <FileUploadArea $isDark={isDark} $hasFile={!!thumbFile || !!form.thumbnail_url}>
            <Upload />
            <span>{thumbFile ? thumbFile.name : '이미지를 클릭하거나 드래그하세요'}</span>
            <input type="file" accept="image/*" onChange={e => setThumbFile(e.target.files?.[0] ?? null)} />
          </FileUploadArea>
          {(thumbFile || form.thumbnail_url) && (
            <ThumbnailPreview
              src={thumbFile ? URL.createObjectURL(thumbFile) : form.thumbnail_url!}
              alt="Thumbnail preview"
            />
          )}
        </FormSection>

        {/* === Actions === */}
        <FormActions>
          <SecondaryButton $isDark={isDark} onClick={() => navigate('/admin/blog')}>
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

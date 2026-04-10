import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, Trash2, Save, Eye, EyeOff, ExternalLink, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { uploadFile } from '../../lib/uploadFile';
import { useTheme } from '../../contexts/ThemeContext';
import type { DbOpenSourceProject } from '../../lib/types/database';
import TagInput from '../ui/TagInput';
import {
  PageHeader, PageTitle, PageSubtitle,
  Card, FormSection, SectionTitle, FormGroup, FormLabel,
  FormInput, FormTextarea, FormRow,
  PrimaryButton, SecondaryButton, DestructiveButton, GhostButton,
  TabRow, Tab, Badge, EmptyState, Table, FileUploadArea
} from './AdminStyles';

const ActionCell = styled.div`
  display: flex;
  gap: 4px;
  justify-content: flex-end;
`;

const CoverPreview = styled.div<{ $isDark: boolean }>`
  position: relative;
  margin-top: 12px;
  width: 100%;
  max-width: 320px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'};

  img {
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
  }
`;

const ClearImageBtn = styled.button<{ $isDark: boolean }>`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.65);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover { background: rgba(0, 0, 0, 0.85); }

  svg { width: 14px; height: 14px; }
`;

const Thumbnail = styled.img`
  width: 56px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
  background: #f3f3f5;
`;

const DeleteConfirm = styled.div<{ $isDark: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.5);
`;

const DeleteDialog = styled.div<{ $isDark: boolean }>`
  background: ${p => p.$isDark ? '#1a1a1a' : '#ffffff'};
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'};
  border-radius: 16px;
  padding: 32px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DialogTitle = styled.h3<{ $isDark: boolean }>`
  font-size: 18px;
  font-weight: 600;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
`;

const DialogActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`;

const EditPanel = styled.div<{ $isDark: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 9998;
  display: flex;
  justify-content: flex-end;
  background: rgba(0,0,0,0.4);
`;

const EditDrawer = styled.div<{ $isDark: boolean }>`
  width: 600px;
  max-width: 95vw;
  background: ${p => p.$isDark ? '#1a1a1a' : '#ffffff'};
  border-left: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'};
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const DrawerHeader = styled.div<{ $isDark: boolean }>`
  padding: 20px 24px;
  border-bottom: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DrawerTitle = styled.h3<{ $isDark: boolean }>`
  font-size: 18px;
  font-weight: 600;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
`;

const DrawerBody = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const DrawerFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid rgba(128,128,128,0.1);
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const emptyProject: DbOpenSourceProject = {
  id: '',
  name: '',
  description_ko: '', description_en: '',
  full_description_ko: '', full_description_en: '',
  category_ko: '', category_en: '',
  tags: [],
  stat_stars: '0', stat_downloads: '0',
  stat_components: null, stat_contributors: '0',
  link_github: '', link_npm: null, link_demo: null,
  features_ko: [], features_en: [],
  image_url: null,
  year: '',
  is_visible: true,
  sort_order: 0,
};

export default function OpenSourceEditor() {
  const { isDark } = useTheme();
  const [projects, setProjects] = useState<DbOpenSourceProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<DbOpenSourceProject | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [langTab, setLangTab] = useState<'ko' | 'en'>('ko');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    const { data } = await supabase.from('open_source_projects').select('*').order('sort_order');
    setProjects((data as DbOpenSourceProject[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const closeDrawer = () => {
    setEditing(null);
    setImageFile(null);
  };

  const openNew = () => {
    setEditing({ ...emptyProject, id: '', sort_order: projects.length });
    setIsNew(true);
    setImageFile(null);
  };

  const openEdit = (p: DbOpenSourceProject) => {
    setEditing({ ...p });
    setIsNew(false);
    setImageFile(null);
  };

  const setField = <K extends keyof DbOpenSourceProject>(key: K, value: DbOpenSourceProject[K]) => {
    setEditing(prev => prev ? { ...prev, [key]: value } : null);
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.id) { toast.error('ID를 입력해주세요.'); return; }
    if (!editing.name) { toast.error('이름을 입력해주세요.'); return; }

    setSaving(true);
    try {
      // 1. Upload new cover image if selected
      let imageUrl = editing.image_url;
      if (imageFile) {
        const ext = imageFile.name.split('.').pop() ?? 'png';
        imageUrl = await uploadFile(
          'opensource-images',
          `covers/${editing.id}.${ext}`,
          imageFile
        );
      }

      const payload = { ...editing, image_url: imageUrl };

      // 2. Insert or update the row
      if (isNew) {
        const { error } = await supabase.from('open_source_projects').insert(payload);
        if (error) throw error;
        toast.success('프로젝트가 추가되었습니다.');
      } else {
        const { error } = await supabase
          .from('open_source_projects')
          .update(payload)
          .eq('id', editing.id);
        if (error) throw error;
        toast.success('프로젝트가 수정되었습니다.');
      }

      closeDrawer();
      fetchProjects();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Save failed:', err);
      toast.error(`저장 실패: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setField('image_url', null);
  };

  const toggleVisibility = async (p: DbOpenSourceProject) => {
    const { error } = await supabase
      .from('open_source_projects')
      .update({ is_visible: !p.is_visible })
      .eq('id', p.id);
    if (error) {
      toast.error(`상태 변경 실패: ${error.message}`);
      return;
    }
    toast.success(!p.is_visible ? '공개로 변경되었습니다.' : '비공개로 변경되었습니다.');
    fetchProjects();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase
      .from('open_source_projects')
      .delete()
      .eq('id', deleteTarget);
    if (error) {
      toast.error(`삭제 실패: ${error.message}`);
      return;
    }
    toast.success('삭제되었습니다.');
    setDeleteTarget(null);
    fetchProjects();
  };

  return (
    <>
      <PageHeader>
        <div>
          <PageTitle $isDark={isDark}>오픈소스 관리</PageTitle>
          <PageSubtitle>총 {projects.length}개의 프로젝트</PageSubtitle>
        </div>
        <PrimaryButton onClick={openNew}><Plus /> 새 프로젝트</PrimaryButton>
      </PageHeader>

      <Card $isDark={isDark}>
        {loading ? (
          <EmptyState $isDark={isDark}>불러오는 중...</EmptyState>
        ) : projects.length === 0 ? (
          <EmptyState $isDark={isDark}>오픈소스 프로젝트가 없습니다</EmptyState>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <Table $isDark={isDark}>
              <thead>
                <tr>
                  <th style={{ width: 70 }}></th>
                  <th>이름</th>
                  <th>카테고리</th>
                  <th>연도</th>
                  <th>상태</th>
                  <th style={{ width: 120, textAlign: 'right' }}>관리</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(p => (
                  <tr key={p.id}>
                    <td>
                      {p.image_url ? (
                        <Thumbnail src={p.image_url} alt="" />
                      ) : (
                        <Thumbnail as="div" style={{ background: isDark ? '#222' : '#e5e5e7' }} />
                      )}
                    </td>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td><Badge $isDark={isDark}>{p.category_ko}</Badge></td>
                    <td>{p.year}</td>
                    <td>
                      <Badge $variant={p.is_visible ? 'success' : 'warning'}>
                        {p.is_visible ? '공개' : '비공개'}
                      </Badge>
                    </td>
                    <td>
                      <ActionCell>
                        <GhostButton $isDark={isDark} onClick={() => toggleVisibility(p)}>
                          {p.is_visible ? <EyeOff /> : <Eye />}
                        </GhostButton>
                        <GhostButton $isDark={isDark} onClick={() => openEdit(p)}>
                          <ExternalLink />
                        </GhostButton>
                        <GhostButton $isDark={isDark} onClick={() => setDeleteTarget(p.id)} style={{ color: '#d4183d' }}>
                          <Trash2 />
                        </GhostButton>
                      </ActionCell>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card>

      {/* Edit Drawer */}
      {editing && (
        <EditPanel $isDark={isDark} onClick={closeDrawer}>
          <EditDrawer $isDark={isDark} onClick={e => e.stopPropagation()}>
            <DrawerHeader $isDark={isDark}>
              <DrawerTitle $isDark={isDark}>{isNew ? '새 프로젝트' : editing.name}</DrawerTitle>
              <SecondaryButton $isDark={isDark} onClick={closeDrawer}>닫기</SecondaryButton>
            </DrawerHeader>
            <DrawerBody>
              <FormSection $isDark={isDark}>
                <FormRow>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>ID (slug)</FormLabel>
                    <FormInput $isDark={isDark} value={editing.id}
                      onChange={e => setField('id', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                      disabled={!isNew} />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>이름</FormLabel>
                    <FormInput $isDark={isDark} value={editing.name} onChange={e => setField('name', e.target.value)} />
                  </FormGroup>
                </FormRow>
                <FormRow>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>연도</FormLabel>
                    <FormInput $isDark={isDark} value={editing.year} onChange={e => setField('year', e.target.value)} />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>정렬 순서</FormLabel>
                    <FormInput $isDark={isDark} type="number" value={editing.sort_order}
                      onChange={e => setField('sort_order', Number(e.target.value))} />
                  </FormGroup>
                </FormRow>
              </FormSection>

              <FormSection $isDark={isDark}>
                <TabRow $isDark={isDark}>
                  <Tab $isDark={isDark} $active={langTab === 'ko'} onClick={() => setLangTab('ko')}>한국어</Tab>
                  <Tab $isDark={isDark} $active={langTab === 'en'} onClick={() => setLangTab('en')}>English</Tab>
                </TabRow>
                <FormGroup>
                  <FormLabel $isDark={isDark}>설명 ({langTab.toUpperCase()})</FormLabel>
                  <FormTextarea $isDark={isDark}
                    value={langTab === 'ko' ? editing.description_ko : editing.description_en}
                    onChange={e => setField(langTab === 'ko' ? 'description_ko' : 'description_en', e.target.value)}
                    style={{ minHeight: 80 }} />
                </FormGroup>
                <FormGroup>
                  <FormLabel $isDark={isDark}>상세 설명 ({langTab.toUpperCase()})</FormLabel>
                  <FormTextarea $isDark={isDark}
                    value={langTab === 'ko' ? editing.full_description_ko : editing.full_description_en}
                    onChange={e => setField(langTab === 'ko' ? 'full_description_ko' : 'full_description_en', e.target.value)}
                    style={{ minHeight: 120 }} />
                </FormGroup>
                <FormGroup>
                  <FormLabel $isDark={isDark}>카테고리 ({langTab.toUpperCase()})</FormLabel>
                  <FormInput $isDark={isDark}
                    value={langTab === 'ko' ? editing.category_ko : editing.category_en}
                    onChange={e => setField(langTab === 'ko' ? 'category_ko' : 'category_en', e.target.value)} />
                </FormGroup>
              </FormSection>

              <FormSection $isDark={isDark}>
                <SectionTitle $isDark={isDark}>링크</SectionTitle>
                <FormGroup>
                  <FormLabel $isDark={isDark}>GitHub</FormLabel>
                  <FormInput $isDark={isDark} value={editing.link_github} onChange={e => setField('link_github', e.target.value)} />
                </FormGroup>
                <FormRow>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>npm</FormLabel>
                    <FormInput $isDark={isDark} value={editing.link_npm ?? ''} onChange={e => setField('link_npm', e.target.value || null)} />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>Demo</FormLabel>
                    <FormInput $isDark={isDark} value={editing.link_demo ?? ''} onChange={e => setField('link_demo', e.target.value || null)} />
                  </FormGroup>
                </FormRow>
              </FormSection>

              <FormSection $isDark={isDark}>
                <SectionTitle $isDark={isDark}>통계</SectionTitle>
                <FormRow>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>Stars</FormLabel>
                    <FormInput $isDark={isDark} value={editing.stat_stars} onChange={e => setField('stat_stars', e.target.value)} />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>Downloads</FormLabel>
                    <FormInput $isDark={isDark} value={editing.stat_downloads} onChange={e => setField('stat_downloads', e.target.value)} />
                  </FormGroup>
                </FormRow>
                <FormRow>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>Contributors</FormLabel>
                    <FormInput $isDark={isDark} value={editing.stat_contributors} onChange={e => setField('stat_contributors', e.target.value)} />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>Components</FormLabel>
                    <FormInput $isDark={isDark} value={editing.stat_components ?? ''} onChange={e => setField('stat_components', e.target.value || null)} />
                  </FormGroup>
                </FormRow>
              </FormSection>

              <FormSection $isDark={isDark}>
                <TagInput label="태그" tags={editing.tags} onChange={v => setField('tags', v)} isDark={isDark} />
              </FormSection>

              <FormSection $isDark={isDark}>
                <SectionTitle $isDark={isDark}>커버 이미지</SectionTitle>
                <FileUploadArea $isDark={isDark} $hasFile={!!imageFile || !!editing.image_url}>
                  <Upload />
                  <span>{imageFile ? imageFile.name : '이미지를 클릭하거나 드래그하세요'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setImageFile(e.target.files?.[0] ?? null)}
                  />
                </FileUploadArea>
                {(imageFile || editing.image_url) && (
                  <CoverPreview $isDark={isDark}>
                    <img
                      src={imageFile ? URL.createObjectURL(imageFile) : editing.image_url!}
                      alt="Cover preview"
                    />
                    <ClearImageBtn
                      type="button"
                      $isDark={isDark}
                      onClick={clearImage}
                      title="이미지 제거"
                    >
                      <X />
                    </ClearImageBtn>
                  </CoverPreview>
                )}
              </FormSection>
            </DrawerBody>
            <DrawerFooter>
              <SecondaryButton $isDark={isDark} onClick={closeDrawer}>취소</SecondaryButton>
              <PrimaryButton onClick={handleSave} disabled={saving || !editing.id || !editing.name}>
                <Save /> {saving ? '저장 중...' : '저장'}
              </PrimaryButton>
            </DrawerFooter>
          </EditDrawer>
        </EditPanel>
      )}

      {deleteTarget && (
        <DeleteConfirm $isDark={isDark} onClick={() => setDeleteTarget(null)}>
          <DeleteDialog $isDark={isDark} onClick={e => e.stopPropagation()}>
            <DialogTitle $isDark={isDark}>프로젝트 삭제</DialogTitle>
            <DialogActions>
              <DestructiveButton onClick={handleDelete}>삭제</DestructiveButton>
              <PrimaryButton onClick={() => setDeleteTarget(null)}>취소</PrimaryButton>
            </DialogActions>
          </DeleteDialog>
        </DeleteConfirm>
      )}
    </>
  );
}

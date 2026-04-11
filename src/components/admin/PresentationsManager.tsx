import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, Trash2, Save, Upload, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { uploadFile } from '../../lib/uploadFile';
import { compressPdf } from '../../lib/compressPdf';
import { useTheme } from '../../contexts/ThemeContext';
import type { DbPresentation } from '../../lib/types/database';
import {
  PageHeader, PageTitle, PageSubtitle,
  Card, FormSection, SectionTitle, FormGroup, FormLabel,
  FormInput, FormTextarea, FormRow,
  PrimaryButton, SecondaryButton, DestructiveButton, GhostButton,
  Badge, EmptyState, Table, FileUploadArea,
  ToggleWrapper, ToggleSwitch, ToggleLabel
} from './AdminStyles';

const ActionCell = styled.div`
  display: flex;
  gap: 4px;
  justify-content: flex-end;
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
  width: 560px;
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

const ThumbnailPreview = styled.img`
  width: 100%;
  max-width: 200px;
  border-radius: 8px;
  object-fit: cover;
  margin-top: 8px;
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

const emptyPresentation: Omit<DbPresentation, 'created_at'> = {
  id: crypto.randomUUID(),
  title_ko: '', title_en: '',
  description_ko: null, description_en: null,
  category_tag: null,
  file_url: '',
  thumbnail_url: null,
  date: new Date().toISOString().split('T')[0],
  is_public: true,
  sort_order: 0,
};

export default function PresentationsManager() {
  const { isDark } = useTheme();
  const [presentations, setPresentations] = useState<DbPresentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Omit<DbPresentation, 'created_at'> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');  // 압축 중 / 업로드 중 등
  const [saveError, setSaveError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const fetchPresentations = async () => {
    setLoading(true);
    const { data } = await supabase.from('presentations').select('*').order('sort_order');
    setPresentations((data as DbPresentation[]) ?? []);
    setLoading(false);
  };

  // PT자료 관리에 들어오면 nav 메뉴 자동 활성화
  const enableNavItem = async () => {
    await supabase.from('site_settings').upsert(
      { key: 'nav_presentations', value: 'true' },
      { onConflict: 'key' }
    );
  };

  useEffect(() => {
    fetchPresentations();
    enableNavItem();
  }, []);

  const openNew = () => {
    setEditing({ ...emptyPresentation, id: crypto.randomUUID(), sort_order: presentations.length });
    setIsNew(true);
    setPdfFile(null);
    setThumbFile(null);
  };

  const openEdit = (p: DbPresentation) => {
    setEditing({ ...p });
    setIsNew(false);
    setPdfFile(null);
    setThumbFile(null);
  };

  const setField = <K extends keyof typeof emptyPresentation>(key: K, value: (typeof emptyPresentation)[K]) => {
    setEditing(prev => prev ? { ...prev, [key]: value } : null);
  };

  const handleSave = async () => {
    if (!editing || !editing.title_ko) return;
    setSaving(true);
    setSaveError('');
    setSaveStatus('');
    try {
      let fileUrl = editing.file_url;
      if (pdfFile) {
        // 1) 압축
        setSaveStatus('🗜️ PDF 압축 중...');
        const compressed = await compressPdf(pdfFile);
        const originalMB = (pdfFile.size / 1024 / 1024).toFixed(1);
        const compressedMB = (compressed.size / 1024 / 1024).toFixed(1);
        console.log(`PDF 압축: ${originalMB}MB → ${compressedMB}MB`);

        // 2) 업로드
        setSaveStatus(`⬆️ 업로드 중... (${compressedMB}MB)`);
        fileUrl = await uploadFile('presentations', `${editing.id}.pdf`, compressed);
        setSaveStatus('');
      }

      if (isNew && !fileUrl) {
        setSaveError('PDF 파일을 업로드해주세요.');
        setSaving(false);
        return;
      }

      let thumbUrl = editing.thumbnail_url;
      if (thumbFile) {
        const ext = thumbFile.name.split('.').pop();
        thumbUrl = await uploadFile('presentations', `thumb-${editing.id}.${ext}`, thumbFile);
      }

      const payload = { ...editing, file_url: fileUrl, thumbnail_url: thumbUrl };

      if (isNew) {
        const { error } = await supabase.from('presentations').insert({ ...payload, created_at: new Date().toISOString() });
        if (error) throw error;
      } else {
        const { error } = await supabase.from('presentations').update(payload).eq('id', editing.id);
        if (error) throw error;
      }

      setEditing(null);
      fetchPresentations();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSaveError(`저장 실패: ${msg}`);
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const toggleVisibility = async (p: DbPresentation) => {
    await supabase.from('presentations').update({ is_public: !p.is_public }).eq('id', p.id);
    fetchPresentations();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await supabase.from('presentations').delete().eq('id', deleteTarget);
    setDeleteTarget(null);
    fetchPresentations();
  };

  return (
    <>
      <PageHeader>
        <div>
          <PageTitle $isDark={isDark}>PT 자료 관리</PageTitle>
          <PageSubtitle>총 {presentations.length}개</PageSubtitle>
        </div>
        <PrimaryButton onClick={openNew}><Plus /> 새 PT 자료</PrimaryButton>
      </PageHeader>

      <Card $isDark={isDark}>
        {loading ? (
          <EmptyState $isDark={isDark}>불러오는 중...</EmptyState>
        ) : presentations.length === 0 ? (
          <EmptyState $isDark={isDark}>PT 자료가 없습니다</EmptyState>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <Table $isDark={isDark}>
              <thead>
                <tr>
                  <th>제목</th>
                  <th>카테고리</th>
                  <th>날짜</th>
                  <th>상태</th>
                  <th style={{ width: 120, textAlign: 'right' }}>관리</th>
                </tr>
              </thead>
              <tbody>
                {presentations.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600 }}>{p.title_ko}</td>
                    <td><Badge $isDark={isDark}>{p.category_tag || '-'}</Badge></td>
                    <td style={{ fontSize: 13, color: '#86868b' }}>{p.date}</td>
                    <td>
                      <Badge $variant={p.is_public ? 'success' : 'warning'}>
                        {p.is_public ? '공개' : '비공개'}
                      </Badge>
                    </td>
                    <td>
                      <ActionCell>
                        <GhostButton $isDark={isDark} onClick={() => toggleVisibility(p)}>
                          {p.is_public ? <EyeOff /> : <Eye />}
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
        <EditPanel $isDark={isDark} onClick={() => setEditing(null)}>
          <EditDrawer $isDark={isDark} onClick={e => e.stopPropagation()}>
            <DrawerHeader $isDark={isDark}>
              <DrawerTitle $isDark={isDark}>{isNew ? '새 PT 자료' : '수정'}</DrawerTitle>
              <SecondaryButton $isDark={isDark} onClick={() => setEditing(null)}>닫기</SecondaryButton>
            </DrawerHeader>
            <DrawerBody>
              <FormSection $isDark={isDark}>
                <FormRow>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>제목 (KO)</FormLabel>
                    <FormInput $isDark={isDark} value={editing.title_ko} onChange={e => setField('title_ko', e.target.value)} />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>제목 (EN)</FormLabel>
                    <FormInput $isDark={isDark} value={editing.title_en} onChange={e => setField('title_en', e.target.value)} />
                  </FormGroup>
                </FormRow>
                <FormGroup>
                  <FormLabel $isDark={isDark}>설명 (KO)</FormLabel>
                  <FormTextarea $isDark={isDark} value={editing.description_ko ?? ''}
                    onChange={e => setField('description_ko', e.target.value || null)} style={{ minHeight: 60 }} />
                </FormGroup>
                <FormGroup>
                  <FormLabel $isDark={isDark}>설명 (EN)</FormLabel>
                  <FormTextarea $isDark={isDark} value={editing.description_en ?? ''}
                    onChange={e => setField('description_en', e.target.value || null)} style={{ minHeight: 60 }} />
                </FormGroup>
                <FormRow>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>카테고리 태그</FormLabel>
                    <FormInput $isDark={isDark} value={editing.category_tag ?? ''}
                      onChange={e => setField('category_tag', e.target.value || null)} placeholder="Design, Tech..." />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>날짜</FormLabel>
                    <FormInput $isDark={isDark} type="date" value={editing.date} onChange={e => setField('date', e.target.value)} />
                  </FormGroup>
                </FormRow>
                <FormRow>
                  <FormGroup>
                    <FormLabel $isDark={isDark}>정렬 순서</FormLabel>
                    <FormInput $isDark={isDark} type="number" value={editing.sort_order}
                      onChange={e => setField('sort_order', Number(e.target.value))} />
                  </FormGroup>
                  <FormGroup>
                    <ToggleWrapper onClick={() => setField('is_public', !editing.is_public)}>
                      <ToggleSwitch $on={editing.is_public} />
                      <ToggleLabel $isDark={isDark}>공개</ToggleLabel>
                    </ToggleWrapper>
                  </FormGroup>
                </FormRow>
              </FormSection>

              <FormSection $isDark={isDark}>
                <SectionTitle $isDark={isDark}>PDF 파일</SectionTitle>
                <FileUploadArea $isDark={isDark} $hasFile={!!pdfFile || !!editing.file_url}>
                  <Upload />
                  <span>{pdfFile ? pdfFile.name : editing.file_url ? '파일 업로드됨 (변경하려면 클릭)' : 'PDF 파일 업로드'}</span>
                  <input type="file" accept=".pdf" onChange={e => setPdfFile(e.target.files?.[0] ?? null)} />
                </FileUploadArea>
              </FormSection>

              <FormSection $isDark={isDark}>
                <SectionTitle $isDark={isDark}>썸네일</SectionTitle>
                <FileUploadArea $isDark={isDark} $hasFile={!!thumbFile || !!editing.thumbnail_url}>
                  <Upload />
                  <span>{thumbFile ? thumbFile.name : '썸네일 이미지 업로드'}</span>
                  <input type="file" accept="image/*" onChange={e => setThumbFile(e.target.files?.[0] ?? null)} />
                </FileUploadArea>
                {(thumbFile || editing.thumbnail_url) && (
                  <ThumbnailPreview
                    src={thumbFile ? URL.createObjectURL(thumbFile) : editing.thumbnail_url!}
                    alt="Thumbnail preview"
                  />
                )}
              </FormSection>
            </DrawerBody>
            <DrawerFooter>
              {saveError && (
                <span style={{ fontSize: 12, color: '#d4183d', flex: 1 }}>{saveError}</span>
              )}
              {saveStatus && !saveError && (
                <span style={{ fontSize: 12, color: '#86868b', flex: 1 }}>{saveStatus}</span>
              )}
              <SecondaryButton $isDark={isDark} onClick={() => setEditing(null)}>취소</SecondaryButton>
              <PrimaryButton onClick={handleSave} disabled={saving || !editing.title_ko}>
                <Save /> {saving ? (saveStatus ? '처리 중...' : '저장 중...') : '저장'}
              </PrimaryButton>
            </DrawerFooter>
          </EditDrawer>
        </EditPanel>
      )}

      {deleteTarget && (
        <DeleteConfirm $isDark={isDark} onClick={() => setDeleteTarget(null)}>
          <DeleteDialog $isDark={isDark} onClick={e => e.stopPropagation()}>
            <DialogTitle $isDark={isDark}>PT 자료 삭제</DialogTitle>
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

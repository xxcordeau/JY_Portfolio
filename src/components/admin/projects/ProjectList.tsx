import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Plus, Pencil, Trash2, Search, Star, GripVertical } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useTheme } from '../../../contexts/ThemeContext';
import type { DbProject } from '../../../lib/types/database';
import {
  PageHeader, PageTitle, PageSubtitle,
  Card, PrimaryButton, DestructiveButton, GhostButton,
  Table, Badge, EmptyState, SearchInput
} from '../AdminStyles';

const HeaderLeft = styled.div``;

const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
`;

const Thumbnail = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
  background: #f3f3f5;
`;

const TitleCell = styled.div<{ $isDark: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 2px;

  strong {
    font-size: 14px;
    font-weight: 600;
    color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  }

  span {
    font-size: 12px;
    color: #86868b;
  }
`;

const TagList = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
`;

const MiniTag = styled.span<{ $isDark: boolean }>`
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 500;
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'};
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'};
  border-radius: 4px;
`;

const ActionCell = styled.div`
  display: flex;
  gap: 4px;
  justify-content: flex-end;
`;

const FeaturedStar = styled.span<{ $featured: boolean }>`
  color: ${p => p.$featured ? '#f59e0b' : 'rgba(128,128,128,0.3)'};
  svg { width: 14px; height: 14px; }
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

const DialogText = styled.p`
  font-size: 14px;
  color: #86868b;
`;

const DialogActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 8px;
`;

export default function ProjectList() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<DbProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true });
    setProjects((data as DbProject[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const filtered = projects.filter(p =>
    p.title_ko.toLowerCase().includes(search.toLowerCase()) ||
    p.title_en.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await supabase.from('projects').delete().eq('id', deleteTarget);
    setDeleteTarget(null);
    fetchProjects();
  };

  return (
    <>
      <PageHeader>
        <HeaderLeft>
          <PageTitle $isDark={isDark}>프로젝트 관리</PageTitle>
          <PageSubtitle>총 {projects.length}개의 프로젝트</PageSubtitle>
        </HeaderLeft>
        <PrimaryButton onClick={() => navigate('/admin/projects/new')}>
          <Plus /> 새 프로젝트
        </PrimaryButton>
      </PageHeader>

      <Card $isDark={isDark}>
        <FilterBar style={{ borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}>
          <SearchInput $isDark={isDark} style={{ flex: 1, maxWidth: 320 }}>
            <Search />
            <input
              placeholder="프로젝트 검색..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </SearchInput>
        </FilterBar>

        {loading ? (
          <EmptyState $isDark={isDark}>불러오는 중...</EmptyState>
        ) : filtered.length === 0 ? (
          <EmptyState $isDark={isDark}>
            {search ? '검색 결과가 없습니다' : '프로젝트가 없습니다'}
          </EmptyState>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <Table $isDark={isDark}>
              <thead>
                <tr>
                  <th style={{ width: 40 }}></th>
                  <th style={{ width: 60 }}></th>
                  <th>프로젝트</th>
                  <th>태그</th>
                  <th style={{ width: 60 }}>연도</th>
                  <th style={{ width: 80 }}>상태</th>
                  <th style={{ width: 100, textAlign: 'right' }}>관리</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(project => (
                  <tr key={project.id}>
                    <td>
                      <GripVertical size={14} style={{ color: '#86868b', opacity: 0.4 }} />
                    </td>
                    <td>
                      {project.cover_image_url ? (
                        <Thumbnail src={project.cover_image_url} alt="" />
                      ) : (
                        <Thumbnail as="div" style={{ background: isDark ? '#222' : '#e5e5e7' }} />
                      )}
                    </td>
                    <td>
                      <TitleCell $isDark={isDark}>
                        <strong>{project.title_ko}</strong>
                        <span>{project.role_ko}</span>
                      </TitleCell>
                    </td>
                    <td>
                      <TagList>
                        {project.tags.slice(0, 3).map(tag => (
                          <MiniTag key={tag} $isDark={isDark}>{tag}</MiniTag>
                        ))}
                        {project.tags.length > 3 && (
                          <MiniTag $isDark={isDark}>+{project.tags.length - 3}</MiniTag>
                        )}
                      </TagList>
                    </td>
                    <td>{project.year}</td>
                    <td>
                      <FeaturedStar $featured={project.is_featured}>
                        <Star fill={project.is_featured ? '#f59e0b' : 'none'} />
                      </FeaturedStar>
                      {project.is_featured && (
                        <Badge $variant="success" style={{ marginLeft: 6 }}>Featured</Badge>
                      )}
                    </td>
                    <td>
                      <ActionCell>
                        <GhostButton $isDark={isDark} onClick={() => navigate(`/admin/projects/${project.id}`)}>
                          <Pencil />
                        </GhostButton>
                        <GhostButton $isDark={isDark} onClick={() => setDeleteTarget(project.id)} style={{ color: '#d4183d' }}>
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

      {deleteTarget && (
        <DeleteConfirm $isDark={isDark} onClick={() => setDeleteTarget(null)}>
          <DeleteDialog $isDark={isDark} onClick={e => e.stopPropagation()}>
            <DialogTitle $isDark={isDark}>프로젝트 삭제</DialogTitle>
            <DialogText>이 프로젝트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</DialogText>
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

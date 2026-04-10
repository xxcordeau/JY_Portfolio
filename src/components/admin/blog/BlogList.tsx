import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Plus, Pencil, Trash2, Search, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../../lib/supabase';
import { useTheme } from '../../../contexts/ThemeContext';
import type { DbBlogPost } from '../../../lib/types/database';
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

const FilterBtn = styled.button<{ $isDark: boolean; $active: boolean }>`
  height: 32px;
  padding: 0 14px;
  font-size: 13px;
  font-weight: ${p => p.$active ? '600' : '500'};
  border-radius: 8px;
  border: 1px solid ${p => p.$active ? '#0c8ce9' : p.$isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
  background: ${p => p.$active ? 'rgba(12,140,233,0.1)' : 'transparent'};
  color: ${p => p.$active ? '#0c8ce9' : p.$isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)'};
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s ease;

  &:hover { border-color: #0c8ce9; color: #0c8ce9; }
`;

const Thumbnail = styled.img`
  width: 56px;
  height: 40px;
  border-radius: 6px;
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
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
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

export default function BlogList() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<DbBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .order('date', { ascending: false });
    setPosts((data as DbBlogPost[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const filtered = posts.filter(p => {
    const matchSearch = p.title_ko.toLowerCase().includes(search.toLowerCase()) ||
      p.title_en.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from('blog_posts').delete().eq('id', deleteTarget);
    if (error) {
      console.error('Delete failed:', error);
      toast.error(`삭제 실패: ${error.message}`);
      return;
    }
    toast.success('삭제되었습니다.');
    setDeleteTarget(null);
    fetchPosts();
  };

  const toggleStatus = async (post: DbBlogPost) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    const { error } = await supabase
      .from('blog_posts')
      .update({ status: newStatus })
      .eq('id', post.id);
    if (error) {
      console.error('Status update failed:', error);
      toast.error(`상태 변경 실패: ${error.message}`);
      return;
    }
    toast.success(newStatus === 'published' ? 'Published 처리되었습니다.' : 'Draft로 변경되었습니다.');
    fetchPosts();
  };

  return (
    <>
      <PageHeader>
        <HeaderLeft>
          <PageTitle $isDark={isDark}>블로그 관리</PageTitle>
          <PageSubtitle>
            총 {posts.length}개 · Published {posts.filter(p => p.status === 'published').length}개
          </PageSubtitle>
        </HeaderLeft>
        <PrimaryButton onClick={() => navigate('/admin/blog/new')}>
          <Plus /> 새 글 작성
        </PrimaryButton>
      </PageHeader>

      <Card $isDark={isDark}>
        <FilterBar style={{ borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}>
          <SearchInput $isDark={isDark} style={{ flex: 1, maxWidth: 320 }}>
            <Search />
            <input
              placeholder="블로그 검색..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </SearchInput>
          <FilterBtn $isDark={isDark} $active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>
            전체
          </FilterBtn>
          <FilterBtn $isDark={isDark} $active={statusFilter === 'published'} onClick={() => setStatusFilter('published')}>
            Published
          </FilterBtn>
          <FilterBtn $isDark={isDark} $active={statusFilter === 'draft'} onClick={() => setStatusFilter('draft')}>
            Draft
          </FilterBtn>
        </FilterBar>

        {loading ? (
          <EmptyState $isDark={isDark}>불러오는 중...</EmptyState>
        ) : filtered.length === 0 ? (
          <EmptyState $isDark={isDark}>
            {search || statusFilter !== 'all' ? '검색 결과가 없습니다' : '블로그 글이 없습니다'}
          </EmptyState>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <Table $isDark={isDark}>
              <thead>
                <tr>
                  <th style={{ width: 70 }}></th>
                  <th>제목</th>
                  <th>카테고리</th>
                  <th>태그</th>
                  <th style={{ width: 90 }}>날짜</th>
                  <th style={{ width: 90 }}>상태</th>
                  <th style={{ width: 100, textAlign: 'right' }}>관리</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(post => (
                  <tr key={post.id}>
                    <td>
                      {post.thumbnail_url ? (
                        <Thumbnail src={post.thumbnail_url} alt="" />
                      ) : (
                        <Thumbnail as="div" style={{ background: isDark ? '#222' : '#e5e5e7' }} />
                      )}
                    </td>
                    <td>
                      <TitleCell $isDark={isDark}>
                        <strong>{post.title_ko}</strong>
                        <span>{post.excerpt_ko}</span>
                      </TitleCell>
                    </td>
                    <td>
                      <Badge $isDark={isDark}>{post.category_ko}</Badge>
                    </td>
                    <td>
                      <TagList>
                        {post.tags.slice(0, 2).map(tag => (
                          <MiniTag key={tag} $isDark={isDark}>{tag}</MiniTag>
                        ))}
                        {post.tags.length > 2 && (
                          <MiniTag $isDark={isDark}>+{post.tags.length - 2}</MiniTag>
                        )}
                      </TagList>
                    </td>
                    <td style={{ fontSize: 13, color: '#86868b' }}>{post.date}</td>
                    <td>
                      <Badge $variant={post.status === 'published' ? 'success' : 'warning'}>
                        {post.status === 'published' ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td>
                      <ActionCell>
                        <GhostButton $isDark={isDark} onClick={() => toggleStatus(post)}
                          title={post.status === 'published' ? 'Draft로 변경' : 'Publish'}>
                          {post.status === 'published' ? <EyeOff /> : <Eye />}
                        </GhostButton>
                        <GhostButton $isDark={isDark} onClick={() => navigate(`/admin/blog/${post.id}`)}>
                          <Pencil />
                        </GhostButton>
                        <GhostButton $isDark={isDark} onClick={() => setDeleteTarget(post.id)} style={{ color: '#d4183d' }}>
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
            <DialogTitle $isDark={isDark}>블로그 글 삭제</DialogTitle>
            <DialogText>이 글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</DialogText>
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

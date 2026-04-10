import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { DbBlogPost } from '../lib/types/database';
import { blogPosts as localBlogPosts, type BlogPost } from '../data/blogData';

// Map blog ID to component name for rendering
const componentMap: Record<string, string> = {
  'common-utils-composable': 'CommonUtilsPost',
  'dashboard-widget-system': 'DashboardWidgetPost',
  'view-state-standardization': 'ViewStatePost',
  'role-permission-system': 'RolePermissionPost',
  'table-component-structuring': 'TableComponentPost',
  'filter-system-implementation': 'FilterSystemPost',
  'tree-structure-management': 'TreeManagementPost',
  'icon-system-implementation': 'IconSystemPost',
  'react-page-refactoring': 'ReactPageRefactoringPost',
  'dynamic-static-import': 'DynamicStaticImportPost',
  'css-print-layer-conflict': 'CssPrintLayerPost',
  'hidden-div-react-rendering': 'HiddenDivPost',
  'api-mismatch-usememo-crash': 'ApiMismatchMemoPost',
};

function toBlogPost(row: DbBlogPost): BlogPost {
  // Find matching local post for component name
  const localPost = localBlogPosts.find(p => p.id === row.id);
  return {
    id: row.id,
    title: { ko: row.title_ko, en: row.title_en },
    excerpt: { ko: row.excerpt_ko, en: row.excerpt_en },
    category: { ko: row.category_ko, en: row.category_en },
    date: row.date,
    readTime: { ko: row.read_time_ko, en: row.read_time_en },
    tags: row.tags,
    thumbnail: row.thumbnail_url ?? localPost?.thumbnail ?? '',
    component: localPost?.component ?? componentMap[row.id] ?? row.id,
  };
}

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('blog_posts').select('*')
      .eq('status', 'published')
      .order('date', { ascending: false })
      .then(({ data, error }) => {
        if (data && data.length > 0 && !error) {
          const remotePosts = (data as DbBlogPost[]).map(toBlogPost);
          // Merge: use remote data but ensure local-only posts are included
          const remoteIds = new Set(remotePosts.map(p => p.id));
          const localOnly = localBlogPosts.filter(p => !remoteIds.has(p.id));
          const merged = [...remotePosts, ...localOnly]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setPosts(merged);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return { posts, loading };
}

/** Fetch a single blog post's full content */
export function useBlogPost(id: string) {
  const [post, setPost] = useState<DbBlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('blog_posts').select('*').eq('id', id).single()
      .then(({ data }) => {
        setPost(data as DbBlogPost | null);
        setLoading(false);
      });
  }, [id]);

  return { post, loading };
}

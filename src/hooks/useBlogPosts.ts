import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { DbBlogPost } from '../lib/types/database';
import { blogPosts as localBlogPosts, type BlogPost } from '../data/blogData';

function toBlogPost(row: DbBlogPost): BlogPost {
  return {
    id: row.id,
    title: { ko: row.title_ko, en: row.title_en },
    excerpt: { ko: row.excerpt_ko, en: row.excerpt_en },
    category: { ko: row.category_ko, en: row.category_en },
    date: row.date,
    readTime: { ko: row.read_time_ko, en: row.read_time_en },
    tags: row.tags,
    thumbnail: row.thumbnail_url ?? '',
    component: row.component ?? row.id,
  };
}

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>(localBlogPosts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('blog_posts').select('*')
      .eq('status', 'published')
      .order('date', { ascending: false })
      .then(({ data, error }) => {
        if (data && data.length > 0 && !error) {
          setPosts((data as DbBlogPost[]).map(toBlogPost));
        }
        // If Supabase fails or returns empty, keep local data
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

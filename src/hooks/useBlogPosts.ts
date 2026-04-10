import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { DbBlogPost } from '../lib/types/database';

export interface BlogPost {
  id: string;
  title: { ko: string; en: string };
  excerpt: { ko: string; en: string };
  category: { ko: string; en: string };
  date: string;
  readTime: { ko: string; en: string };
  tags: string[];
  thumbnail: string;
}

function toBlogPost(row: DbBlogPost): BlogPost {
  return {
    id: row.id,
    title: { ko: row.title_ko, en: row.title_en },
    excerpt: { ko: row.excerpt_ko, en: row.excerpt_en },
    category: { ko: row.category_ko, en: row.category_en },
    date: row.date,
    readTime: { ko: row.read_time_ko, en: row.read_time_en },
    tags: row.tags ?? [],
    thumbnail: row.thumbnail_url ?? '',
  };
}

/**
 * Supabase is the single source of truth.
 * No local data fallback — empty DB means empty UI (the correct behavior).
 */
export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('date', { ascending: false })
      .then(({ data, error: err }) => {
        if (cancelled) return;
        if (err) {
          console.error('[useBlogPosts]', err);
          setError(err.message);
          setPosts([]);
        } else {
          setPosts((data as DbBlogPost[] | null ?? []).map(toBlogPost));
        }
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { posts, loading, error };
}

/** Fetch a single blog post's full content */
export function useBlogPost(id: string) {
  const [post, setPost] = useState<DbBlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error: err }) => {
        if (cancelled) return;
        if (err) {
          console.error('[useBlogPost]', err);
          setError(err.message);
          setPost(null);
        } else {
          setPost(data as DbBlogPost | null);
        }
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { post, loading, error };
}

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { DbProject } from '../lib/types/database';
import type { Project } from '../data/projectsData';

function ensureHttps(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

function toProject(row: DbProject): Project {
  const frontend = row.tech_frontend ?? [];
  const backend = row.tech_backend ?? [];
  const design = row.tech_design ?? [];
  const others = row.tech_others ?? [];
  return {
    id: row.id,
    title: { ko: row.title_ko, en: row.title_en },
    description: { ko: row.description_ko, en: row.description_en },
    fullDescription: { ko: row.full_description_ko, en: row.full_description_en },
    tags: row.tags ?? [],
    image: row.cover_image_url ?? '',
    year: row.year,
    role: { ko: row.role_ko, en: row.role_en },
    highlights: { ko: row.highlights_ko ?? [], en: row.highlights_en ?? [] },
    techStack: {
      frontend: frontend.length > 0 ? frontend : undefined,
      backend: backend.length > 0 ? backend : undefined,
      design: design.length > 0 ? design : undefined,
      others: others.length > 0 ? others : undefined,
    },
    links: {
      github: ensureHttps(row.link_github ?? undefined),
      demo: ensureHttps(row.link_demo ?? undefined),
      website: ensureHttps(row.link_website ?? undefined),
    },
  };
}

/**
 * Supabase is the single source of truth.
 * No local data fallback — surface errors visibly instead.
 */
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('projects')
      .select('*')
      .order('sort_order')
      .then(({ data, error: err }) => {
        if (cancelled) return;
        if (err) {
          console.error('[useProjects]', err);
          setError(err.message);
          setProjects([]);
        } else {
          setProjects((data as DbProject[] | null ?? []).map(toProject));
        }
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { projects, loading, error };
}

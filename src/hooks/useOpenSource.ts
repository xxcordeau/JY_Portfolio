import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { DbOpenSourceProject } from '../lib/types/database';
import type { OpenSourceProject } from '../data/types';

function toOpenSource(row: DbOpenSourceProject): OpenSourceProject {
  return {
    id: row.id,
    name: row.name,
    description: { ko: row.description_ko, en: row.description_en },
    fullDescription: { ko: row.full_description_ko, en: row.full_description_en },
    category: { ko: row.category_ko, en: row.category_en },
    tags: row.tags ?? [],
    stats: {
      stars: row.stat_stars,
      downloads: row.stat_downloads,
      components: row.stat_components ?? undefined,
      contributors: row.stat_contributors,
    },
    links: {
      github: row.link_github,
      npm: row.link_npm ?? undefined,
      demo: row.link_demo ?? undefined,
    },
    features: { ko: row.features_ko ?? [], en: row.features_en ?? [] },
    image: row.image_url ?? '',
    year: row.year,
  };
}

/**
 * Supabase is the single source of truth.
 * No local data fallback — surface errors visibly instead.
 */
export function useOpenSource() {
  const [projects, setProjects] = useState<OpenSourceProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('open_source_projects')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order')
      .then(({ data, error: err }) => {
        if (cancelled) return;
        if (err) {
          console.error('[useOpenSource]', err);
          setError(err.message);
          setProjects([]);
        } else {
          setProjects((data as DbOpenSourceProject[] | null ?? []).map(toOpenSource));
        }
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { projects, loading, error };
}

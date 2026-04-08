import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { DbOpenSourceProject } from '../lib/types/database';
import type { OpenSourceProject } from '../data/types';
import { openSourceProjects as localProjects } from '../data/openSourceData';

function toOpenSource(row: DbOpenSourceProject): OpenSourceProject {
  return {
    id: row.id,
    name: row.name,
    description: { ko: row.description_ko, en: row.description_en },
    fullDescription: { ko: row.full_description_ko, en: row.full_description_en },
    category: { ko: row.category_ko, en: row.category_en },
    tags: row.tags,
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
    features: { ko: row.features_ko, en: row.features_en },
    image: row.image_url ?? '',
    year: row.year,
  };
}

export function useOpenSource() {
  const [projects, setProjects] = useState<OpenSourceProject[]>(localProjects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('open_source_projects').select('*')
      .eq('is_visible', true)
      .order('sort_order')
      .then(({ data, error }) => {
        if (data && data.length > 0 && !error) {
          setProjects((data as DbOpenSourceProject[]).map(toOpenSource));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { projects, loading };
}

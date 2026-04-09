import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { DbProject } from '../lib/types/database';
import { projects as localProjects, type Project } from '../data/projectsData';

function toProject(row: DbProject): Project {
  return {
    id: row.id,
    title: { ko: row.title_ko, en: row.title_en },
    description: { ko: row.description_ko, en: row.description_en },
    fullDescription: { ko: row.full_description_ko, en: row.full_description_en },
    tags: row.tags,
    image: row.cover_image_url ?? '',
    year: row.year,
    role: { ko: row.role_ko, en: row.role_en },
    highlights: { ko: row.highlights_ko, en: row.highlights_en },
    techStack: {
      frontend: row.tech_frontend.length > 0 ? row.tech_frontend : undefined,
      backend: row.tech_backend.length > 0 ? row.tech_backend : undefined,
      design: row.tech_design.length > 0 ? row.tech_design : undefined,
      others: row.tech_others.length > 0 ? row.tech_others : undefined,
    },
    links: {
      github: row.link_github ?? undefined,
      demo: row.link_demo ?? undefined,
      website: row.link_website ?? undefined,
    },
  };
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('projects').select('*').order('sort_order')
      .then(({ data, error }) => {
        if (data && data.length > 0 && !error) {
          setProjects((data as DbProject[]).map(toProject));
        } else {
          setProjects(localProjects);
        }
        setLoading(false);
      })
      .catch(() => { setProjects(localProjects); setLoading(false); });
  }, []);

  return { projects, loading };
}

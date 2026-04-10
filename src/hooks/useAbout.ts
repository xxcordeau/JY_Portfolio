import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { DbSkill, DbEducation, DbExperience } from '../lib/types/database';
import type { Skill, Education, Experience } from '../data/aboutData';

function toSkill(row: DbSkill): Skill {
  return { name: row.name, category: row.category };
}

function toEducation(row: DbEducation): Education {
  return {
    school: { ko: row.school_ko, en: row.school_en },
    degree: { ko: row.degree_ko, en: row.degree_en },
    major: { ko: row.major_ko, en: row.major_en },
    period: row.period,
    description: { ko: row.description_ko ?? '', en: row.description_en ?? '' },
  };
}

function toExperience(row: DbExperience): Experience {
  return {
    company: { ko: row.company_ko, en: row.company_en },
    position: { ko: row.position_ko, en: row.position_en },
    period: row.period,
    description: { ko: row.description_ko ?? '', en: row.description_en ?? '' },
    achievements: { ko: row.achievements_ko ?? [], en: row.achievements_en ?? [] },
  };
}

/**
 * Supabase is the single source of truth.
 * No local data fallback — surface errors visibly instead.
 */
export function useAbout() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      supabase.from('skills').select('*').order('sort_order'),
      supabase.from('education').select('*').order('sort_order'),
      supabase.from('experiences').select('*').order('sort_order'),
    ]).then(([s, e, x]) => {
      if (cancelled) return;
      const firstErr = s.error ?? e.error ?? x.error;
      if (firstErr) {
        console.error('[useAbout]', firstErr);
        setError(firstErr.message);
      }
      setSkills((s.data as DbSkill[] | null ?? []).map(toSkill));
      setEducation((e.data as DbEducation[] | null ?? []).map(toEducation));
      setExperiences((x.data as DbExperience[] | null ?? []).map(toExperience));
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { skills, education, experiences, loading, error };
}

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { DbSkill, DbEducation, DbExperience } from '../lib/types/database';
import { skills as localSkills, education as localEducation, experiences as localExperiences } from '../data/aboutData';
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
    achievements: { ko: row.achievements_ko, en: row.achievements_en },
  };
}

export function useAbout() {
  const [skills, setSkills] = useState<Skill[]>(localSkills);
  const [education, setEducation] = useState<Education[]>(localEducation);
  const [experiences, setExperiences] = useState<Experience[]>(localExperiences);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('skills').select('*').order('sort_order'),
      supabase.from('education').select('*').order('sort_order'),
      supabase.from('experiences').select('*').order('sort_order'),
    ]).then(([s, e, x]) => {
      const skillsData = (s.data as DbSkill[]) ?? [];
      const eduData = (e.data as DbEducation[]) ?? [];
      const expData = (x.data as DbExperience[]) ?? [];
      if (skillsData.length > 0) setSkills(skillsData.map(toSkill));
      if (eduData.length > 0) setEducation(eduData.map(toEducation));
      if (expData.length > 0) setExperiences(expData.map(toExperience));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return { skills, education, experiences, loading };
}

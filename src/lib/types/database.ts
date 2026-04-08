// ============================================
// Supabase Database Type Definitions
// Single source of truth for all table types
// ============================================

// --- Blog ---
export interface DbBlogPost {
  id: string;
  title_ko: string;
  title_en: string;
  excerpt_ko: string;
  excerpt_en: string;
  category_ko: string;
  category_en: string;
  read_time_ko: string;
  read_time_en: string;
  content_ko: string;
  content_en: string;
  tags: string[];
  thumbnail_url: string | null;
  status: 'draft' | 'published';
  date: string;
  created_at: string;
  updated_at: string;
}

// --- Projects ---
export interface DbProject {
  id: string;
  title_ko: string;
  title_en: string;
  description_ko: string;
  description_en: string;
  full_description_ko: string;
  full_description_en: string;
  role_ko: string;
  role_en: string;
  year: string;
  tags: string[];
  cover_image_url: string | null;
  tech_frontend: string[];
  tech_backend: string[];
  tech_design: string[];
  tech_others: string[];
  highlights_ko: string[];
  highlights_en: string[];
  challenge_ko: string | null;
  challenge_en: string | null;
  solution_ko: string | null;
  solution_en: string | null;
  link_github: string | null;
  link_demo: string | null;
  link_website: string | null;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DbProjectImage {
  id: string;
  project_id: string;
  url: string;
  caption_ko: string | null;
  caption_en: string | null;
  sort_order: number;
}

// --- Open Source ---
export interface DbOpenSourceProject {
  id: string;
  name: string;
  description_ko: string;
  description_en: string;
  full_description_ko: string;
  full_description_en: string;
  category_ko: string;
  category_en: string;
  tags: string[];
  stat_stars: string;
  stat_downloads: string;
  stat_components: string | null;
  stat_contributors: string;
  link_github: string;
  link_npm: string | null;
  link_demo: string | null;
  features_ko: string[];
  features_en: string[];
  image_url: string | null;
  year: string;
  is_visible: boolean;
  sort_order: number;
}

// --- About ---
export interface DbSkill {
  id: string;
  name: string;
  level?: number; // DB 호환용, UI에서는 미사용
  category: 'frontend' | 'backend' | 'design' | 'other';
  sort_order: number;
}

export interface DbEducation {
  id: string;
  school_ko: string;
  school_en: string;
  degree_ko: string;
  degree_en: string;
  major_ko: string;
  major_en: string;
  period: string;
  description_ko: string | null;
  description_en: string | null;
  sort_order: number;
}

export interface DbExperience {
  id: string;
  company_ko: string;
  company_en: string;
  position_ko: string;
  position_en: string;
  period: string;
  description_ko: string | null;
  description_en: string | null;
  achievements_ko: string[];
  achievements_en: string[];
  sort_order: number;
}

// --- Chatbot ---
export interface DbChatbotCategory {
  id: string;
  icon: string;
  title_ko: string;
  title_en: string;
  sort_order: number;
}

export interface DbChatbotQuestion {
  id: string;
  category_id: string;
  question_ko: string;
  question_en: string;
  answer_ko: string;
  answer_en: string;
  action: string | null;
  sort_order: number;
}

// --- Contact Messages ---
export interface DbContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// --- Presentations ---
export interface DbPresentation {
  id: string;
  title_ko: string;
  title_en: string;
  description_ko: string | null;
  description_en: string | null;
  category_tag: string | null;
  file_url: string;
  thumbnail_url: string | null;
  date: string;
  is_public: boolean;
  sort_order: number;
  created_at: string;
}

// --- Site Settings ---
export interface DbSiteSetting {
  key: string;
  value: string | null;
  updated_at: string;
}

// ============================================
// Helper: DB flat row → bilingual shape
// Used by hooks to convert DB columns to { ko, en }
// ============================================
export function toBilingual<T extends Record<string, unknown>>(
  row: T,
  field: string
): { ko: string; en: string } {
  return {
    ko: (row[`${field}_ko`] as string) ?? '',
    en: (row[`${field}_en`] as string) ?? '',
  };
}

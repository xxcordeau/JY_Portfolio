// Blog Post Type
export interface BlogPost {
  id: string;
  title: {
    ko: string;
    en: string;
  };
  excerpt: {
    ko: string;
    en: string;
  };
  category: {
    ko: string;
    en: string;
  };
  date: string;
  readTime: {
    ko: string;
    en: string;
  };
  tags: string[];
  thumbnail: string;
  component: string; // Component identifier
}

// Project Type
export interface Project {
  id: string;
  title: {
    ko: string;
    en: string;
  };
  description: {
    ko: string;
    en: string;
  };
  fullDescription: {
    ko: string;
    en: string;
  };
  tags: string[];
  image: string;
  year: string;
  role: {
    ko: string;
    en: string;
  };
  highlights: {
    ko: string[];
    en: string[];
  };
  techStack: {
    frontend?: string[];
    backend?: string[];
    design?: string[];
    others?: string[];
  };
  links?: {
    github?: string;
    demo?: string;
    website?: string;
  };
}

// Open Source Project Type
export interface OpenSourceProject {
  id: string;
  name: string;
  description: {
    ko: string;
    en: string;
  };
  fullDescription: {
    ko: string;
    en: string;
  };
  category: {
    ko: string;
    en: string;
  };
  tags: string[];
  stats: {
    stars: string;
    downloads: string;
    components?: string;
    contributors: string;
  };
  links: {
    github: string;
    npm?: string;
    demo?: string;
  };
  features: {
    ko: string[];
    en: string[];
  };
  image: string;
  year: string;
}

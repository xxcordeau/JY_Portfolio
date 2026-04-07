import { tonginExpress } from './projects/tongin-express';
import { keyrke } from './projects/keyrke';
import { winnticket } from './projects/winnticket';

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

export const projects: Project[] = [
  winnticket,
  tonginExpress,
  keyrke
];

import { awesomeUIKit } from './openSource/awesome-ui-kit';
import { dataUIKit } from './openSource/data-ui-kit';

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

export const openSourceProjects: OpenSourceProject[] = [
  awesomeUIKit,
  dataUIKit
];

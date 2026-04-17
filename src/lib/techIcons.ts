/**
 * Shared tech icon resolver for ProjectDetail, BlogDetail, About
 * Maps technology names → devicon / simpleicons CDN URLs
 */

const _DV = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';
const _SI = 'https://cdn.simpleicons.org';

export const TECH_ICONS: Record<string, string> = {
  // ── JavaScript ecosystem ──
  'JavaScript':         `${_DV}/javascript/javascript-original.svg`,
  'TypeScript':         `${_DV}/typescript/typescript-original.svg`,
  'React':              `${_DV}/react/react-original.svg`,
  'Next.js':            `${_DV}/nextjs/nextjs-original.svg`,
  'Remix':              `${_SI}/remix/000000`,
  'Vue.js':             `${_DV}/vuejs/vuejs-original.svg`,
  'Vue 3':              `${_DV}/vuejs/vuejs-original.svg`,
  'Vue':                `${_DV}/vuejs/vuejs-original.svg`,
  'Nuxt.js':            `${_DV}/nuxtjs/nuxtjs-original.svg`,
  'Nuxt 3':             `${_DV}/nuxtjs/nuxtjs-original.svg`,
  'Nuxt':               `${_DV}/nuxtjs/nuxtjs-original.svg`,
  'Svelte':             `${_DV}/svelte/svelte-original.svg`,
  'Angular':            `${_DV}/angularjs/angularjs-original.svg`,
  'Redux':              `${_DV}/redux/redux-original.svg`,
  'Zustand':            `${_SI}/zustand/443E38`,
  'React Router':       `${_SI}/reactrouter/CA4245`,
  'React Query':        `${_SI}/reactquery/FF4154`,
  'Motion':             `${_SI}/framer/0055FF`,
  'Framer Motion':      `${_SI}/framer/0055FF`,

  // ── Styling ──
  'HTML':               `${_DV}/html5/html5-original.svg`,
  'CSS':                `${_DV}/css3/css3-original.svg`,
  'HTML/CSS':           `${_DV}/html5/html5-original.svg`,
  'HTML\\CSS':          `${_DV}/html5/html5-original.svg`,
  'Tailwind CSS':       `${_DV}/tailwindcss/tailwindcss-original.svg`,
  'Styled-Components':  `${_SI}/styledcomponents/DB7093`,
  'Sass':               `${_DV}/sass/sass-original.svg`,
  'SCSS':               `${_DV}/sass/sass-original.svg`,
  'CSS Modules':        `${_SI}/cssmodules/000000`,
  'Ant Design':         `${_DV}/antdesign/antdesign-original.svg`,
  'Radix UI':           `${_SI}/radixui/161618`,
  'Storybook':          `${_DV}/storybook/storybook-original.svg`,
  'Material UI':        `${_DV}/materialui/materialui-original.svg`,
  'Chakra UI':          `${_SI}/chakraui/319795`,
  'Shadcn UI':          `${_SI}/shadcnui/000000`,
  'Recharts':           `${_SI}/recharts/22B5BF`,

  // ── Build tools ──
  'Vite':               `${_DV}/vitejs/vitejs-original.svg`,
  'Webpack':            `${_DV}/webpack/webpack-original.svg`,
  'npm':                `${_DV}/npm/npm-original-wordmark.svg`,
  'pnpm':               `${_SI}/pnpm/F69220`,
  'Yarn':               `${_DV}/yarn/yarn-original.svg`,
  'Rollup':             `${_SI}/rollupdotjs/EC4A3F`,
  'Babel':              `${_DV}/babel/babel-original.svg`,
  'ESLint':             `${_DV}/eslint/eslint-original.svg`,

  // ── Backend ──
  'Node.js':            `${_DV}/nodejs/nodejs-original.svg`,
  'Express':            `${_DV}/express/express-original.svg`,
  'Nest.js':            `${_DV}/nestjs/nestjs-original.svg`,
  'NestJS':             `${_DV}/nestjs/nestjs-original.svg`,
  'Fastify':            `${_SI}/fastify/000000`,
  'Spring Boot':        `${_DV}/spring/spring-original.svg`,
  'Spring':             `${_DV}/spring/spring-original.svg`,
  'Java':               `${_DV}/java/java-original.svg`,
  'Python':             `${_DV}/python/python-original.svg`,
  'Go':                 `${_DV}/go/go-original.svg`,
  'Rust':               `${_DV}/rust/rust-original.svg`,

  // ── Database / Cache ──
  'PostgreSQL':         `${_DV}/postgresql/postgresql-original.svg`,
  'MySQL':              `${_DV}/mysql/mysql-original.svg`,
  'MongoDB':            `${_DV}/mongodb/mongodb-original.svg`,
  'Redis':              `${_DV}/redis/redis-original.svg`,
  'SQLite':             `${_DV}/sqlite/sqlite-original.svg`,
  'Prisma':             `${_SI}/prisma/2D3748`,
  'Supabase':           `${_DV}/supabase/supabase-original.svg`,
  'Firebase':           `${_DV}/firebase/firebase-plain.svg`,

  // ── DevOps / Cloud ──
  'Docker':             `${_DV}/docker/docker-original.svg`,
  'Kubernetes':         `${_DV}/kubernetes/kubernetes-plain.svg`,
  'AWS':                `${_DV}/amazonwebservices/amazonwebservices-plain-wordmark.svg`,
  'AWS S3':             `${_DV}/amazonwebservices/amazonwebservices-plain-wordmark.svg`,
  'GCP':                `${_DV}/googlecloud/googlecloud-original.svg`,
  'Azure':              `${_DV}/azure/azure-original.svg`,
  'Vercel':             `${_DV}/vercel/vercel-original.svg`,
  'Netlify':            `${_DV}/netlify/netlify-original.svg`,
  'GitHub':             `${_DV}/github/github-original.svg`,
  'GitHub Actions':     `${_DV}/github/github-original.svg`,
  'Git':                `${_DV}/git/git-original.svg`,
  'Jenkins':            `${_DV}/jenkins/jenkins-original.svg`,
  'Linux':              `${_DV}/linux/linux-original.svg`,
  'Nginx':              `${_DV}/nginx/nginx-original.svg`,

  // ── Design ──
  'Figma':              `${_DV}/figma/figma-original.svg`,
  'Photoshop':          `${_DV}/photoshop/photoshop-original.svg`,
  'Illustrator':        `${_DV}/illustrator/illustrator-plain.svg`,
  'XD':                 `${_DV}/xd/xd-plain.svg`,
  'After Effects':      `${_DV}/aftereffects/aftereffects-plain.svg`,

  // ── Testing / Docs ──
  'Swagger':            `${_DV}/swagger/swagger-original.svg`,
  'Postman':            `${_DV}/postman/postman-original.svg`,
  'Jest':               `${_DV}/jest/jest-plain.svg`,
  'Vitest':             `${_SI}/vitest/6E9F18`,
  'Cypress':            `${_SI}/cypress/17202C`,

  // ── Collaboration ──
  'Jira':               `${_DV}/jira/jira-original.svg`,
  'Notion':             `${_DV}/notion/notion-original.svg`,
  'Slack':              `${_DV}/slack/slack-original.svg`,
};

/**
 * Icons whose SVG already has a solid background — fill the box.
 * Others are transparent and stay contained with padding.
 */
export const FILLED_ICONS = new Set([
  'JavaScript', 'TypeScript',
  'HTML', 'CSS', 'HTML/CSS',
  'Sass', 'SCSS',
  'Photoshop', 'Illustrator',
  'Storybook',
  'Swagger', 'Postman',
]);

/**
 * Resolve icon URL for a tech name.
 * Handles variant names like "Tailwind CSS v4", "Java 17", "Nuxt 3" etc.
 */
export function resolveIcon(name: string): string | undefined {
  // Direct match first
  if (TECH_ICONS[name]) return TECH_ICONS[name];

  // Strip trailing version numbers: "Tailwind CSS v4" → "Tailwind CSS", "Java 17" → "Java"
  const stripped = name.replace(/\s+(v?\d[\d.]*\w*)$/i, '').trim();
  if (stripped !== name && TECH_ICONS[stripped]) return TECH_ICONS[stripped];

  // Try removing parenthetical suffixes: "Node.js (Express)" → "Node.js"
  const noParens = name.replace(/\s*\(.*\)$/, '').trim();
  if (noParens !== name && TECH_ICONS[noParens]) return TECH_ICONS[noParens];

  return undefined;
}

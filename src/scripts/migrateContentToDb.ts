/**
 * Blog content migration: TSX component → Supabase DB markdown
 * Run: VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=<service_role_key> npx tsx src/scripts/migrateContentToDb.ts
 */

import { createClient } from '@jsr/supabase__supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const url = process.env.VITE_SUPABASE_URL ?? '';
const key = process.env.VITE_SUPABASE_ANON_KEY ?? '';
if (!url || !key) { console.error('Missing env vars'); process.exit(1); }

const supabase = createClient(url, key);

// JSX → Markdown converter
function jsxToMarkdown(jsx: string): string {
  let md = jsx;

  // Remove outer <Content> tags
  md = md.replace(/<Content[^>]*>/g, '').replace(/<\/Content>/g, '');

  // ArticleImage blocks → image markdown
  md = md.replace(/<ArticleImage[^>]*>[\s\S]*?src="([^"]+)"[\s\S]*?alt="([^"]*)"[\s\S]*?<\/ArticleImage>/g,
    (_m, src, alt) => `\n![${alt}](${src})\n`);

  // --- Step 1: Code blocks를 플레이스홀더로 보호 (이후 tag strip에서 내용 보존) ---
  const codeBlocks: string[] = [];

  // <pre><code>{`...`}</code></pre> → 플레이스홀더
  md = md.replace(/<pre><code>\{`([\s\S]*?)`\}<\/code><\/pre>/g, (_m, code) => {
    // template literal 이스케이프 복원
    const restored = code.replace(/\\`/g, '`').replace(/\\\$/g, '$');
    const idx = codeBlocks.length;
    codeBlocks.push(`\n\`\`\`\n${restored}\n\`\`\`\n`);
    return `%%CODEBLOCK_${idx}%%`;
  });

  // Inline code: <code>text</code>
  md = md.replace(/<code>([\s\S]*?)<\/code>/g, '`$1`');

  // Headings
  md = md.replace(/<h1>([\s\S]*?)<\/h1>/g, '\n# $1\n');
  md = md.replace(/<h2>([\s\S]*?)<\/h2>/g, '\n## $1\n');
  md = md.replace(/<h3>([\s\S]*?)<\/h3>/g, '\n### $1\n');
  md = md.replace(/<h4>([\s\S]*?)<\/h4>/g, '\n#### $1\n');

  // Strong/bold
  md = md.replace(/<strong>([\s\S]*?)<\/strong>/g, '**$1**');

  // Links
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g, '[$2]($1)');

  // List items
  md = md.replace(/\s*<li>([\s\S]*?)<\/li>/g, '\n- $1');

  // Ordered list items (in <ol>)
  let olIndex = 0;
  md = md.replace(/<ol>([\s\S]*?)<\/ol>/g, (_m, inner) => {
    olIndex = 0;
    return inner.replace(/\n- /g, () => `\n${++olIndex}. `);
  });

  // Remove remaining list tags
  md = md.replace(/<ul>/g, '').replace(/<\/ul>/g, '');
  md = md.replace(/<ol>/g, '').replace(/<\/ol>/g, '');

  // Blockquote
  md = md.replace(/<blockquote>([\s\S]*?)<\/blockquote>/g, (_m, inner) => {
    const lines = inner.trim().split('\n').map((l: string) => `> ${l.trim()}`).join('\n');
    return `\n${lines}\n`;
  });

  // Paragraphs
  md = md.replace(/<p>([\s\S]*?)<\/p>/g, '\n$1\n');

  // HTML entities
  md = md.replace(/&gt;/g, '>');
  md = md.replace(/&lt;/g, '<');
  md = md.replace(/&amp;/g, '&');

  // JSX expressions like {/* ... */}
  md = md.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');

  // Remove remaining JSX/HTML tags (코드블록 플레이스홀더는 건드리지 않음)
  md = md.replace(/<[^>]+>/g, '');

  // --- Step 2: 플레이스홀더를 실제 코드블록으로 복원 ---
  md = md.replace(/%%CODEBLOCK_(\d+)%%/g, (_m, idx) => codeBlocks[Number(idx)]);

  // Template literal escapes (인라인 코드에 남아있는 것만)
  md = md.replace(/\\`/g, '`');
  md = md.replace(/\\\$/g, '$');

  // Clean up excessive blank lines
  md = md.replace(/\n{4,}/g, '\n\n\n');
  md = md.replace(/^\n+/, '').replace(/\n+$/, '');

  return md.trim();
}

// Extract Korean and English content from TSX file
function extractContent(filePath: string): { ko: string; en: string } {
  const src = readFileSync(filePath, 'utf-8');

  // Extract Korean section: if (language === 'ko') { return ( <Content> ... </Content> ); }
  // Then English: the final return ( <Content> ... </Content> );

  // Split by "if (language === 'ko')"
  const koSplit = src.split(/if \(language === ['"]ko['"]\)/);
  if (koSplit.length < 2) {
    console.warn(`  Could not find ko/en split in ${filePath}`);
    return { ko: '', en: '' };
  }

  const koBlock = koSplit[1];
  const enBlock = koSplit[0]; // Everything before ko check + the remaining after

  // Extract KO: from first <Content> to its matching </Content>
  const koContentMatch = koBlock.match(/<Content[^>]*>([\s\S]*?)<\/Content>/);
  const koRaw = koContentMatch ? koContentMatch[1] : '';

  // Extract EN: find the last <Content>...</Content> in the file
  const allContentMatches = [...src.matchAll(/<Content[^>]*>([\s\S]*?)<\/Content>/g)];
  const enRaw = allContentMatches.length >= 2
    ? allContentMatches[allContentMatches.length - 1][1]
    : allContentMatches[0]?.[1] ?? '';

  return {
    ko: jsxToMarkdown(koRaw),
    en: jsxToMarkdown(enRaw),
  };
}

const POSTS_DIR = join(process.cwd(), 'src/components/blog/posts');

const postFiles: { id: string; file: string }[] = [
  { id: 'react-page-refactoring', file: 'ReactPageRefactoringPost.tsx' },
  { id: 'dynamic-static-import', file: 'DynamicStaticImportPost.tsx' },
  { id: 'api-mismatch-usememo-crash', file: 'ApiMismatchMemoPost.tsx' },
  { id: 'hidden-div-react-rendering', file: 'HiddenDivPost.tsx' },
  { id: 'css-print-layer-conflict', file: 'CssPrintLayerPost.tsx' },
  { id: 'common-utils-composable', file: 'CommonUtilsPost.tsx' },
  { id: 'dashboard-widget-system', file: 'DashboardWidgetPost.tsx' },
  { id: 'view-state-standardization', file: 'ViewStatePost.tsx' },
  { id: 'role-permission-system', file: 'RolePermissionPost.tsx' },
  { id: 'table-component-structuring', file: 'TableComponentPost.tsx' },
  { id: 'filter-system-implementation', file: 'FilterSystemPost.tsx' },
  { id: 'tree-structure-management', file: 'TreeManagementPost.tsx' },
  { id: 'icon-system-implementation', file: 'IconSystemPost.tsx' },
];

async function migrate() {
  console.log('🚀 Migrating blog content to Supabase...\n');

  for (const { id, file } of postFiles) {
    const filePath = join(POSTS_DIR, file);
    console.log(`📝 ${id}`);

    try {
      const { ko, en } = extractContent(filePath);

      if (!ko.trim()) {
        console.log(`  ⚠️  No Korean content extracted`);
        continue;
      }

      const { error } = await supabase
        .from('blog_posts')
        .update({ content_ko: ko, content_en: en, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error(`  ❌ Error: ${error.message}`);
      } else {
        console.log(`  ✅ KO: ${ko.length} chars, EN: ${en.length} chars`);
      }
    } catch (e) {
      console.error(`  ❌ Failed to process ${file}:`, e);
    }
  }

  console.log('\n🎉 Migration complete!');
}

migrate();

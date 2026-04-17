/**
 * Add missing skills to Supabase skills table.
 * Only inserts skills that don't already exist (checked by name).
 *
 * Run with:
 *   VITE_SUPABASE_URL=<url> VITE_SUPABASE_ANON_KEY=<key> npx tsx src/scripts/addMissingSkills.ts
 *
 * Or set env vars in your shell first and just run:
 *   npx tsx src/scripts/addMissingSkills.ts
 */

import { createClient } from '@jsr/supabase__supabase-js';

const url = process.env.VITE_SUPABASE_URL ?? '';
const key = process.env.VITE_SUPABASE_ANON_KEY ?? '';

if (!url || !key) {
  console.error('❌  Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
  console.error('    Run: VITE_SUPABASE_URL=xxx VITE_SUPABASE_ANON_KEY=yyy npx tsx src/scripts/addMissingSkills.ts');
  process.exit(1);
}

const supabase = createClient(url, key);

const newSkills = [
  { name: 'Next.js',            level: 82, category: 'frontend', sort_order: 14 },
  { name: 'Styled-Components',  level: 88, category: 'frontend', sort_order: 15 },
  { name: 'Tailwind CSS',       level: 85, category: 'frontend', sort_order: 16 },
  { name: 'Ant Design',         level: 80, category: 'frontend', sort_order: 17 },
  { name: 'Storybook',          level: 75, category: 'frontend', sort_order: 18 },
  { name: 'Sass',               level: 85, category: 'frontend', sort_order: 19 },
  { name: 'Webpack',            level: 72, category: 'other',    sort_order: 20 },
  { name: 'npm',                level: 85, category: 'other',    sort_order: 21 },
  { name: 'Vercel',             level: 80, category: 'other',    sort_order: 22 },
  { name: 'Vite',               level: 82, category: 'other',    sort_order: 23 },
].map(s => ({ ...s, id: crypto.randomUUID() }));

async function main() {
  console.log('🔍  Fetching existing skills...');
  const { data: existing, error: fetchErr } = await supabase
    .from('skills')
    .select('name');

  if (fetchErr) {
    console.error('❌  Failed to fetch existing skills:', fetchErr.message);
    process.exit(1);
  }

  const existingNames = new Set((existing ?? []).map((s: { name: string }) => s.name));
  const toInsert = newSkills.filter(s => !existingNames.has(s.name));

  if (toInsert.length === 0) {
    console.log('✅  All skills already exist — nothing to insert.');
    return;
  }

  console.log(`📦  Inserting ${toInsert.length} new skill(s): ${toInsert.map(s => s.name).join(', ')}`);

  const { error: insertErr } = await supabase.from('skills').insert(toInsert);
  if (insertErr) {
    console.error('❌  Insert failed:', insertErr.message);
    process.exit(1);
  }

  console.log('✅  Done! Skills added successfully.');
}

main();

import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/styled.ts'],
  format: ['esm'],
  dts: false,
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: [
    'react',
    'react-dom',
    'styled-components',
    'lucide-react',
    'next-themes',
  ],
  banner: {
    js: '"use client";',
  },
});

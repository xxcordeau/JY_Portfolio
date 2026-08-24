/**
 * pdfjs 워커를 node_modules -> public/ 으로 복사한다.
 * Next 정적 빌드에서는 new URL(..., import.meta.url) 패턴을 쓸 수 없어
 * 워커를 정적 자산으로 서빙해야 한다.
 */
import { copyFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.mjs');
const dest = join(__dirname, '..', 'public', 'pdf.worker.min.mjs');

if (!existsSync(src)) {
  console.warn('[copy-pdf-worker] 원본을 찾을 수 없어 건너뜁니다:', src);
  process.exit(0);
}

copyFileSync(src, dest);
console.log('[copy-pdf-worker] public/pdf.worker.min.mjs 갱신 완료');

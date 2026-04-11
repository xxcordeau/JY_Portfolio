import * as pdfjsLib from 'pdfjs-dist';
import { jsPDF } from 'jspdf';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

/**
 * PDF 파일을 각 페이지를 JPEG로 변환해 용량을 줄인 새 PDF로 반환
 * @param file  원본 PDF File
 * @param scale 렌더 스케일 (낮을수록 작은 파일, 기본 1.5)
 * @param quality JPEG 품질 0~1 (기본 0.85)
 */
export async function compressPdf(
  file: File,
  scale = 1.5,
  quality = 0.85
): Promise<File> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  const numPages = pdf.numPages;
  let jsPdfDoc: jsPDF | null = null;

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });

    // 캔버스 생성
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d', { alpha: false })!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvasContext: ctx, viewport, intent: 'display' }).promise;

    const imgData = canvas.toDataURL('image/jpeg', quality);

    // 페이지 크기 (mm 단위 변환)
    const pxToMm = 25.4 / 96;
    const widthMm = (viewport.width / scale) * pxToMm;
    const heightMm = (viewport.height / scale) * pxToMm;

    if (i === 1) {
      jsPdfDoc = new jsPDF({
        orientation: widthMm > heightMm ? 'landscape' : 'portrait',
        unit: 'mm',
        format: [widthMm, heightMm],
        compress: true,
      });
    } else {
      jsPdfDoc!.addPage([widthMm, heightMm], widthMm > heightMm ? 'landscape' : 'portrait');
    }

    jsPdfDoc!.addImage(imgData, 'JPEG', 0, 0, widthMm, heightMm, undefined, 'FAST');
  }

  const blob = jsPdfDoc!.output('blob');
  return new File([blob], file.name, { type: 'application/pdf' });
}

import type { Metadata } from 'next';
import OpenSourceDetailView from '../../../src/components/app/views/OpenSourceDetailView';
import { getOpenSourceIds, getOpenSourceProject } from '../../../src/lib/next/staticParams';

export async function generateStaticParams() {
  const ids = await getOpenSourceIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = await getOpenSourceProject(id);
  if (!p) return { title: '오픈소스 | 허정연 포트폴리오' };

  const title = `${p.name ?? id} | 허정연 오픈소스`;
  const description = p.description_ko ?? '직접 만들어 공개한 UI 컴포넌트 라이브러리.';
  const image = p.image_url;

  return {
    title,
    description,
    keywords: p.tags,
    openGraph: {
      title,
      description,
      type: 'article',
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OpenSourceDetailView id={id} />;
}

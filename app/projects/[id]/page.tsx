import type { Metadata } from 'next';
import ProjectDetailView from '../../../src/components/app/views/ProjectDetailView';
import { getProjectIds, getProject } from '../../../src/lib/next/staticParams';

export async function generateStaticParams() {
  const ids = await getProjectIds();
  return ids.map((id) => ({ id }));
}

// 빌드 타임에 Supabase에서 읽어 페이지별 title/description/OG를 생성한다.
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = await getProject(id);
  if (!p) return { title: '프로젝트 | 허정연 포트폴리오' };

  const title = `${p.title_ko ?? id} | 허정연 포트폴리오`;
  const description = p.description_ko ?? '허정연이 만든 프로젝트.';
  const image = p.cover_image_url;

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
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProjectDetailView id={id} />;
}

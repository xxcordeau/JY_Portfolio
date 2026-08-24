import type { Metadata } from 'next';
import BlogDetailView from '../../../src/components/app/views/BlogDetailView';
import { getBlogIds, getBlogPost } from '../../../src/lib/next/staticParams';

export async function generateStaticParams() {
  const ids = await getBlogIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = await getBlogPost(id);
  if (!post) return { title: '블로그 | 허정연 포트폴리오' };

  const title = `${post.title_ko ?? id} | 허정연 블로그`;
  const description = post.excerpt_ko ?? '프론트엔드 개발과 디자인에 대한 글.';
  const image = post.thumbnail_url;
  const published = post.date ?? post.created_at;

  return {
    title,
    description,
    keywords: post.tags,
    openGraph: {
      title,
      description,
      type: 'article',
      ...(published ? { publishedTime: published } : {}),
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
  return <BlogDetailView id={id} />;
}

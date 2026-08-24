'use client';
import { useRouter } from 'next/navigation';
import Blog from '../../Blog';

export default function BlogView() {
  const router = useRouter();
  return (
    <Blog
      onPostClick={(id) => router.push(`/blog/${id}`)}
      onBack={() => router.push('/')}
    />
  );
}

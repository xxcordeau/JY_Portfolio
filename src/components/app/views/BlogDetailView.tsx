'use client';
import { useRouter } from 'next/navigation';
import BlogDetail from '../../BlogDetail';

export default function BlogDetailView({ id }: { id: string }) {
  const router = useRouter();
  return <BlogDetail blogId={id} onBack={() => router.back()} />;
}

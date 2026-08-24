'use client';
import { useRouter } from 'next/navigation';
import ProjectDetail from '../../ProjectDetail';

export default function ProjectDetailView({ id }: { id: string }) {
  const router = useRouter();
  return <ProjectDetail projectId={id} onBack={() => router.back()} />;
}

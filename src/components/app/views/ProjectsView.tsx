'use client';
import { useRouter } from 'next/navigation';
import ProjectsGallery from '../../ProjectsGallery';

export default function ProjectsView() {
  const router = useRouter();
  return (
    <ProjectsGallery
      onProjectClick={(id) => router.push(`/projects/${id}`)}
      onBack={() => router.push('/')}
    />
  );
}

'use client';
import { useRouter } from 'next/navigation';
import OpenSourceDetail from '../../OpenSourceDetail';

export default function OpenSourceDetailView({ id }: { id: string }) {
  const router = useRouter();
  return <OpenSourceDetail projectId={id} onBack={() => router.back()} />;
}

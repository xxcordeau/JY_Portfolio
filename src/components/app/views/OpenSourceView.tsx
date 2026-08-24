'use client';
import { useRouter } from 'next/navigation';
import OpenSource from '../../OpenSource';

export default function OpenSourceView() {
  const router = useRouter();
  return (
    <OpenSource
      onProjectClick={(id) => router.push(`/opensource/${id}`)}
      onBack={() => router.push('/')}
    />
  );
}

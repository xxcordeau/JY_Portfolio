'use client';

import { lazy, Suspense } from 'react';

const PackageDemo = lazy(() => import('../../src/components/PackageDemo'));

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PackageDemo />
    </Suspense>
  );
}

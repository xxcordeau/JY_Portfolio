import AdminProjectFormView from '../../../../src/components/app/views/AdminProjectFormView';
import { getProjectIds } from '../../../../src/lib/next/staticParams';

// output:'export' 에서는 편집 대상 id를 빌드 타임에 모두 생성해야 한다.
export async function generateStaticParams() {
  const ids = await getProjectIds();
  return ids.map((id) => ({ id }));
}

export default function Page() {
  return <AdminProjectFormView />;
}

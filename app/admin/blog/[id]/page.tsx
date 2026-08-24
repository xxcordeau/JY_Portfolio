import AdminBlogFormView from '../../../../src/components/app/views/AdminBlogFormView';
import { getBlogIds } from '../../../../src/lib/next/staticParams';

export async function generateStaticParams() {
  const ids = await getBlogIds();
  return ids.map((id) => ({ id }));
}

export default function Page() {
  return <AdminBlogFormView />;
}

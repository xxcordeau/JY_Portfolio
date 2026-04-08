import { createClient } from '@jsr/supabase__supabase-js';

// 관리자 업로드 전용 클라이언트 (storage RLS 우회 - 내부 관리자 도구 전용)
const adminSupabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://wdedhluxoicizxqojadx.supabase.co',
  import.meta.env.VITE_SUPABASE_SERVICE_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZWRobHV4b2ljaXp4cW9qYWR4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTYyOTA0MCwiZXhwIjoyMDkxMjA1MDQwfQ.t9e-5X7dBjttY0co5fH_RZUwDIkSoktjZyGJ4Va20JM'
);

/**
 * Upload a file to Supabase Storage and return the public URL.
 * @param bucket - Storage bucket name (e.g., 'project-images', 'blog-thumbnails')
 * @param path - File path within the bucket (e.g., 'covers/my-project.webp')
 * @param file - File object to upload
 * @returns Public URL of the uploaded file
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<string> {
  const { error } = await adminSupabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data } = adminSupabase.storage
    .from(bucket)
    .getPublicUrl(path);

  // 캐시 무효화를 위해 타임스탬프 쿼리 파라미터 추가
  return `${data.publicUrl}?t=${Date.now()}`;
}

/**
 * Delete a file from Supabase Storage.
 */
export async function deleteFile(bucket: string, path: string): Promise<void> {
  const { error } = await adminSupabase.storage
    .from(bucket)
    .remove([path]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}

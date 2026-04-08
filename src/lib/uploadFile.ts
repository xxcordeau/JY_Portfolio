import { supabase } from './supabase';

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
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
}

/**
 * Delete a file from Supabase Storage.
 */
export async function deleteFile(bucket: string, path: string): Promise<void> {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}

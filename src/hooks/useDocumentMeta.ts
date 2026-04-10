import { useEffect } from 'react';

interface MetaOptions {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

const BASE_TITLE = 'JY Portfolio — Frontend Developer';

/**
 * Tiny vanilla alternative to react-helmet-async.
 * Updates document.title + selected meta tags on mount, restores on unmount.
 */
export function useDocumentMeta(opts: MetaOptions) {
  useEffect(() => {
    const prev = {
      title: document.title,
      description: getMeta('name', 'description'),
      ogTitle: getMeta('property', 'og:title'),
      ogDescription: getMeta('property', 'og:description'),
      ogImage: getMeta('property', 'og:image'),
    };

    if (opts.title) {
      document.title = opts.title === BASE_TITLE ? BASE_TITLE : `${opts.title} · JY Portfolio`;
    }
    if (opts.description) setMeta('name', 'description', opts.description);
    if (opts.ogTitle ?? opts.title) setMeta('property', 'og:title', opts.ogTitle ?? opts.title!);
    if (opts.ogDescription ?? opts.description) {
      setMeta('property', 'og:description', opts.ogDescription ?? opts.description!);
    }
    if (opts.ogImage) setMeta('property', 'og:image', opts.ogImage);

    return () => {
      document.title = prev.title;
      if (prev.description !== null) setMeta('name', 'description', prev.description);
      if (prev.ogTitle !== null) setMeta('property', 'og:title', prev.ogTitle);
      if (prev.ogDescription !== null) setMeta('property', 'og:description', prev.ogDescription);
      if (prev.ogImage !== null) setMeta('property', 'og:image', prev.ogImage);
    };
  }, [opts.title, opts.description, opts.ogTitle, opts.ogDescription, opts.ogImage]);
}

function getMeta(attr: 'name' | 'property', key: string): string | null {
  const el = document.querySelector(`meta[${attr}="${key}"]`);
  return el?.getAttribute('content') ?? null;
}

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

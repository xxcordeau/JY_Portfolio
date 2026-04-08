import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { DbSiteSetting } from '../lib/types/database';

const DEFAULT_NAV_ORDER = [
  'nav_about', 'nav_projects', 'nav_opensource',
  'nav_blog', 'nav_presentations', 'nav_contact',
];

export function useSiteSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [navOrder, setNavOrder] = useState<string[]>(DEFAULT_NAV_ORDER);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('site_settings').select('*')
      .then(({ data }) => {
        const map: Record<string, string> = {};
        ((data as DbSiteSetting[]) ?? []).forEach(s => {
          map[s.key] = s.value ?? '';
        });
        setSettings(map);

        if (map['nav_order']) {
          try {
            const parsed = JSON.parse(map['nav_order']);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const merged = [...parsed, ...DEFAULT_NAV_ORDER.filter(k => !parsed.includes(k))];
              setNavOrder(merged);
            }
          } catch { /* use default */ }
        }

        setLoading(false);
      });
  }, []);

  const isNavVisible = (key: string) => settings[key] !== 'false';

  return { settings, loading, isNavVisible, navOrder };
}

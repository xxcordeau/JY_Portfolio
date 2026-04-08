import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { DbSiteSetting } from '../lib/types/database';

export function useSiteSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('site_settings').select('*')
      .then(({ data }) => {
        const map: Record<string, string> = {};
        ((data as DbSiteSetting[]) ?? []).forEach(s => {
          map[s.key] = s.value ?? '';
        });
        setSettings(map);
        setLoading(false);
      });
  }, []);

  const isNavVisible = (key: string) => settings[key] !== 'false';

  return { settings, loading, isNavVisible };
}

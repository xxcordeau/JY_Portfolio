import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Save, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import { adminSupabase as supabase } from '../../lib/supabase';
import { useTheme } from '../../contexts/ThemeContext';
import type { DbSiteSetting } from '../../lib/types/database';
import {
  PageHeader, PageTitle, PageSubtitle,
  Card, FormSection, SectionTitle, FormGroup, FormLabel,
  FormInput, PrimaryButton,
  ToggleWrapper, ToggleSwitch, ToggleLabel,
  EmptyState
} from './AdminStyles';

const SettingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid rgba(128,128,128,0.06);

  &:last-child { border-bottom: none; }
`;

const NavRow = styled.div<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'};
  border-radius: 10px;
  margin-bottom: 6px;
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.02)' : '#fafafa'};
`;

const NavGrip = styled.div`
  color: #86868b;
  display: flex;
  align-items: center;
  svg { width: 16px; height: 16px; }
`;

const SettingInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
`;

const SettingName = styled.span<{ $isDark: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
`;

const SettingDesc = styled.span`
  font-size: 12px;
  color: #86868b;
`;

const OrderBtns = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const OrderBtn = styled.button<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 20px;
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
  border-radius: 4px;
  background: transparent;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)'};
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: ${p => p.$isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'};
    color: #0c8ce9;
    border-color: #0c8ce9;
  }

  &:disabled {
    opacity: 0.2;
    cursor: default;
    &:hover { background: transparent; color: inherit; border-color: inherit; }
  }

  svg { width: 14px; height: 14px; }
`;

interface NavItem {
  key: string;
  label: string;
  desc: string;
}

const ALL_NAV_ITEMS: NavItem[] = [
  { key: 'nav_about', label: 'About', desc: '소개 섹션' },
  { key: 'nav_projects', label: 'Projects', desc: '프로젝트 섹션' },
  { key: 'nav_opensource', label: 'Open Source', desc: '오픈소스 페이지' },
  { key: 'nav_blog', label: 'Blog', desc: '블로그 페이지' },
  { key: 'nav_presentations', label: 'Presentations', desc: 'PT 자료 페이지' },
  { key: 'nav_contact', label: 'Contact', desc: '연락처 버튼' },
];

const DEFAULT_NAV_ORDER = ALL_NAV_ITEMS.map(n => n.key);

const CONTACT_SETTINGS = [
  { key: 'contact_email', label: '이메일' },
  { key: 'github_url', label: 'GitHub URL' },
  { key: 'linkedin_url', label: 'LinkedIn URL' },
];

export default function SiteSettingsEditor() {
  const { isDark } = useTheme();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [navOrder, setNavOrder] = useState<string[]>(DEFAULT_NAV_ORDER);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await supabase.from('site_settings').select('*');
    const map: Record<string, string> = {};
    (data as DbSiteSetting[] ?? []).forEach(s => {
      map[s.key] = s.value ?? '';
    });
    setSettings(map);

    // Parse nav_order
    if (map['nav_order']) {
      try {
        const parsed = JSON.parse(map['nav_order']);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Add any missing keys that might have been added later
          const merged = [...parsed, ...DEFAULT_NAV_ORDER.filter(k => !parsed.includes(k))];
          setNavOrder(merged);
        }
      } catch { /* use default */ }
    }
    setLoading(false);
  };

  useEffect(() => { fetchSettings(); }, []);

  const toggleNav = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: prev[key] === 'true' ? 'false' : 'true',
    }));
  };

  const setVal = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const moveNav = (index: number, direction: -1 | 1) => {
    const newOrder = [...navOrder];
    const target = index + direction;
    if (target < 0 || target >= newOrder.length) return;
    [newOrder[index], newOrder[target]] = [newOrder[target], newOrder[index]];
    setNavOrder(newOrder);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Include nav_order in settings
      const allSettings = {
        ...settings,
        nav_order: JSON.stringify(navOrder),
      };

      const rows = Object.entries(allSettings).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString(),
      }));

      for (const row of rows) {
        await supabase.from('site_settings').upsert(row, { onConflict: 'key' });
      }
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <EmptyState $isDark={isDark}>불러오는 중...</EmptyState>;
  }

  return (
    <>
      <PageHeader>
        <div>
          <PageTitle $isDark={isDark}>사이트 설정</PageTitle>
          <PageSubtitle>네비게이션 메뉴와 연락처 정보를 관리합니다</PageSubtitle>
        </div>
        <PrimaryButton onClick={handleSave} disabled={saving}>
          <Save /> {saving ? '저장 중...' : '저장'}
        </PrimaryButton>
      </PageHeader>

      <Card $isDark={isDark}>
        <FormSection $isDark={isDark}>
          <SectionTitle $isDark={isDark}>네비게이션 메뉴 (순서 + 표시)</SectionTitle>
          {navOrder.map((key, i) => {
            const nav = ALL_NAV_ITEMS.find(n => n.key === key);
            if (!nav) return null;
            return (
              <NavRow key={nav.key} $isDark={isDark}>
                <NavGrip><GripVertical /></NavGrip>
                <OrderBtns>
                  <OrderBtn $isDark={isDark} disabled={i === 0} onClick={() => moveNav(i, -1)}>
                    <ChevronUp />
                  </OrderBtn>
                  <OrderBtn $isDark={isDark} disabled={i === navOrder.length - 1} onClick={() => moveNav(i, 1)}>
                    <ChevronDown />
                  </OrderBtn>
                </OrderBtns>
                <SettingInfo>
                  <SettingName $isDark={isDark}>{nav.label}</SettingName>
                  <SettingDesc>{nav.desc}</SettingDesc>
                </SettingInfo>
                <ToggleWrapper onClick={() => toggleNav(nav.key)}>
                  <ToggleSwitch $on={settings[nav.key] === 'true'} />
                </ToggleWrapper>
              </NavRow>
            );
          })}
        </FormSection>

        <FormSection $isDark={isDark}>
          <SectionTitle $isDark={isDark}>Open to Work</SectionTitle>
          <SettingRow>
            <SettingInfo>
              <SettingName $isDark={isDark}>구직 중 표시</SettingName>
              <SettingDesc>포트폴리오에 "Open to Work" 뱃지 표시</SettingDesc>
            </SettingInfo>
            <ToggleWrapper onClick={() => toggleNav('open_to_work')}>
              <ToggleSwitch $on={settings['open_to_work'] === 'true'} />
            </ToggleWrapper>
          </SettingRow>
        </FormSection>

        <FormSection $isDark={isDark}>
          <SectionTitle $isDark={isDark}>연락처 정보</SectionTitle>
          {CONTACT_SETTINGS.map(item => (
            <FormGroup key={item.key}>
              <FormLabel $isDark={isDark}>{item.label}</FormLabel>
              <FormInput $isDark={isDark}
                value={settings[item.key] ?? ''}
                onChange={e => setVal(item.key, e.target.value)}
              />
            </FormGroup>
          ))}
        </FormSection>
      </Card>
    </>
  );
}

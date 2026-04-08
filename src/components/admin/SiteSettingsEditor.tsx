import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
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

const SettingInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
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

const NAV_SETTINGS = [
  { key: 'nav_about', label: 'About', desc: '소개 섹션' },
  { key: 'nav_projects', label: 'Projects', desc: '프로젝트 섹션' },
  { key: 'nav_opensource', label: 'Open Source', desc: '오픈소스 페이지' },
  { key: 'nav_blog', label: 'Blog', desc: '블로그 페이지' },
  { key: 'nav_contact', label: 'Contact', desc: '연락처 버튼' },
  { key: 'nav_presentations', label: 'Presentations', desc: 'PT 자료 페이지' },
];

const CONTACT_SETTINGS = [
  { key: 'contact_email', label: '이메일' },
  { key: 'github_url', label: 'GitHub URL' },
  { key: 'linkedin_url', label: 'LinkedIn URL' },
];

export default function SiteSettingsEditor() {
  const { isDark } = useTheme();
  const [settings, setSettings] = useState<Record<string, string>>({});
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

  const handleSave = async () => {
    setSaving(true);
    try {
      const rows = Object.entries(settings).map(([key, value]) => ({
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
          <SectionTitle $isDark={isDark}>네비게이션 메뉴</SectionTitle>
          {NAV_SETTINGS.map(nav => (
            <SettingRow key={nav.key}>
              <SettingInfo>
                <SettingName $isDark={isDark}>{nav.label}</SettingName>
                <SettingDesc>{nav.desc}</SettingDesc>
              </SettingInfo>
              <ToggleWrapper onClick={() => toggleNav(nav.key)}>
                <ToggleSwitch $on={settings[nav.key] === 'true'} />
              </ToggleWrapper>
            </SettingRow>
          ))}
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

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Mail, Trash2, RefreshCw, Calendar, User as UserIcon, AtSign } from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

const Container = styled.div`
  width: 100%;
`;

const Header = styled.div<{ $isDark: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
`;

const Title = styled.h2<{ $isDark: boolean }>`
  font-size: 32px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0;
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const RefreshButton = styled.button<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
  border: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'};
  border-radius: 8px;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;

  &:hover:not(:disabled) {
    background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const MailList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MailCard = styled.div<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.8)'};
  border: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  backdrop-filter: blur(20px);

  &:hover {
    border-color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)'};
    transform: translateY(-2px);
  }
`;

const MailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MailInfo = styled.div`
  flex: 1;
`;

const MailMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 12px;
`;

const MetaItem = styled.div<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  color: ${props => props.$isDark ? '#d4d4d8' : '#6e6e73'};

  svg {
    width: 16px;
    height: 16px;
    color: #86868b;
  }
`;

const DeleteButton = styled.button<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.3);
  border-radius: 8px;
  color: #ff3b30;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;

  &:hover {
    background: rgba(255, 59, 48, 0.2);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const MailMessage = styled.div<{ $isDark: boolean }>`
  font-size: 16px;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
`;

const EmptyState = styled.div<{ $isDark: boolean }>`
  text-align: center;
  padding: 60px 20px;
  color: #86868b;

  svg {
    width: 64px;
    height: 64px;
    margin: 0 auto 16px;
    opacity: 0.3;
  }

  p {
    font-size: 18px;
    margin: 0;
  }
`;

interface MailData {
  key: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

interface MailManagerProps {
  isDark: boolean;
  language: 'ko' | 'en';
}

export default function MailManager({ isDark, language }: MailManagerProps) {
  const [mails, setMails] = useState<MailData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMails = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a3d4d756/admin/mails`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMails(data.mails || []);
      }
    } catch (error) {
      console.error('Failed to fetch mails:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMail = async (key: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a3d4d756/admin/mails/${key}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        setMails(mails.filter(mail => mail.key !== key));
      }
    } catch (error) {
      console.error('Failed to delete mail:', error);
    }
  };

  useEffect(() => {
    fetchMails();
  }, []);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Container>
      <Header $isDark={isDark}>
        <Title $isDark={isDark}>받은 메일</Title>
        <RefreshButton 
          $isDark={isDark} 
          onClick={fetchMails}
          disabled={loading}
        >
          <RefreshCw style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          새로고침
        </RefreshButton>
      </Header>

      {mails.length === 0 ? (
        <EmptyState $isDark={isDark}>
          <Mail />
          <p>받은 메일이 없습니다</p>
        </EmptyState>
      ) : (
        <MailList>
          {mails.map((mail) => (
            <MailCard key={mail.key} $isDark={isDark}>
              <MailHeader>
                <MailInfo>
                  <MailMeta>
                    <MetaItem $isDark={isDark}>
                      <UserIcon />
                      {mail.name}
                    </MetaItem>
                    <MetaItem $isDark={isDark}>
                      <AtSign />
                      {mail.email}
                    </MetaItem>
                    <MetaItem $isDark={isDark}>
                      <Calendar />
                      {formatDate(mail.timestamp)}
                    </MetaItem>
                  </MailMeta>
                </MailInfo>
                <DeleteButton 
                  $isDark={isDark}
                  onClick={() => deleteMail(mail.key)}
                >
                  <Trash2 />
                  삭제
                </DeleteButton>
              </MailHeader>
              <MailMessage $isDark={isDark}>{mail.message}</MailMessage>
            </MailCard>
          ))}
        </MailList>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Container>
  );
}

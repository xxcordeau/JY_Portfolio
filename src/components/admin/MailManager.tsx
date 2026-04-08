import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Trash2, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../contexts/ThemeContext';
import type { DbContactMessage } from '../../lib/types/database';
import {
  PageHeader, PageTitle, PageSubtitle,
  Card, PrimaryButton, DestructiveButton, GhostButton,
  Table, Badge, EmptyState
} from './AdminStyles';

const ActionCell = styled.div`
  display: flex;
  gap: 4px;
  justify-content: flex-end;
`;

const MessageCell = styled.div<{ $isDark: boolean }>`
  max-width: 400px;
  font-size: 13px;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
`;

const ExpandedMessage = styled.div<{ $isDark: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.5);
`;

const MessageDialog = styled.div<{ $isDark: boolean }>`
  background: ${p => p.$isDark ? '#1a1a1a' : '#ffffff'};
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'};
  border-radius: 16px;
  padding: 32px;
  max-width: 560px;
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DialogTitle = styled.h3<{ $isDark: boolean }>`
  font-size: 18px;
  font-weight: 600;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
`;

const DialogMeta = styled.div`
  font-size: 13px;
  color: #86868b;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DialogBody = styled.div<{ $isDark: boolean }>`
  font-size: 15px;
  line-height: 1.7;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 400px;
  overflow-y: auto;
`;

const DeleteConfirm = styled.div<{ $isDark: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.5);
`;

const DeleteDialog = styled.div<{ $isDark: boolean }>`
  background: ${p => p.$isDark ? '#1a1a1a' : '#ffffff'};
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'};
  border-radius: 16px;
  padding: 32px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DialogActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 8px;
`;

export default function MailManager() {
  const { isDark } = useTheme();
  const [messages, setMessages] = useState<DbContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState<DbContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    setMessages((data as DbContactMessage[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const toggleRead = async (msg: DbContactMessage) => {
    await supabase.from('contact_messages').update({ is_read: !msg.is_read }).eq('id', msg.id);
    fetchMessages();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await supabase.from('contact_messages').delete().eq('id', deleteTarget);
    setDeleteTarget(null);
    fetchMessages();
  };

  const openMessage = async (msg: DbContactMessage) => {
    setSelectedMsg(msg);
    if (!msg.is_read) {
      await supabase.from('contact_messages').update({ is_read: true }).eq('id', msg.id);
      fetchMessages();
    }
  };

  const formatDate = (ts: string) => {
    return new Date(ts).toLocaleString('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <>
      <PageHeader>
        <div>
          <PageTitle $isDark={isDark}>받은 메일</PageTitle>
          <PageSubtitle>
            총 {messages.length}개 · 읽지 않음 {unreadCount}개
          </PageSubtitle>
        </div>
        <PrimaryButton onClick={fetchMessages} disabled={loading}>
          <RefreshCw style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          새로고침
        </PrimaryButton>
      </PageHeader>

      <Card $isDark={isDark}>
        {loading ? (
          <EmptyState $isDark={isDark}>불러오는 중...</EmptyState>
        ) : messages.length === 0 ? (
          <EmptyState $isDark={isDark}>받은 메일이 없습니다</EmptyState>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <Table $isDark={isDark}>
              <thead>
                <tr>
                  <th style={{ width: 40 }}></th>
                  <th style={{ width: 120 }}>이름</th>
                  <th style={{ width: 180 }}>이메일</th>
                  <th>메시지</th>
                  <th style={{ width: 140 }}>날짜</th>
                  <th style={{ width: 100, textAlign: 'right' }}>관리</th>
                </tr>
              </thead>
              <tbody>
                {messages.map(msg => (
                  <tr key={msg.id} style={{ cursor: 'pointer', fontWeight: msg.is_read ? 'normal' : '600' }}
                    onClick={() => openMessage(msg)}>
                    <td>
                      <Badge $variant={msg.is_read ? 'default' : 'success'} $isDark={isDark}>
                        {msg.is_read ? '읽음' : 'NEW'}
                      </Badge>
                    </td>
                    <td>{msg.name}</td>
                    <td style={{ fontSize: 13, color: '#86868b' }}>{msg.email}</td>
                    <td>
                      <MessageCell $isDark={isDark}>{msg.message}</MessageCell>
                    </td>
                    <td style={{ fontSize: 13, color: '#86868b' }}>{formatDate(msg.created_at)}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <ActionCell>
                        <GhostButton $isDark={isDark} onClick={() => toggleRead(msg)}
                          title={msg.is_read ? '읽지 않음으로' : '읽음으로'}>
                          {msg.is_read ? <EyeOff /> : <Eye />}
                        </GhostButton>
                        <GhostButton $isDark={isDark} onClick={() => setDeleteTarget(msg.id)} style={{ color: '#d4183d' }}>
                          <Trash2 />
                        </GhostButton>
                      </ActionCell>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card>

      {selectedMsg && (
        <ExpandedMessage $isDark={isDark} onClick={() => setSelectedMsg(null)}>
          <MessageDialog $isDark={isDark} onClick={e => e.stopPropagation()}>
            <DialogTitle $isDark={isDark}>{selectedMsg.name}님의 메시지</DialogTitle>
            <DialogMeta>
              <span>이메일: {selectedMsg.email}</span>
              <span>날짜: {formatDate(selectedMsg.created_at)}</span>
            </DialogMeta>
            <DialogBody $isDark={isDark}>{selectedMsg.message}</DialogBody>
            <DialogActions>
              <PrimaryButton onClick={() => setSelectedMsg(null)}>닫기</PrimaryButton>
            </DialogActions>
          </MessageDialog>
        </ExpandedMessage>
      )}

      {deleteTarget && (
        <DeleteConfirm $isDark={isDark} onClick={() => setDeleteTarget(null)}>
          <DeleteDialog $isDark={isDark} onClick={e => e.stopPropagation()}>
            <DialogTitle $isDark={isDark}>메시지 삭제</DialogTitle>
            <DestructiveButton onClick={handleDelete}>삭제</DestructiveButton>
            <PrimaryButton onClick={() => setDeleteTarget(null)}>취소</PrimaryButton>
          </DeleteDialog>
        </DeleteConfirm>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </>
  );
}

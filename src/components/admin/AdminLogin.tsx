import { useState } from 'react';
import styled from 'styled-components';
import { Lock, Eye, EyeOff, Mail } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const LoginContainer = styled.div<{ $isDark: boolean }>`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$isDark ? '#000' : '#ffffff'};
  padding: 20px;
  transition: background 0.3s ease;
`;

const LoginCard = styled.div<{ $isDark: boolean }>`
  background: ${props => props.$isDark
    ? 'rgba(22, 22, 24, 0.88)'
    : 'rgba(255, 255, 255, 0.88)'};
  border: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.07)'};
  border-radius: 24px;
  padding: 48px;
  width: 100%;
  max-width: 420px;
  backdrop-filter: blur(28px) saturate(1.6);
  -webkit-backdrop-filter: blur(28px) saturate(1.6);
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 32px 24px;
  }
`;

const Title = styled.h1<{ $isDark: boolean }>`
  font-size: 28px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  text-align: center;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
  transition: color 0.3s ease;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #86868b;
  text-align: center;
  margin: 0 0 32px 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #86868b;
  display: flex;
  align-items: center;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const Input = styled.input<{ $isDark: boolean; $hasLeftIcon?: boolean }>`
  width: 100%;
  padding: ${props => props.$hasLeftIcon ? '16px 48px 16px 44px' : '16px 48px 16px 16px'};
  font-size: 15px;
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
  border: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'};
  border-radius: 14px;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  transition: all 0.3s ease;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${props => props.$isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'};
    background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'};
  }

  &::placeholder {
    color: #86868b;
  }
`;

const ToggleButton = styled.button<{ $isDark: boolean }>`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #86868b;
  transition: color 0.2s ease;

  &:hover {
    color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const SubmitButton = styled.button<{ $isDark: boolean }>`
  width: 100%;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#000' : '#fff'};
  background: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  border: none;
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
  letter-spacing: -0.3px;
  margin-top: 4px;

  &:hover:not(:disabled) {
    opacity: 0.85;
    transform: scale(1.01);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  padding: 12px 16px;
  background: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.3);
  border-radius: 8px;
  color: #ff3b30;
  font-size: 14px;
  text-align: center;
`;

interface AdminLoginProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const { isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await onLogin(email, password);
      if (!success) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch {
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer $isDark={isDark}>
      <LoginCard $isDark={isDark}>
        <Title $isDark={isDark}>관리자 로그인</Title>
        <Subtitle>포트폴리오 관리자 페이지에 로그인하세요</Subtitle>

        <Form onSubmit={handleSubmit}>
          <InputWrapper>
            <InputIcon><Mail /></InputIcon>
            <Input
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              $isDark={isDark}
              $hasLeftIcon
              disabled={loading}
              autoComplete="email"
            />
          </InputWrapper>

          <InputWrapper>
            <InputIcon><Lock /></InputIcon>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              $isDark={isDark}
              $hasLeftIcon
              disabled={loading}
              autoComplete="current-password"
            />
            <ToggleButton
              type="button"
              $isDark={isDark}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </ToggleButton>
          </InputWrapper>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton
            type="submit"
            $isDark={isDark}
            disabled={loading || !email || !password}
          >
            {loading ? '로그인 중...' : '로그인'}
          </SubmitButton>
        </Form>
      </LoginCard>
    </LoginContainer>
  );
}

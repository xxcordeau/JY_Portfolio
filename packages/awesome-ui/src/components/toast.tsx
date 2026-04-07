import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X, XCircle } from 'lucide-react';

const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;

  @media (max-width: 768px) {
    top: auto;
    bottom: 80px;
    left: 20px;
    right: 20px;
  }
`;

const ToastItem = styled.div<{ 
  $isDark?: boolean; 
  $variant?: 'success' | 'error' | 'warning' | 'info';
  $isExiting?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 300px;
  max-width: 400px;
  padding: 16px;
  background: ${props => props.$isDark 
    ? 'rgba(30, 30, 30, 0.95)' 
    : 'rgba(255, 255, 255, 0.95)'};
  backdrop-filter: blur(20px);
  border: 1px solid ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  pointer-events: auto;
  animation: ${props => props.$isExiting ? 'slideOut' : 'slideIn'} 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }

  @media (max-width: 768px) {
    min-width: auto;
    width: 100%;
    
    @keyframes slideIn {
      from {
        transform: translateY(100px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @keyframes slideOut {
      from {
        transform: translateY(0);
        opacity: 1;
      }
      to {
        transform: translateY(100px);
        opacity: 0;
      }
    }
  }
`;

const IconWrapper = styled.div<{ 
  $variant?: 'success' | 'error' | 'warning' | 'info';
  $isDark?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${props => {
    switch (props.$variant) {
      case 'success': return props.$isDark ? '#32D74B' : '#34C759';
      case 'error': return props.$isDark ? '#FF453A' : '#FF3B30';
      case 'warning': return props.$isDark ? '#FF9F0A' : '#FF9500';
      case 'info': return props.$isDark ? '#4ECDC4' : '#007AFF';
      default: return props.$isDark ? '#f5f5f7' : '#1d1d1f';
    }
  }};

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.div<{ $isDark?: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
`;

const Message = styled.div<{ $isDark?: boolean }>`
  font-size: 13px;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  line-height: 1.4;
`;

const CloseButton = styled.button<{ $isDark?: boolean }>`
  background: transparent;
  border: none;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export interface ToastData {
  id: string;
  title?: string;
  message: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastItemWithExit extends ToastData {
  isExiting: boolean;
}

let toastCounter = 0;
const toastListeners: Set<(toasts: ToastItemWithExit[]) => void> = new Set();
let currentToasts: ToastItemWithExit[] = [];

const notifyListeners = () => {
  toastListeners.forEach(listener => listener([...currentToasts]));
};

export const toast = {
  success: (message: string, title?: string, duration = 3000) => {
    const id = `toast-${++toastCounter}`;
    currentToasts.push({ id, title, message, variant: 'success', duration, isExiting: false });
    notifyListeners();
    setTimeout(() => toast.dismiss(id), duration);
  },
  error: (message: string, title?: string, duration = 4000) => {
    const id = `toast-${++toastCounter}`;
    currentToasts.push({ id, title, message, variant: 'error', duration, isExiting: false });
    notifyListeners();
    setTimeout(() => toast.dismiss(id), duration);
  },
  warning: (message: string, title?: string, duration = 3500) => {
    const id = `toast-${++toastCounter}`;
    currentToasts.push({ id, title, message, variant: 'warning', duration, isExiting: false });
    notifyListeners();
    setTimeout(() => toast.dismiss(id), duration);
  },
  info: (message: string, title?: string, duration = 3000) => {
    const id = `toast-${++toastCounter}`;
    currentToasts.push({ id, title, message, variant: 'info', duration, isExiting: false });
    notifyListeners();
    setTimeout(() => toast.dismiss(id), duration);
  },
  dismiss: (id: string) => {
    const toastIndex = currentToasts.findIndex(t => t.id === id);
    if (toastIndex !== -1) {
      currentToasts[toastIndex].isExiting = true;
      notifyListeners();
      setTimeout(() => {
        currentToasts = currentToasts.filter(t => t.id !== id);
        notifyListeners();
      }, 300);
    }
  }
};

export interface ToastProviderProps {
  isDark?: boolean;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ isDark = false }) => {
  const [toasts, setToasts] = useState<ToastItemWithExit[]>([]);

  useEffect(() => {
    toastListeners.add(setToasts);
    return () => {
      toastListeners.delete(setToasts);
    };
  }, []);

  const getIcon = (variant?: 'success' | 'error' | 'warning' | 'info') => {
    switch (variant) {
      case 'success': return <CheckCircle />;
      case 'error': return <XCircle />;
      case 'warning': return <AlertCircle />;
      case 'info': return <Info />;
      default: return <Info />;
    }
  };

  if (toasts.length === 0) return null;

  return (
    <ToastContainer>
      {toasts.map((toast) => (
        <ToastItem 
          key={toast.id} 
          $isDark={isDark} 
          $variant={toast.variant}
          $isExiting={toast.isExiting}
        >
          <IconWrapper $variant={toast.variant} $isDark={isDark}>
            {getIcon(toast.variant)}
          </IconWrapper>
          <Content>
            {toast.title && <Title $isDark={isDark}>{toast.title}</Title>}
            <Message $isDark={isDark}>{toast.message}</Message>
          </Content>
          <CloseButton 
            $isDark={isDark}
            onClick={() => toast.dismiss(toast.id)}
          >
            <X />
          </CloseButton>
        </ToastItem>
      ))}
    </ToastContainer>
  );
};

// Snackbar is an alias for Toast
export const Snackbar = ToastProvider;
export const snackbar = toast;

import * as React from "react";
import styled from "styled-components";

const StyledCard = styled.div<{ $isDark?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 24px;
  border-radius: 12px;
  border: 1px solid;
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.8)'};
  border-color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
  backdrop-filter: blur(20px);
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  box-shadow: ${props => props.$isDark 
    ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
    : '0 4px 20px rgba(0, 0, 0, 0.05)'};
`;

const StyledCardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 24px 24px 0;
`;

const StyledCardTitle = styled.h4<{ $isDark?: boolean }>`
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
`;

const StyledCardDescription = styled.p<{ $isDark?: boolean }>`
  font-size: 14px;
  line-height: 1.5;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
`;

const StyledCardContent = styled.div`
  padding: 0 24px;
  
  &:last-child {
    padding-bottom: 24px;
  }
`;

const StyledCardFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 24px 24px;
`;

interface CardProps extends React.ComponentProps<"div"> {
  isDark?: boolean;
}

interface CardTitleProps extends React.ComponentProps<"h4"> {
  isDark?: boolean;
}

interface CardDescriptionProps extends React.ComponentProps<"p"> {
  isDark?: boolean;
}

function Card({ className, isDark, ...props }: CardProps) {
  return <StyledCard $isDark={isDark} className={className} {...props} />;
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <StyledCardHeader className={className} {...props} />;
}

function CardTitle({ className, isDark, ...props }: CardTitleProps) {
  return <StyledCardTitle $isDark={isDark} className={className} {...props} />;
}

function CardDescription({ className, isDark, ...props }: CardDescriptionProps) {
  return <StyledCardDescription $isDark={isDark} className={className} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <StyledCardContent className={className} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <StyledCardFooter className={className} {...props} />;
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};

import * as React from "react";
import styled from "styled-components";
import { Check } from "lucide-react";

const StepperContainer = styled.div`
  width: 100%;
`;

const StepsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
`;

const StepItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
`;

const StepCircle = styled.div<{ 
  $isDark?: boolean;
  $active?: boolean;
  $completed?: boolean;
}>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  z-index: 2;
  position: relative;
  
  ${props => {
    if (props.$completed) {
      return `
        background: ${props.$isDark ? '#4ECDC4' : '#007AFF'};
        color: white;
        border: 2px solid ${props.$isDark ? '#4ECDC4' : '#007AFF'};
      `;
    } else if (props.$active) {
      return `
        background: ${props.$isDark ? 'rgba(78, 205, 196, 0.1)' : 'rgba(0, 122, 255, 0.1)'};
        color: ${props.$isDark ? '#4ECDC4' : '#007AFF'};
        border: 2px solid ${props.$isDark ? '#4ECDC4' : '#007AFF'};
      `;
    } else {
      return `
        background: ${props.$isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
        color: ${props.$isDark ? '#86868b' : '#6e6e73'};
        border: 2px solid ${props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
      `;
    }
  }}
`;

const StepLine = styled.div<{ 
  $isDark?: boolean;
  $completed?: boolean;
}>`
  position: absolute;
  top: 20px;
  left: calc(50% + 20px);
  right: calc(-50% + 20px);
  height: 2px;
  z-index: 1;
  transition: all 0.3s ease;
  
  background: ${props => 
    props.$completed 
      ? (props.$isDark ? '#4ECDC4' : '#007AFF')
      : (props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)')
  };
`;

const StepLabel = styled.div<{ 
  $isDark?: boolean;
  $active?: boolean;
}>`
  margin-top: 8px;
  font-size: 13px;
  font-weight: ${props => props.$active ? '600' : '500'};
  color: ${props => {
    if (props.$active) {
      return props.$isDark ? '#4ECDC4' : '#007AFF';
    } else {
      return props.$isDark ? '#86868b' : '#6e6e73';
    }
  }};
  text-align: center;
`;

const StepContent = styled.div`
  width: 100%;
`;

interface Step {
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  isDark?: boolean;
  children?: React.ReactNode;
}

function Stepper({ steps, currentStep, isDark, children }: StepperProps) {
  return (
    <StepperContainer>
      <StepsContainer>
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isLast = index === steps.length - 1;
          
          return (
            <StepItem key={index}>
              <StepCircle 
                $isDark={isDark} 
                $active={isActive}
                $completed={isCompleted}
              >
                {isCompleted ? <Check style={{ width: '20px', height: '20px' }} /> : index + 1}
              </StepCircle>
              {!isLast && (
                <StepLine 
                  $isDark={isDark}
                  $completed={isCompleted}
                />
              )}
              <StepLabel $isDark={isDark} $active={isActive}>
                {step.label}
              </StepLabel>
            </StepItem>
          );
        })}
      </StepsContainer>
      {children && (
        <StepContent>
          {children}
        </StepContent>
      )}
    </StepperContainer>
  );
}

export { Stepper };
export type { Step };

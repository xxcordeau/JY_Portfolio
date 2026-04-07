import styled from 'styled-components';
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const PickerContainer = styled.div<{ $isDark?: boolean }>`
  display: inline-block;
  position: relative;
`;

const PickerInput = styled.button<{ $isDark?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.2)' 
    : 'rgba(0, 0, 0, 0.2)'};
  background: ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(255, 255, 255, 1)'};
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$isDark 
      ? 'rgba(255, 255, 255, 0.08)' 
      : 'rgba(0, 0, 0, 0.02)'};
  }

  svg {
    width: 16px;
    height: 16px;
    opacity: 0.6;
  }
`;

const Dropdown = styled.div<{ $isDark?: boolean; $show?: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 9999;
  padding: 16px;
  border-radius: 12px;
  background: ${props => props.$isDark 
    ? 'rgba(30, 30, 30, 0.98)' 
    : 'rgba(255, 255, 255, 0.98)'};
  border: 1px solid ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
  backdrop-filter: blur(20px);
  box-shadow: ${props => props.$isDark 
    ? '0 8px 32px rgba(0, 0, 0, 0.5)' 
    : '0 8px 32px rgba(0, 0, 0, 0.15)'};
  opacity: ${props => props.$show ? 1 : 0};
  visibility: ${props => props.$show ? 'visible' : 'hidden'};
  transform: translateY(${props => props.$show ? 0 : -10}px);
  transition: all 0.2s;
`;

// Calendar Styles
const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const HeaderButton = styled.button<{ $isDark?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$isDark 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.05)'};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const MonthYear = styled.div<{ $isDark?: boolean }>`
  font-size: 15px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
`;

const DayLabel = styled.div<{ $isDark?: boolean }>`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
`;

const DayCell = styled.button<{ $isDark?: boolean; $selected?: boolean; $today?: boolean; $disabled?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 6px;
  border: none;
  background: ${props => {
    if (props.$selected) return '#007AFF';
    if (props.$today) return props.$isDark 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.05)';
    return 'transparent';
  }};
  color: ${props => {
    if (props.$selected) return '#ffffff';
    if (props.$disabled) return props.$isDark 
      ? 'rgba(255, 255, 255, 0.3)' 
      : 'rgba(0, 0, 0, 0.3)';
    return props.$isDark ? '#f5f5f7' : '#1d1d1f';
  }};
  font-size: 14px;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${props => {
      if (props.$selected) return '#0051D5';
      return props.$isDark 
        ? 'rgba(255, 255, 255, 0.1)' 
        : 'rgba(0, 0, 0, 0.05)';
    }};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

// Time Picker Styles
const TimeContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const TimeColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TimeLabel = styled.div<{ $isDark?: boolean }>`
  font-size: 12px;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  text-align: center;
  margin-bottom: 4px;
`;

const TimeInput = styled.input<{ $isDark?: boolean }>`
  width: 60px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.2)' 
    : 'rgba(0, 0, 0, 0.2)'};
  background: ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(255, 255, 255, 1)'};
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  font-size: 14px;
  text-align: center;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #007AFF;
  }
`;

const TimeSeparator = styled.div<{ $isDark?: boolean }>`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin-top: 24px;
`;

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  isDark?: boolean;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select date',
  isDark = false,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value || new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();

    return { daysInMonth, startDay, year, month };
  };

  const { daysInMonth, startDay, year, month } = getDaysInMonth(currentMonth);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDayClick = (day: number) => {
    const newDate = new Date(year, month, day);
    onChange?.(newDate);
    setIsOpen(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const today = new Date();
  const isToday = (day: number) => {
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };

  const isSelected = (day: number) => {
    if (!value) return false;
    return day === value.getDate() && 
           month === value.getMonth() && 
           year === value.getFullYear();
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <PickerContainer className={className}>
      <PickerInput $isDark={isDark} onClick={() => setIsOpen(!isOpen)}>
        <CalendarIcon />
        {value ? formatDate(value) : placeholder}
      </PickerInput>
      <Dropdown $isDark={isDark} $show={isOpen}>
        <CalendarHeader>
          <HeaderButton $isDark={isDark} onClick={handlePrevMonth}>
            <ChevronLeft />
          </HeaderButton>
          <MonthYear $isDark={isDark}>
            {monthNames[month]} {year}
          </MonthYear>
          <HeaderButton $isDark={isDark} onClick={handleNextMonth}>
            <ChevronRight />
          </HeaderButton>
        </CalendarHeader>
        <CalendarGrid>
          {dayLabels.map(day => (
            <DayLabel key={day} $isDark={isDark}>
              {day}
            </DayLabel>
          ))}
          {Array.from({ length: startDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            return (
              <DayCell
                key={day}
                $isDark={isDark}
                $selected={isSelected(day)}
                $today={isToday(day)}
                onClick={() => handleDayClick(day)}
              >
                {day}
              </DayCell>
            );
          })}
        </CalendarGrid>
      </Dropdown>
    </PickerContainer>
  );
};

export interface TimePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  isDark?: boolean;
  className?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select time',
  isDark = false,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState(value?.getHours() || 12);
  const [minutes, setMinutes] = useState(value?.getMinutes() || 0);

  const handleApply = () => {
    const newDate = new Date();
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    onChange?.(newDate);
    setIsOpen(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <PickerContainer className={className}>
      <PickerInput $isDark={isDark} onClick={() => setIsOpen(!isOpen)}>
        <Clock />
        {value ? formatTime(value) : placeholder}
      </PickerInput>
      <Dropdown $isDark={isDark} $show={isOpen}>
        <TimeContainer>
          <TimeColumn>
            <TimeLabel $isDark={isDark}>Hours</TimeLabel>
            <TimeInput
              type="number"
              min="0"
              max="23"
              value={hours}
              onChange={(e) => setHours(parseInt(e.target.value) || 0)}
              $isDark={isDark}
            />
          </TimeColumn>
          <TimeSeparator $isDark={isDark}>:</TimeSeparator>
          <TimeColumn>
            <TimeLabel $isDark={isDark}>Minutes</TimeLabel>
            <TimeInput
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
              $isDark={isDark}
            />
          </TimeColumn>
        </TimeContainer>
        <HeaderButton
          $isDark={isDark}
          onClick={handleApply}
          style={{ width: '100%', marginTop: 12 }}
        >
          Apply
        </HeaderButton>
      </Dropdown>
    </PickerContainer>
  );
};

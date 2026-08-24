"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import styled from "styled-components";

const StyledSliderRoot = styled(SliderPrimitive.Root)`
  position: relative;
  display: flex;
  width: 100%;
  touch-action: none;
  align-items: center;
  user-select: none;
  
  &[data-disabled] {
    opacity: 0.5;
  }
  
  &[data-orientation="vertical"] {
    height: 100%;
    min-height: 176px;
    width: auto;
    flex-direction: column;
  }
`;

const StyledSliderTrack = styled(SliderPrimitive.Track)<{ $isDark?: boolean }>`
  position: relative;
  flex-grow: 1;
  overflow: hidden;
  border-radius: 9999px;
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  
  &[data-orientation="horizontal"] {
    height: 8px;
    width: 100%;
  }
  
  &[data-orientation="vertical"] {
    height: 100%;
    width: 6px;
  }
`;

const StyledSliderRange = styled(SliderPrimitive.Range)<{ $isDark?: boolean }>`
  position: absolute;
  background: ${props => props.$isDark ? '#4ECDC4' : '#007AFF'};
  
  &[data-orientation="horizontal"] {
    height: 100%;
  }
  
  &[data-orientation="vertical"] {
    width: 100%;
  }
`;

const StyledSliderThumb = styled(SliderPrimitive.Thumb)<{ $isDark?: boolean }>`
  display: block;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 2px solid ${props => props.$isDark ? '#4ECDC4' : '#007AFF'};
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  cursor: pointer;
  outline: none;
  
  &:hover {
    box-shadow: 0 0 0 4px ${props => props.$isDark ? 'rgba(78, 205, 196, 0.2)' : 'rgba(0, 122, 255, 0.2)'};
  }
  
  &:focus-visible {
    box-shadow: 0 0 0 4px ${props => props.$isDark ? 'rgba(78, 205, 196, 0.2)' : 'rgba(0, 122, 255, 0.2)'};
  }
  
  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
`;

interface SliderProps extends React.ComponentProps<typeof SliderPrimitive.Root> {
  isDark?: boolean;
}

function Slider({
  className,
  isDark,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: SliderProps) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  );

  return (
    <StyledSliderRoot
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={className}
      {...props}
    >
      <StyledSliderTrack $isDark={isDark}>
        <StyledSliderRange $isDark={isDark} />
      </StyledSliderTrack>
      {Array.from({ length: _values.length }, (_, index) => (
        <StyledSliderThumb key={index} $isDark={isDark} />
      ))}
    </StyledSliderRoot>
  );
}

export { Slider };

import styled from 'styled-components';
import React from 'react';
import { ChevronRight, MoreVertical } from 'lucide-react';

const ListContainer = styled.div<{ $isDark?: boolean }>`
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(255, 255, 255, 1)'};
  border: 1px solid ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
  backdrop-filter: blur(20px);
`;

const ListHeader = styled.div<{ $isDark?: boolean }>`
  padding: 16px 20px;
  border-bottom: 1px solid ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
`;

const ListTitle = styled.h3<{ $isDark?: boolean }>`
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
`;

const ListItemStyled = styled.div<{ $isDark?: boolean; $clickable?: boolean; $selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  border-bottom: 1px solid ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.06)' 
    : 'rgba(0, 0, 0, 0.06)'};
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  transition: background 0.2s;
  background: ${props => props.$selected 
    ? props.$isDark 
      ? 'rgba(0, 122, 255, 0.15)' 
      : 'rgba(0, 122, 255, 0.08)'
    : 'transparent'};

  &:last-child {
    border-bottom: none;
  }

  ${props => props.$clickable && `
    &:hover {
      background: ${props.$selected
        ? props.$isDark 
          ? 'rgba(0, 122, 255, 0.2)' 
          : 'rgba(0, 122, 255, 0.12)'
        : props.$isDark 
          ? 'rgba(255, 255, 255, 0.05)' 
          : 'rgba(0, 0, 0, 0.03)'};
    }
  `}
`;

const IconWrapper = styled.div<{ $isDark?: boolean }>`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.08)' 
    : 'rgba(0, 0, 0, 0.05)'};

  svg {
    width: 20px;
    height: 20px;
    color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  }
`;

const ImageWrapper = styled.div`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.div<{ $isDark?: boolean }>`
  font-size: 15px;
  font-weight: 500;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Description = styled.div<{ $isDark?: boolean }>`
  font-size: 13px;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Meta = styled.div<{ $isDark?: boolean }>`
  flex-shrink: 0;
  font-size: 13px;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ActionButton = styled.button<{ $isDark?: boolean }>`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
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

export interface ListItem {
  id: string | number;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  image?: string;
  meta?: string;
  selected?: boolean;
}

export interface DataListProps {
  title?: string;
  items: ListItem[];
  onItemClick?: (item: ListItem) => void;
  onActionClick?: (item: ListItem) => void;
  showActions?: boolean;
  isDark?: boolean;
  className?: string;
}

export const DataList: React.FC<DataListProps> = ({
  title,
  items,
  onItemClick,
  onActionClick,
  showActions = false,
  isDark = false,
  className
}) => {
  return (
    <ListContainer $isDark={isDark} className={className}>
      {title && (
        <ListHeader $isDark={isDark}>
          <ListTitle $isDark={isDark}>{title}</ListTitle>
        </ListHeader>
      )}
      {items.map(item => (
        <ListItemStyled
          key={item.id}
          $isDark={isDark}
          $clickable={!!onItemClick}
          $selected={item.selected}
          onClick={() => onItemClick?.(item)}
        >
          {item.icon && (
            <IconWrapper $isDark={isDark}>
              {item.icon}
            </IconWrapper>
          )}
          {item.image && (
            <ImageWrapper>
              <img src={item.image} alt={item.title} />
            </ImageWrapper>
          )}
          <Content>
            <Title $isDark={isDark}>{item.title}</Title>
            {item.description && (
              <Description $isDark={isDark}>{item.description}</Description>
            )}
          </Content>
          {item.meta && (
            <Meta $isDark={isDark}>
              {item.meta}
            </Meta>
          )}
          {onItemClick && !showActions && (
            <ChevronRight style={{ width: 16, height: 16, opacity: 0.5 }} />
          )}
          {showActions && onActionClick && (
            <ActionButton
              $isDark={isDark}
              onClick={(e) => {
                e.stopPropagation();
                onActionClick(item);
              }}
            >
              <MoreVertical />
            </ActionButton>
          )}
        </ListItemStyled>
      ))}
    </ListContainer>
  );
};

// Grid Layout for Lists
const GridContainer = styled.div<{ $columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.$columns || 2}, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const GridItemStyled = styled.div<{ $isDark?: boolean; $clickable?: boolean }>`
  padding: 16px;
  border-radius: 12px;
  background: ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(255, 255, 255, 1)'};
  border: 1px solid ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  transition: all 0.2s;

  ${props => props.$clickable && `
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${props.$isDark 
        ? '0 8px 16px rgba(0, 0, 0, 0.3)' 
        : '0 8px 16px rgba(0, 0, 0, 0.1)'};
    }
  `}
`;

const GridImage = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
  background: ${props => props.theme.$isDark 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(0, 0, 0, 0.05)'};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const GridTitle = styled.h4<{ $isDark?: boolean }>`
  margin: 0 0 4px 0;
  font-size: 15px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
`;

const GridDescription = styled.p<{ $isDark?: boolean }>`
  margin: 0;
  font-size: 13px;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  line-height: 1.5;
`;

export interface GridListProps {
  items: ListItem[];
  columns?: number;
  onItemClick?: (item: ListItem) => void;
  isDark?: boolean;
  className?: string;
}

export const GridList: React.FC<GridListProps> = ({
  items,
  columns = 2,
  onItemClick,
  isDark = false,
  className
}) => {
  return (
    <GridContainer $columns={columns} className={className}>
      {items.map(item => (
        <GridItemStyled
          key={item.id}
          $isDark={isDark}
          $clickable={!!onItemClick}
          onClick={() => onItemClick?.(item)}
        >
          {item.image && (
            <GridImage theme={{ $isDark: isDark }}>
              <img src={item.image} alt={item.title} />
            </GridImage>
          )}
          <GridTitle $isDark={isDark}>{item.title}</GridTitle>
          {item.description && (
            <GridDescription $isDark={isDark}>{item.description}</GridDescription>
          )}
          {item.meta && (
            <Meta $isDark={isDark} style={{ marginTop: 8 }}>
              {item.meta}
            </Meta>
          )}
        </GridItemStyled>
      ))}
    </GridContainer>
  );
};

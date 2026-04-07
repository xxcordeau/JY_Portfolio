import styled from 'styled-components';
import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, File, FolderOpen } from 'lucide-react';

const TreeContainer = styled.div<{ $isDark?: boolean }>`
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
  padding: 12px;
`;

const TreeHeader = styled.div<{ $isDark?: boolean }>`
  padding: 8px 12px 16px;
  border-bottom: 1px solid ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
  margin-bottom: 12px;
`;

const TreeTitle = styled.h3<{ $isDark?: boolean }>`
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
`;

const TreeNodeContainer = styled.div<{ $level?: number }>`
  margin-left: ${props => (props.$level || 0) * 20}px;
`;

const NodeItem = styled.div<{ $isDark?: boolean; $selected?: boolean; $hasChildren?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
  background: ${props => {
    if (props.$selected) {
      return props.$isDark 
        ? 'rgba(0, 122, 255, 0.2)' 
        : 'rgba(0, 122, 255, 0.12)';
    }
    return 'transparent';
  }};

  &:hover {
    background: ${props => {
      if (props.$selected) {
        return props.$isDark 
          ? 'rgba(0, 122, 255, 0.25)' 
          : 'rgba(0, 122, 255, 0.15)';
      }
      return props.$isDark 
        ? 'rgba(255, 255, 255, 0.05)' 
        : 'rgba(0, 0, 0, 0.03)';
    }};
  }
`;

const ExpandIcon = styled.div<{ $isDark?: boolean; $expanded?: boolean }>`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  transition: transform 0.2s;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const NodeIcon = styled.div<{ $isDark?: boolean }>`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};

  svg {
    width: 16px;
    height: 16px;
  }
`;

const NodeLabel = styled.span<{ $isDark?: boolean }>`
  font-size: 14px;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  flex: 1;
`;

const NodeMeta = styled.span<{ $isDark?: boolean }>`
  font-size: 12px;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
`;

export interface TreeNode {
  id: string | number;
  label: string;
  icon?: React.ReactNode;
  meta?: string;
  children?: TreeNode[];
  data?: any;
}

interface TreeNodeProps {
  node: TreeNode;
  level: number;
  selectedId?: string | number;
  expandedIds: Set<string | number>;
  onToggle: (id: string | number) => void;
  onSelect?: (node: TreeNode) => void;
  isDark: boolean;
}

const TreeNodeComponent: React.FC<TreeNodeProps> = ({
  node,
  level,
  selectedId,
  expandedIds,
  onToggle,
  onSelect,
  isDark
}) => {
  const isExpanded = expandedIds.has(node.id);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedId === node.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      onToggle(node.id);
    }
    onSelect?.(node);
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      onToggle(node.id);
    }
  };

  const defaultIcon = hasChildren 
    ? (isExpanded ? <FolderOpen /> : <Folder />)
    : <File />;

  return (
    <>
      <NodeItem
        $isDark={isDark}
        $selected={isSelected}
        $hasChildren={hasChildren}
        onClick={handleClick}
      >
        <ExpandIcon
          $isDark={isDark}
          $expanded={isExpanded}
          onClick={handleExpandClick}
        >
          {hasChildren ? (
            isExpanded ? <ChevronDown /> : <ChevronRight />
          ) : (
            <div style={{ width: 14 }} />
          )}
        </ExpandIcon>
        <NodeIcon $isDark={isDark}>
          {node.icon || defaultIcon}
        </NodeIcon>
        <NodeLabel $isDark={isDark}>{node.label}</NodeLabel>
        {node.meta && <NodeMeta $isDark={isDark}>{node.meta}</NodeMeta>}
      </NodeItem>
      {hasChildren && isExpanded && (
        <TreeNodeContainer $level={1}>
          {node.children!.map(child => (
            <TreeNodeComponent
              key={child.id}
              node={child}
              level={level + 1}
              selectedId={selectedId}
              expandedIds={expandedIds}
              onToggle={onToggle}
              onSelect={onSelect}
              isDark={isDark}
            />
          ))}
        </TreeNodeContainer>
      )}
    </>
  );
};

export interface TreeViewProps {
  title?: string;
  data: TreeNode[];
  defaultExpandedIds?: Array<string | number>;
  selectedId?: string | number;
  onSelect?: (node: TreeNode) => void;
  isDark?: boolean;
  className?: string;
}

export const TreeView: React.FC<TreeViewProps> = ({
  title,
  data,
  defaultExpandedIds = [],
  selectedId,
  onSelect,
  isDark = false,
  className
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string | number>>(
    new Set(defaultExpandedIds)
  );

  const handleToggle = (id: string | number) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <TreeContainer $isDark={isDark} className={className}>
      {title && (
        <TreeHeader $isDark={isDark}>
          <TreeTitle $isDark={isDark}>{title}</TreeTitle>
        </TreeHeader>
      )}
      <TreeNodeContainer $level={0}>
        {data.map(node => (
          <TreeNodeComponent
            key={node.id}
            node={node}
            level={0}
            selectedId={selectedId}
            expandedIds={expandedIds}
            onToggle={handleToggle}
            onSelect={onSelect}
            isDark={isDark}
          />
        ))}
      </TreeNodeContainer>
    </TreeContainer>
  );
};

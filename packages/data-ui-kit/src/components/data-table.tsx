import styled from 'styled-components';
import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search, Filter } from 'lucide-react';

const TableContainer = styled.div<{ $isDark?: boolean }>`
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

const TableHeader = styled.div<{ $isDark?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
`;

const TableTitle = styled.h3<{ $isDark?: boolean }>`
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
`;

const TableControls = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const SearchInput = styled.input<{ $isDark?: boolean }>`
  padding: 8px 12px 8px 36px;
  border-radius: 8px;
  border: 1px solid ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.2)' 
    : 'rgba(0, 0, 0, 0.2)'};
  background: ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(0, 0, 0, 0.02)'};
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  font-size: 14px;
  outline: none;
  transition: all 0.2s;

  &::placeholder {
    color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  }

  &:focus {
    border-color: ${props => props.$isDark ? '#007AFF' : '#007AFF'};
    background: ${props => props.$isDark 
      ? 'rgba(255, 255, 255, 0.08)' 
      : 'rgba(255, 255, 255, 1)'};
  }
`;

const SearchWrapper = styled.div`
  position: relative;

  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    opacity: 0.5;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead<{ $isDark?: boolean }>`
  background: ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.03)' 
    : 'rgba(0, 0, 0, 0.02)'};
`;

const Th = styled.th<{ $isDark?: boolean; $sortable?: boolean }>`
  padding: 12px 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  border-bottom: 1px solid ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
  cursor: ${props => props.$sortable ? 'pointer' : 'default'};
  user-select: none;
  position: relative;

  &:hover {
    background: ${props => props.$sortable 
      ? props.$isDark 
        ? 'rgba(255, 255, 255, 0.05)' 
        : 'rgba(0, 0, 0, 0.03)'
      : 'transparent'};
  }
`;

const SortIcon = styled.span`
  display: inline-flex;
  margin-left: 4px;
  vertical-align: middle;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const Tbody = styled.tbody``;

const Tr = styled.tr<{ $isDark?: boolean; $hoverable?: boolean }>`
  border-bottom: 1px solid ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.06)' 
    : 'rgba(0, 0, 0, 0.06)'};

  &:last-child {
    border-bottom: none;
  }

  ${props => props.$hoverable && `
    &:hover {
      background: ${props.$isDark 
        ? 'rgba(255, 255, 255, 0.03)' 
        : 'rgba(0, 0, 0, 0.02)'};
    }
  `}
`;

const Td = styled.td<{ $isDark?: boolean }>`
  padding: 14px 16px;
  font-size: 14px;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
`;

const Pagination = styled.div<{ $isDark?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-top: 1px solid ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
`;

const PaginationInfo = styled.div<{ $isDark?: boolean }>`
  font-size: 13px;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const PaginationButton = styled.button<{ $isDark?: boolean; $active?: boolean }>`
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.2)' 
    : 'rgba(0, 0, 0, 0.2)'};
  background: ${props => {
    if (props.$active) {
      return '#007AFF';
    }
    return props.$isDark 
      ? 'rgba(255, 255, 255, 0.05)' 
      : 'rgba(0, 0, 0, 0.02)';
  }};
  color: ${props => {
    if (props.$active) return '#ffffff';
    return props.$isDark ? '#f5f5f7' : '#1d1d1f';
  }};
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${props => {
      if (props.$active) return '#0051D5';
      return props.$isDark 
        ? 'rgba(255, 255, 255, 0.1)' 
        : 'rgba(0, 0, 0, 0.05)';
    }};
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

export interface Column<T = any> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface DataTableProps<T = any> {
  title?: string;
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  isDark?: boolean;
  className?: string;
}

export const DataTable = <T extends Record<string, any>>({
  title,
  columns,
  data,
  pageSize = 10,
  searchable = true,
  searchPlaceholder = 'Search...',
  isDark = false,
  className
}: DataTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(row =>
      columns.some(col => {
        const value = row[col.key];
        return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columns]);

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        if (current.direction === 'asc') {
          return { key, direction: 'desc' };
        }
        return null;
      }
      return { key, direction: 'asc' };
    });
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, sortedData.length);

  return (
    <TableContainer $isDark={isDark} className={className}>
      {(title || searchable) && (
        <TableHeader $isDark={isDark}>
          {title && <TableTitle $isDark={isDark}>{title}</TableTitle>}
          {searchable && (
            <TableControls>
              <SearchWrapper>
                <Search />
                <SearchInput
                  $isDark={isDark}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </SearchWrapper>
            </TableControls>
          )}
        </TableHeader>
      )}

      <Table>
        <Thead $isDark={isDark}>
          <tr>
            {columns.map(column => (
              <Th
                key={column.key}
                $isDark={isDark}
                $sortable={column.sortable}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                {column.header}
                {column.sortable && (
                  <SortIcon>
                    {sortConfig?.key === column.key ? (
                      sortConfig.direction === 'asc' ? (
                        <ChevronUp />
                      ) : (
                        <ChevronDown />
                      )
                    ) : (
                      <ChevronDown style={{ opacity: 0.3 }} />
                    )}
                  </SortIcon>
                )}
              </Th>
            ))}
          </tr>
        </Thead>
        <Tbody>
          {paginatedData.map((row, rowIndex) => (
            <Tr key={rowIndex} $isDark={isDark} $hoverable>
              {columns.map(column => (
                <Td key={column.key} $isDark={isDark}>
                  {column.render 
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>

      {totalPages > 1 && (
        <Pagination $isDark={isDark}>
          <PaginationInfo $isDark={isDark}>
            Showing {startItem}-{endItem} of {sortedData.length}
          </PaginationInfo>
          <PaginationButtons>
            <PaginationButton
              type="button"
              $isDark={isDark}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </PaginationButton>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                if (totalPages <= 7) return true;
                if (page === 1 || page === totalPages) return true;
                if (Math.abs(page - currentPage) <= 1) return true;
                return false;
              })
              .map((page, index, array) => {
                const showEllipsis = index > 0 && page - array[index - 1] > 1;
                return (
                  <React.Fragment key={page}>
                    {showEllipsis && <span style={{ padding: '0 4px' }}>...</span>}
                    <PaginationButton
                      type="button"
                      $isDark={isDark}
                      $active={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationButton>
                  </React.Fragment>
                );
              })}
            <PaginationButton
              type="button"
              $isDark={isDark}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </PaginationButton>
          </PaginationButtons>
        </Pagination>
      )}
    </TableContainer>
  );
};

import { useState } from 'react';
import styled from 'styled-components';
import { Search, Grid, List, Star } from 'lucide-react';

const DemoContainer = styled.div<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? '#0a0a0a' : '#f5f5f7'};
  border-radius: 16px;
  padding: 40px;
  margin: 40px 0;
  transition: background 0.3s ease;

  @media (max-width: 768px) {
    padding: 24px;
    margin: 24px 0;
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchBox = styled.div<{ $isDark: boolean }>`
  flex: 1;
  position: relative;
  min-width: 200px;

  input {
    width: 100%;
    padding: 12px 16px 12px 44px;
    border-radius: 12px;
    border: 1px solid ${props => props.$isDark ? '#2d2d2d' : '#d2d2d7'};
    background: ${props => props.$isDark ? '#1d1d1f' : '#ffffff'};
    color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
    font-size: 14px;
    outline: none;
    transition: all 0.2s ease;

    &:focus {
      border-color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
    }

    &::placeholder {
      color: #86868b;
    }
  }

  svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #86868b;
    width: 18px;
    height: 18px;
  }
`;

const ViewToggle = styled.div<{ $isDark: boolean }>`
  display: flex;
  gap: 8px;
  background: ${props => props.$isDark ? '#1d1d1f' : '#ffffff'};
  padding: 4px;
  border-radius: 10px;
  border: 1px solid ${props => props.$isDark ? '#2d2d2d' : '#d2d2d7'};
`;

const ViewButton = styled.button<{ $isDark: boolean; $active: boolean }>`
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  background: ${props => props.$active 
    ? props.$isDark ? '#2d2d2d' : '#f5f5f7'
    : 'transparent'};
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$isDark ? '#2d2d2d' : '#f5f5f7'};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const BooksGrid = styled.div<{ $view: 'grid' | 'list' }>`
  display: grid;
  grid-template-columns: ${props => props.$view === 'grid' 
    ? 'repeat(auto-fill, minmax(160px, 1fr))' 
    : '1fr'};
  gap: ${props => props.$view === 'grid' ? '24px' : '16px'};

  @media (max-width: 768px) {
    grid-template-columns: ${props => props.$view === 'grid' 
      ? 'repeat(auto-fill, minmax(120px, 1fr))' 
      : '1fr'};
    gap: ${props => props.$view === 'grid' ? '16px' : '12px'};
  }
`;

const BookCard = styled.div<{ $isDark: boolean; $view: 'grid' | 'list'; $read: boolean }>`
  background: ${props => props.$isDark ? '#1d1d1f' : '#ffffff'};
  border-radius: 12px;
  padding: ${props => props.$view === 'grid' ? '16px' : '20px'};
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.$read 
    ? props.$isDark ? '#3d3d3d' : '#86868b'
    : 'transparent'};
  display: ${props => props.$view === 'list' ? 'flex' : 'block'};
  align-items: ${props => props.$view === 'list' ? 'center' : 'normal'};
  gap: ${props => props.$view === 'list' ? '20px' : '0'};
  opacity: ${props => props.$read ? 0.6 : 1};

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px ${props => props.$isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)'};
  }

  @media (max-width: 768px) {
    padding: ${props => props.$view === 'grid' ? '12px' : '16px'};
  }
`;

const BookCover = styled.div<{ $color: string; $view: 'grid' | 'list' }>`
  width: ${props => props.$view === 'list' ? '80px' : '100%'};
  height: ${props => props.$view === 'list' ? '120px' : '200px'};
  background: ${props => props.$color};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props.$view === 'grid' ? '12px' : '0'};
  font-size: ${props => props.$view === 'list' ? '32px' : '48px'};
  flex-shrink: 0;

  @media (max-width: 768px) {
    height: ${props => props.$view === 'list' ? '100px' : '150px'};
    width: ${props => props.$view === 'list' ? '60px' : '100%'};
    font-size: ${props => props.$view === 'list' ? '24px' : '36px'};
  }
`;

const BookInfo = styled.div`
  flex: 1;
`;

const BookTitle = styled.h4<{ $isDark: boolean }>`
  font-size: 15px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 6px 0;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const BookAuthor = styled.p`
  font-size: 13px;
  color: #86868b;
  margin: 0 0 8px 0;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const BookStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #86868b;

  svg {
    width: 14px;
    height: 14px;
  }
`;

interface Book {
  id: number;
  title: string;
  author: string;
  color: string;
  emoji: string;
  read: boolean;
}

const initialBooks: Book[] = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', color: '#FFB6C1', emoji: '📚', read: true },
  { id: 2, title: '1984', author: 'George Orwell', color: '#87CEEB', emoji: '📖', read: false },
  { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', color: '#98FB98', emoji: '📕', read: true },
  { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', color: '#DDA0DD', emoji: '📗', read: false },
  { id: 5, title: 'The Catcher in the Rye', author: 'J.D. Salinger', color: '#F0E68C', emoji: '📘', read: true },
  { id: 6, title: 'Animal Farm', author: 'George Orwell', color: '#FFB347', emoji: '📙', read: false },
  { id: 7, title: 'Brave New World', author: 'Aldous Huxley', color: '#B0E0E6', emoji: '📔', read: false },
  { id: 8, title: 'The Hobbit', author: 'J.R.R. Tolkien', color: '#D8BFD8', emoji: '📓', read: true },
];

interface BookCollectionDemoProps {
  isDark: boolean;
  language: 'ko' | 'en';
}

const translations = {
  ko: {
    search: '책 검색...',
    grid: '그리드',
    list: '리스트',
    read: '읽음',
    unread: '읽지 않음'
  },
  en: {
    search: 'Search books...',
    grid: 'Grid',
    list: 'List',
    read: 'Read',
    unread: 'Unread'
  }
};

export default function BookCollectionDemo({ isDark, language }: BookCollectionDemoProps) {
  const [books, setBooks] = useState(initialBooks);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const t = translations[language];

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.author.toLowerCase().includes(search.toLowerCase())
  );

  const toggleRead = (id: number) => {
    setBooks(books.map(book => 
      book.id === id ? { ...book, read: !book.read } : book
    ));
  };

  return (
    <DemoContainer $isDark={isDark}>
      <Controls>
        <SearchBox $isDark={isDark}>
          <Search />
          <input
            type="text"
            placeholder={t.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchBox>
        <ViewToggle $isDark={isDark}>
          <ViewButton 
            $isDark={isDark} 
            $active={view === 'grid'}
            onClick={() => setView('grid')}
          >
            <Grid />
            {t.grid}
          </ViewButton>
          <ViewButton 
            $isDark={isDark} 
            $active={view === 'list'}
            onClick={() => setView('list')}
          >
            <List />
            {t.list}
          </ViewButton>
        </ViewToggle>
      </Controls>

      <BooksGrid $view={view}>
        {filteredBooks.map(book => (
          <BookCard 
            key={book.id} 
            $isDark={isDark} 
            $view={view}
            $read={book.read}
            onClick={() => toggleRead(book.id)}
          >
            <BookCover $color={book.color} $view={view}>
              {book.emoji}
            </BookCover>
            <BookInfo>
              <BookTitle $isDark={isDark}>{book.title}</BookTitle>
              <BookAuthor>{book.author}</BookAuthor>
              <BookStatus>
                <Star size={14} fill={book.read ? '#86868b' : 'none'} />
                {book.read ? t.read : t.unread}
              </BookStatus>
            </BookInfo>
          </BookCard>
        ))}
      </BooksGrid>
    </DemoContainer>
  );
}

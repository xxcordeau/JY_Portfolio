import { useState, useEffect } from 'react';
import styled from 'styled-components';
import '../../packages/awesome-ui/src/styles/globals.css';

// === @jy/awesome-ui imports ===
import { Button } from '../../packages/awesome-ui/src/components/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../packages/awesome-ui/src/components/card';
import { Input } from '../../packages/awesome-ui/src/components/input';
import { Textarea } from '../../packages/awesome-ui/src/components/textarea';
import { Badge } from '../../packages/awesome-ui/src/components/badge';
import { Alert, AlertTitle, AlertDescription } from '../../packages/awesome-ui/src/components/alert';
import { Chip } from '../../packages/awesome-ui/src/components/chip';
import { Divider } from '../../packages/awesome-ui/src/components/divider';
import { Spinner, ProgressBar, LinearProgress } from '../../packages/awesome-ui/src/components/loading';
import { Progress } from '../../packages/awesome-ui/src/components/progress';
import { Skeleton } from '../../packages/awesome-ui/src/components/skeleton';
import { Banner } from '../../packages/awesome-ui/src/components/banner';
import { StatusIndicator } from '../../packages/awesome-ui/src/components/status-indicator';
import { StatCard } from '../../packages/awesome-ui/src/components/stat-card';
import { EmptyState } from '../../packages/awesome-ui/src/components/empty-state';
import { Stepper } from '../../packages/awesome-ui/src/components/stepper';
import { Timeline } from '../../packages/awesome-ui/src/components/timeline';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../packages/awesome-ui/src/components/tabs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../packages/awesome-ui/src/components/accordion';
import { Toggle } from '../../packages/awesome-ui/src/components/toggle';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '../../packages/awesome-ui/src/components/tooltip';
import { RadioGroup, RadioGroupItem } from '../../packages/awesome-ui/src/components/radio-group';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from '../../packages/awesome-ui/src/components/select';
import { Slider } from '../../packages/awesome-ui/src/components/slider';
import { Switch } from '../../packages/awesome-ui/src/components/switch';
import { Avatar, AvatarImage, AvatarFallback } from '../../packages/awesome-ui/src/components/avatar';
import { Panel, Grid as LayoutGrid, Stack, Flex } from '../../packages/awesome-ui/src/components/layout';
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '../../packages/awesome-ui/src/components/drawer';
import { Popover, PopoverTrigger, PopoverContent } from '../../packages/awesome-ui/src/components/popover';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarLink, NavbarActions } from '../../packages/awesome-ui/src/components/navbar';
import { BreadcrumbStyled, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '../../packages/awesome-ui/src/components/breadcrumb-styled';
import { BottomNavigation } from '../../packages/awesome-ui/src/components/bottom-navigation';
import { Home, User, Settings, Bell, Search, Bold, Italic, Underline } from 'lucide-react';

// === @jy/data-ui-kit imports ===
import { DataTable } from '../../packages/data-ui-kit/src/components/data-table';
import { DataList } from '../../packages/data-ui-kit/src/components/data-list';
import { TreeView } from '../../packages/data-ui-kit/src/components/tree-view';
import { SearchFilter } from '../../packages/data-ui-kit/src/components/search-filter';
import { MultiSelect } from '../../packages/data-ui-kit/src/components/multi-select';
import { DatePicker, TimePicker } from '../../packages/data-ui-kit/src/components/date-time-picker';
import { DataLineChart, DataBarChart, DataAreaChart, DataPieChart } from '../../packages/data-ui-kit/src/components/data-chart';

const PageContainer = styled.div<{ $isDark: boolean }>`
  min-height: 100vh;
  background: ${p => p.$isDark ? '#000' : '#fff'};
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  padding: 100px 40px 60px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 80px 20px 40px;
  }
`;

const Title = styled.h1<{ $isDark: boolean }>`
  font-size: 48px;
  font-weight: 700;
  letter-spacing: -1.5px;
  margin-bottom: 8px;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
`;

const Subtitle = styled.p<{ $isDark: boolean }>`
  font-size: 18px;
  color: ${p => p.$isDark ? '#86868b' : '#6e6e73'};
  margin-bottom: 48px;
`;

const SectionTitle = styled.h2<{ $isDark: boolean }>`
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin: 48px 0 24px;
  padding-top: 24px;
  border-top: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
`;

const ComponentLabel = styled.h3<{ $isDark: boolean }>`
  font-size: 16px;
  font-weight: 600;
  margin: 24px 0 12px;
  color: ${p => p.$isDark ? '#86868b' : '#6e6e73'};
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
`;

const BottomNavDemoWrap = styled.div`
  & > nav {
    display: flex !important;
    position: relative !important;
  }
`;

const StatusBadge = styled.span<{ $ok: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  background: ${p => p.$ok ? 'rgba(52, 199, 89, 0.15)' : 'rgba(255, 59, 48, 0.15)'};
  color: ${p => p.$ok ? '#34C759' : '#FF3B30'};
`;

// Sample data for DataTable
const tableColumns = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'role', header: 'Role', sortable: true },
  { key: 'status', header: 'Status' },
];
const tableData = [
  { name: 'Kim Minjun', role: 'Frontend', status: 'Active' },
  { name: 'Lee Soojin', role: 'Backend', status: 'Active' },
  { name: 'Park Jihye', role: 'Designer', status: 'Away' },
  { name: 'Choi Donghyun', role: 'DevOps', status: 'Active' },
  { name: 'Jung Soyeon', role: 'PM', status: 'Offline' },
];

// Sample data for DataList
const listData = [
  { id: '1', title: 'Design System Setup', description: 'Initialize token & theme', icon: '🎨' },
  { id: '2', title: 'Component Library', description: 'Build reusable UI components', icon: '🧩' },
  { id: '3', title: 'Documentation', description: 'Write usage guide', icon: '📖' },
];

// Sample data for TreeView
const treeData = [
  {
    id: '1', name: 'src', type: 'folder' as const, children: [
      {
        id: '2', name: 'components', type: 'folder' as const, children: [
          { id: '3', name: 'Button.tsx', type: 'file' as const },
          { id: '4', name: 'Card.tsx', type: 'file' as const },
        ]
      },
      { id: '5', name: 'index.ts', type: 'file' as const },
    ]
  },
];

// Sample filter groups for SearchFilter
const filterGroups = [
  {
    id: 'category',
    label: 'Category',
    options: [
      { id: 'frontend', label: 'Frontend' },
      { id: 'backend', label: 'Backend' },
      { id: 'devops', label: 'DevOps' },
    ],
  },
];

// Sample multi-select options
const multiSelectOptions = [
  { id: 'react', label: 'React' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'nodejs', label: 'Node.js' },
  { id: 'python', label: 'Python' },
];

interface PackageDemoProps {
  isDark: boolean;
  language: 'ko' | 'en';
}

export default function PackageDemo({ isDark, language }: PackageDemoProps) {
  const [searchValue, setSearchValue] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [multiSelected, setMultiSelected] = useState<string[]>([]);
  const [togglePressed, setTogglePressed] = useState(false);

  // Tailwind CSS 변수 기반 컴포넌트를 위한 dark 클래스 토글
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const isKo = language === 'ko';

  return (
    <PageContainer $isDark={isDark}>
      <Title $isDark={isDark}>
        {isKo ? '📦 패키지 데모' : '📦 Package Demo'}
      </Title>
      <Subtitle $isDark={isDark}>
        {isKo
          ? '@jy/awesome-ui + @jy/data-ui-kit 컴포넌트 렌더링 테스트'
          : '@jy/awesome-ui + @jy/data-ui-kit component rendering test'}
      </Subtitle>

      {/* ========== @jy/awesome-ui ========== */}
      <SectionTitle $isDark={isDark}>@jy/awesome-ui</SectionTitle>

      {/* Button */}
      <ComponentLabel $isDark={isDark}>Button — Variants</ComponentLabel>
      <Row>
        <Button isDark={isDark}>Default</Button>
        <Button isDark={isDark} variant="outline">Outline</Button>
        <Button isDark={isDark} variant="ghost">Ghost</Button>
        <Button isDark={isDark} variant="destructive">Destructive</Button>
        <Button isDark={isDark} disabled>Disabled</Button>
      </Row>
      <ComponentLabel $isDark={isDark}>Button — Sizes</ComponentLabel>
      <Row style={{ alignItems: 'center' }}>
        <Button isDark={isDark} size="sm">Small</Button>
        <Button isDark={isDark}>Default</Button>
        <Button isDark={isDark} size="lg">Large</Button>
      </Row>

      {/* Badge */}
      <ComponentLabel $isDark={isDark}>Badge</ComponentLabel>
      <Row>
        <Badge isDark={isDark}>Default</Badge>
        <Badge isDark={isDark} variant="secondary">Secondary</Badge>
        <Badge isDark={isDark} variant="destructive">Destructive</Badge>
        <Badge isDark={isDark} variant="outline">Outline</Badge>
      </Row>

      {/* Input */}
      <ComponentLabel $isDark={isDark}>Input — States</ComponentLabel>
      <Row>
        <Input isDark={isDark} placeholder="Default" style={{ maxWidth: 200 }} />
        <Input isDark={isDark} placeholder="Disabled" disabled style={{ maxWidth: 200 }} />
      </Row>
      <ComponentLabel $isDark={isDark}>Input — Types</ComponentLabel>
      <Row>
        <Input isDark={isDark} type="text" placeholder="Text" style={{ maxWidth: 180 }} />
        <Input isDark={isDark} type="email" placeholder="Email" style={{ maxWidth: 180 }} />
        <Input isDark={isDark} type="password" placeholder="Password" style={{ maxWidth: 180 }} />
        <Input isDark={isDark} type="number" placeholder="Number" style={{ maxWidth: 140 }} />
      </Row>
      <ComponentLabel $isDark={isDark}>Input — Full Width</ComponentLabel>
      <Input isDark={isDark} placeholder="Full width input" />

      {/* Textarea */}
      <ComponentLabel $isDark={isDark}>Textarea</ComponentLabel>
      <Row>
        <Textarea isDark={isDark} placeholder={isKo ? '메시지를 입력하세요...' : 'Enter your message...'} style={{ maxWidth: 300 }} />
        <Textarea isDark={isDark} placeholder="Disabled" disabled style={{ maxWidth: 300, opacity: 0.5 }} />
      </Row>

      {/* Radio */}
      <ComponentLabel $isDark={isDark}>RadioGroup</ComponentLabel>
      <RadioGroup defaultValue="opt1" isDark={isDark}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <RadioGroupItem value="opt1" id="r1" isDark={isDark} />
          <label htmlFor="r1" style={{ fontSize: 14, color: isDark ? '#f5f5f7' : '#1d1d1f' }}>Option 1</label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <RadioGroupItem value="opt2" id="r2" isDark={isDark} />
          <label htmlFor="r2" style={{ fontSize: 14, color: isDark ? '#f5f5f7' : '#1d1d1f' }}>Option 2</label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <RadioGroupItem value="opt3" id="r3" isDark={isDark} />
          <label htmlFor="r3" style={{ fontSize: 14, color: isDark ? '#f5f5f7' : '#1d1d1f' }}>Option 3</label>
        </div>
      </RadioGroup>

      {/* Select */}
      <ComponentLabel $isDark={isDark}>Select</ComponentLabel>
      <div style={{ maxWidth: 300 }}>
        <Select>
          <SelectTrigger isDark={isDark}>
            <SelectValue placeholder={isKo ? '항목 선택...' : 'Select item...'} />
          </SelectTrigger>
          <SelectContent isDark={isDark}>
            <SelectGroup>
              <SelectLabel isDark={isDark}>{isKo ? '과일' : 'Fruits'}</SelectLabel>
              <SelectItem value="apple" isDark={isDark}>{isKo ? '사과' : 'Apple'}</SelectItem>
              <SelectItem value="banana" isDark={isDark}>{isKo ? '바나나' : 'Banana'}</SelectItem>
              <SelectItem value="orange" isDark={isDark}>{isKo ? '오렌지' : 'Orange'}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Slider */}
      <ComponentLabel $isDark={isDark}>Slider</ComponentLabel>
      <div style={{ maxWidth: 400 }}>
        <Slider isDark={isDark} defaultValue={[40]} max={100} step={1} />
      </div>

      {/* Switch */}
      <ComponentLabel $isDark={isDark}>Switch</ComponentLabel>
      <Row style={{ alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Switch isDark={isDark} />
          <span style={{ fontSize: 14, color: isDark ? '#f5f5f7' : '#1d1d1f' }}>Default</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Switch isDark={isDark} defaultChecked />
          <span style={{ fontSize: 14, color: isDark ? '#f5f5f7' : '#1d1d1f' }}>Checked</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Switch isDark={isDark} disabled />
          <span style={{ fontSize: 14, color: isDark ? '#86868b' : '#6e6e73' }}>Disabled</span>
        </div>
      </Row>

      {/* Avatar */}
      <ComponentLabel $isDark={isDark}>Avatar — Sizes</ComponentLabel>
      <Row style={{ alignItems: 'center' }}>
        <Avatar size={32}>
          <AvatarFallback isDark={isDark}>S</AvatarFallback>
        </Avatar>
        <Avatar size={40}>
          <AvatarFallback isDark={isDark}>M</AvatarFallback>
        </Avatar>
        <Avatar size={56}>
          <AvatarFallback isDark={isDark}>L</AvatarFallback>
        </Avatar>
        <Avatar size={40}>
          <AvatarImage src="https://github.com/shadcn.png" alt="avatar" />
          <AvatarFallback isDark={isDark}>CN</AvatarFallback>
        </Avatar>
      </Row>

      {/* Chip */}
      <ComponentLabel $isDark={isDark}>Chip — Variants</ComponentLabel>
      <Row>
        <Chip isDark={isDark} label="Default" />
        <Chip isDark={isDark} label="Filled" variant="filled" />
        <Chip isDark={isDark} label="Outline" variant="outline" />
        <Chip isDark={isDark} label="Primary" variant="primary" />
        <Chip isDark={isDark} label="Success" variant="success" />
        <Chip isDark={isDark} label="Warning" variant="warning" />
        <Chip isDark={isDark} label="Error" variant="error" />
        <Chip isDark={isDark} label="Removable" onDelete={() => {}} />
      </Row>
      <ComponentLabel $isDark={isDark}>Chip — Sizes</ComponentLabel>
      <Row style={{ alignItems: 'center' }}>
        <Chip isDark={isDark} label="Small" size="sm" variant="primary" />
        <Chip isDark={isDark} label="Medium" variant="primary" />
        <Chip isDark={isDark} label="Large" size="lg" variant="primary" />
      </Row>

      {/* Alert */}
      <ComponentLabel $isDark={isDark}>Alert</ComponentLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
        <Alert variant="default" style={{ border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'}`, borderRadius: 12, padding: '16px 20px' }}>
          <AlertTitle>{isKo ? '알림' : 'Notice'}</AlertTitle>
          <AlertDescription>
            {isKo ? '이것은 기본 알림입니다.' : 'This is a default alert.'}
          </AlertDescription>
        </Alert>
        <Alert variant="destructive" style={{ border: `1px solid ${isDark ? 'rgba(255,69,58,0.4)' : 'rgba(212,24,61,0.3)'}`, borderRadius: 12, padding: '16px 20px', background: isDark ? 'rgba(255,69,58,0.1)' : 'rgba(212,24,61,0.08)' }}>
          <AlertTitle>{isKo ? '오류' : 'Error'}</AlertTitle>
          <AlertDescription>
            {isKo ? '문제가 발생했습니다.' : 'Something went wrong.'}
          </AlertDescription>
        </Alert>
      </div>

      {/* Banner */}
      <ComponentLabel $isDark={isDark}>Banner — Variants</ComponentLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Banner isDark={isDark} variant="info" title={isKo ? '안내' : 'Info'} description={isKo ? '정보 메시지입니다.' : 'This is an info message.'} />
        <Banner isDark={isDark} variant="success" title={isKo ? '성공' : 'Success'} description={isKo ? '저장되었습니다.' : 'Changes saved successfully.'} />
        <Banner isDark={isDark} variant="warning" title={isKo ? '경고' : 'Warning'} description={isKo ? '주의가 필요합니다.' : 'Please review this item.'} />
        <Banner isDark={isDark} variant="error" title={isKo ? '오류' : 'Error'} description={isKo ? '연결에 실패했습니다.' : 'Connection failed.'} />
      </div>
      <ComponentLabel $isDark={isDark}>Banner — Dismissible</ComponentLabel>
      <Banner isDark={isDark} variant="info" title={isKo ? '닫기 가능' : 'Dismissible'} description={isKo ? 'X 버튼으로 닫을 수 있습니다.' : 'Can be closed with X button.'} dismissible onDismiss={() => {}} />

      {/* StatusIndicator */}
      <ComponentLabel $isDark={isDark}>StatusIndicator — Dot + Label</ComponentLabel>
      <Row>
        <StatusIndicator isDark={isDark} variant="success" label="Online" />
        <StatusIndicator isDark={isDark} variant="warning" label="Away" />
        <StatusIndicator isDark={isDark} variant="error" label="Busy" />
        <StatusIndicator isDark={isDark} variant="offline" label="Offline" />
      </Row>
      <ComponentLabel $isDark={isDark}>StatusIndicator — Sizes</ComponentLabel>
      <Row style={{ alignItems: 'center' }}>
        <StatusIndicator isDark={isDark} variant="success" label="sm" size="sm" />
        <StatusIndicator isDark={isDark} variant="success" label="md" size="md" />
        <StatusIndicator isDark={isDark} variant="success" label="lg" size="lg" />
      </Row>
      <ComponentLabel $isDark={isDark}>StatusIndicator — Badge</ComponentLabel>
      <Row>
        <StatusIndicator isDark={isDark} variant="success" label="Online" showBadge />
        <StatusIndicator isDark={isDark} variant="warning" label="Away" showBadge />
        <StatusIndicator isDark={isDark} variant="error" label="Busy" showBadge />
        <StatusIndicator isDark={isDark} variant="info" label="Info" showBadge />
      </Row>
      <ComponentLabel $isDark={isDark}>StatusIndicator — Pulse</ComponentLabel>
      <Row>
        <StatusIndicator isDark={isDark} variant="success" label="Live" pulse />
        <StatusIndicator isDark={isDark} variant="info" label="Streaming" pulse />
      </Row>

      {/* Progress */}
      <ComponentLabel $isDark={isDark}>Progress</ComponentLabel>
      <Progress value={65} />

      {/* ProgressBar — Variants */}
      <ComponentLabel $isDark={isDark}>ProgressBar — Variants</ComponentLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <ProgressBar isDark={isDark} progress={70} variant="default" />
        <ProgressBar isDark={isDark} progress={85} variant="success" />
        <ProgressBar isDark={isDark} progress={50} variant="warning" />
        <ProgressBar isDark={isDark} progress={30} variant="error" />
      </div>

      {/* LinearProgress */}
      <ComponentLabel $isDark={isDark}>LinearProgress — Variants</ComponentLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <LinearProgress isDark={isDark} variant="default" />
        <LinearProgress isDark={isDark} variant="success" />
        <LinearProgress isDark={isDark} variant="warning" />
        <LinearProgress isDark={isDark} variant="error" />
      </div>

      {/* Spinner */}
      <ComponentLabel $isDark={isDark}>Spinner — Sizes</ComponentLabel>
      <Row style={{ alignItems: 'center' }}>
        <Spinner isDark={isDark} size="sm" />
        <Spinner isDark={isDark} />
        <Spinner isDark={isDark} size="lg" />
      </Row>
      <ComponentLabel $isDark={isDark}>Spinner — Variants</ComponentLabel>
      <Row style={{ alignItems: 'center' }}>
        <Spinner isDark={isDark} variant="default" />
        <Spinner isDark={isDark} variant="success" />
        <Spinner isDark={isDark} variant="warning" />
        <Spinner isDark={isDark} variant="error" />
      </Row>

      {/* Skeleton */}
      <ComponentLabel $isDark={isDark}>Skeleton</ComponentLabel>
      <Row>
        <Skeleton style={{ width: 200, height: 20 }} />
        <Skeleton style={{ width: 100, height: 20 }} />
        <Skeleton style={{ width: 40, height: 40, borderRadius: '50%' }} />
      </Row>

      {/* Divider */}
      <ComponentLabel $isDark={isDark}>Divider</ComponentLabel>
      <Divider isDark={isDark} />

      {/* Card */}
      <ComponentLabel $isDark={isDark}>Card</ComponentLabel>
      <Grid>
        <Card isDark={isDark}>
          <CardHeader isDark={isDark}>
            <CardTitle isDark={isDark}>{isKo ? '카드 제목' : 'Card Title'}</CardTitle>
            <CardDescription isDark={isDark}>
              {isKo ? '카드 설명 텍스트입니다.' : 'Card description text.'}
            </CardDescription>
          </CardHeader>
          <CardContent isDark={isDark}>
            <p>{isKo ? '카드 본문 내용' : 'Card body content'}</p>
          </CardContent>
          <CardFooter isDark={isDark}>
            <Button isDark={isDark} size="sm">Action</Button>
          </CardFooter>
        </Card>

        <StatCard
          isDark={isDark}
          title={isKo ? '총 사용자' : 'Total Users'}
          value="12,345"
          change="+12.5%"
          changeType="positive"
        />
      </Grid>

      {/* EmptyState */}
      <ComponentLabel $isDark={isDark}>EmptyState</ComponentLabel>
      <EmptyState
        isDark={isDark}
        title={isKo ? '데이터가 없습니다' : 'No data found'}
        description={isKo ? '새 항목을 추가해보세요.' : 'Try adding a new item.'}
      />

      {/* Tabs */}
      <ComponentLabel $isDark={isDark}>Tabs</ComponentLabel>
      <Tabs isDark={isDark} defaultValue="tab1">
        <TabsList isDark={isDark}>
          <TabsTrigger isDark={isDark} value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger isDark={isDark} value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger isDark={isDark} value="tab3">Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent isDark={isDark} value="tab1">
          {isKo ? '첫 번째 탭 내용' : 'First tab content'}
        </TabsContent>
        <TabsContent isDark={isDark} value="tab2">
          {isKo ? '두 번째 탭 내용' : 'Second tab content'}
        </TabsContent>
        <TabsContent isDark={isDark} value="tab3">
          {isKo ? '세 번째 탭 내용' : 'Third tab content'}
        </TabsContent>
      </Tabs>

      {/* Accordion */}
      <ComponentLabel $isDark={isDark}>Accordion</ComponentLabel>
      <Accordion isDark={isDark} type="single" collapsible>
        <AccordionItem isDark={isDark} value="item-1">
          <AccordionTrigger isDark={isDark}>
            {isKo ? '아코디언 항목 1' : 'Accordion Item 1'}
          </AccordionTrigger>
          <AccordionContent isDark={isDark}>
            {isKo ? '여기에 내용이 표시됩니다.' : 'Content is displayed here.'}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem isDark={isDark} value="item-2">
          <AccordionTrigger isDark={isDark}>
            {isKo ? '아코디언 항목 2' : 'Accordion Item 2'}
          </AccordionTrigger>
          <AccordionContent isDark={isDark}>
            {isKo ? '두 번째 항목의 내용입니다.' : 'Second item content.'}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Toggle */}
      <ComponentLabel $isDark={isDark}>Toggle</ComponentLabel>
      <Row>
        <Toggle
          isDark={isDark}
          pressed={togglePressed}
          onPressedChange={setTogglePressed}
        >
          {togglePressed ? 'ON' : 'OFF'}
        </Toggle>
        <Toggle isDark={isDark} variant="outline">Outline</Toggle>
      </Row>

      {/* Tooltip */}
      <ComponentLabel $isDark={isDark}>Tooltip</ComponentLabel>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button isDark={isDark} variant="outline">
              {isKo ? '마우스를 올려보세요' : 'Hover me'}
            </Button>
          </TooltipTrigger>
          <TooltipContent isDark={isDark}>
            {isKo ? '툴팁 내용입니다' : 'Tooltip content'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Stepper */}
      <ComponentLabel $isDark={isDark}>Stepper</ComponentLabel>
      <Stepper
        isDark={isDark}
        steps={[
          { label: isKo ? '시작' : 'Start' },
          { label: isKo ? '진행' : 'Progress' },
          { label: isKo ? '완료' : 'Done' },
        ]}
        currentStep={1}
      />

      {/* Timeline */}
      <ComponentLabel $isDark={isDark}>Timeline</ComponentLabel>
      <Timeline
        isDark={isDark}
        items={[
          { title: 'v0.1.0', description: isKo ? '초기 릴리즈' : 'Initial release', date: '2024-01' },
          { title: 'v0.2.0', description: isKo ? '컴포넌트 추가' : 'New components', date: '2024-03' },
          { title: 'v1.0.0', description: isKo ? '정식 출시' : 'Stable release', date: '2024-06' },
        ]}
      />

      {/* Layout — Grid */}
      <ComponentLabel $isDark={isDark}>Layout — Grid</ComponentLabel>
      <LayoutGrid columns={3} gap="12px">
        {[1, 2, 3].map(i => (
          <Panel key={i} isDark={isDark} style={{ padding: 20, textAlign: 'center' }}>
            Grid {i}
          </Panel>
        ))}
      </LayoutGrid>

      {/* Layout — Stack */}
      <ComponentLabel $isDark={isDark}>Layout — Stack</ComponentLabel>
      <Stack gap="8px">
        <Panel isDark={isDark} style={{ padding: 12 }}>{isKo ? '스택 아이템 1' : 'Stack Item 1'}</Panel>
        <Panel isDark={isDark} style={{ padding: 12 }}>{isKo ? '스택 아이템 2' : 'Stack Item 2'}</Panel>
        <Panel isDark={isDark} style={{ padding: 12 }}>{isKo ? '스택 아이템 3' : 'Stack Item 3'}</Panel>
      </Stack>

      {/* Layout — Flex */}
      <ComponentLabel $isDark={isDark}>Layout — Flex</ComponentLabel>
      <Flex gap="12px" justify="space-between" align="center">
        <Panel isDark={isDark} style={{ padding: '12px 24px' }}>Left</Panel>
        <Panel isDark={isDark} style={{ padding: '12px 24px' }}>Center</Panel>
        <Panel isDark={isDark} style={{ padding: '12px 24px' }}>Right</Panel>
      </Flex>

      {/* Drawer */}
      <ComponentLabel $isDark={isDark}>Drawer</ComponentLabel>
      <Drawer>
        <DrawerTrigger asChild>
          <Button isDark={isDark} variant="outline">
            {isKo ? '드로어 열기' : 'Open Drawer'}
          </Button>
        </DrawerTrigger>
        <DrawerContent isDark={isDark}>
          <DrawerHeader>
            <DrawerTitle isDark={isDark}>{isKo ? '드로어 제목' : 'Drawer Title'}</DrawerTitle>
            <DrawerDescription isDark={isDark}>
              {isKo ? '이것은 드로어 설명입니다.' : 'This is a drawer description.'}
            </DrawerDescription>
          </DrawerHeader>
          <div style={{ padding: '16px 24px', color: isDark ? '#d4d4d8' : '#1d1d1f' }}>
            {isKo ? '드로어 본문 내용입니다.' : 'Drawer body content goes here.'}
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button isDark={isDark}>{isKo ? '닫기' : 'Close'}</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Popover */}
      <ComponentLabel $isDark={isDark}>Popover</ComponentLabel>
      <Popover>
        <PopoverTrigger asChild>
          <Button isDark={isDark} variant="outline">
            {isKo ? '팝오버 열기' : 'Open Popover'}
          </Button>
        </PopoverTrigger>
        <PopoverContent isDark={isDark} style={{ padding: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
              {isKo ? '팝오버 제목' : 'Popover Title'}
            </h4>
            <p style={{ margin: 0, fontSize: 13, opacity: 0.7 }}>
              {isKo ? '추가 정보를 여기에 표시합니다.' : 'Additional info displayed here.'}
            </p>
          </div>
        </PopoverContent>
      </Popover>

      {/* Navbar */}
      <ComponentLabel $isDark={isDark}>Navbar</ComponentLabel>
      <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>
        <Navbar isDark={isDark}>
          <NavbarBrand isDark={isDark}>MyApp</NavbarBrand>
          <NavbarContent>
            <NavbarItem>
              <NavbarLink isDark={isDark} active>Home</NavbarLink>
            </NavbarItem>
            <NavbarItem>
              <NavbarLink isDark={isDark}>About</NavbarLink>
            </NavbarItem>
            <NavbarItem>
              <NavbarLink isDark={isDark}>Contact</NavbarLink>
            </NavbarItem>
          </NavbarContent>
          <NavbarActions>
            <Button isDark={isDark} size="sm">Sign In</Button>
          </NavbarActions>
        </Navbar>
      </div>

      {/* Breadcrumb */}
      <ComponentLabel $isDark={isDark}>Breadcrumb</ComponentLabel>
      <BreadcrumbStyled>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink isDark={isDark}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator isDark={isDark} />
          <BreadcrumbItem>
            <BreadcrumbLink isDark={isDark}>Components</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator isDark={isDark} />
          <BreadcrumbItem>
            <BreadcrumbPage isDark={isDark}>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </BreadcrumbStyled>

      {/* BottomNavigation */}
      <ComponentLabel $isDark={isDark}>BottomNavigation {isKo ? '(모바일 전용 — 데모용 표시)' : '(Mobile only — shown for demo)'}</ComponentLabel>
      <BottomNavDemoWrap style={{ position: 'relative', height: 70, borderRadius: 12, overflow: 'hidden', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>
        <BottomNavigation
          isDark={isDark}
          activeId="home"
          items={[
            { id: 'home', label: 'Home', icon: <Home size={20} /> },
            { id: 'search', label: 'Search', icon: <Search size={20} /> },
            { id: 'alerts', label: 'Alerts', icon: <Bell size={20} />, badge: '3' },
            { id: 'profile', label: 'Profile', icon: <User size={20} /> },
          ]}
        />
      </BottomNavDemoWrap>

      {/* ========== @jy/data-ui-kit ========== */}
      <SectionTitle $isDark={isDark}>@jy/data-ui-kit</SectionTitle>

      {/* DataChart */}
      <ComponentLabel $isDark={isDark}>DataChart — Line</ComponentLabel>
      <DataLineChart
        isDark={isDark}
        title={isKo ? '월별 방문자' : 'Monthly Visitors'}
        subtitle={isKo ? '최근 6개월' : 'Last 6 months'}
        data={[
          { name: 'Jan', visitors: 1200 },
          { name: 'Feb', visitors: 1900 },
          { name: 'Mar', visitors: 1600 },
          { name: 'Apr', visitors: 2400 },
          { name: 'May', visitors: 2100 },
          { name: 'Jun', visitors: 2800 },
        ]}
        dataKey="visitors"
        color="blue"
        height={250}
      />

      <ComponentLabel $isDark={isDark}>DataChart — Bar</ComponentLabel>
      <DataBarChart
        isDark={isDark}
        title={isKo ? '기술 스택 사용량' : 'Tech Stack Usage'}
        data={[
          { name: 'React', count: 85 },
          { name: 'TypeScript', count: 78 },
          { name: 'Node.js', count: 65 },
          { name: 'Python', count: 45 },
          { name: 'Go', count: 30 },
        ]}
        dataKey="count"
        color="green"
        height={250}
      />

      <ComponentLabel $isDark={isDark}>DataChart — Area</ComponentLabel>
      <DataAreaChart
        isDark={isDark}
        title={isKo ? '매출 추이' : 'Revenue Trend'}
        data={[
          { name: 'Q1', revenue: 4000 },
          { name: 'Q2', revenue: 5200 },
          { name: 'Q3', revenue: 4800 },
          { name: 'Q4', revenue: 6100 },
        ]}
        dataKey="revenue"
        color="purple"
        height={250}
      />

      <ComponentLabel $isDark={isDark}>DataChart — Pie</ComponentLabel>
      <DataPieChart
        isDark={isDark}
        title={isKo ? '프로젝트 분포' : 'Project Distribution'}
        data={[
          { name: 'Frontend', value: 40 },
          { name: 'Backend', value: 30 },
          { name: 'DevOps', value: 15 },
          { name: 'Design', value: 15 },
        ]}
        dataKey="value"
        height={300}
      />

      {/* DataTable */}
      <ComponentLabel $isDark={isDark}>DataTable</ComponentLabel>
      <DataTable
        isDark={isDark}
        title={isKo ? '팀 멤버' : 'Team Members'}
        columns={tableColumns}
        data={tableData}
        searchable
        searchPlaceholder={isKo ? '이름 검색...' : 'Search name...'}
        pageSize={3}
      />

      {/* DataList */}
      <ComponentLabel $isDark={isDark}>DataList</ComponentLabel>
      <DataList
        isDark={isDark}
        items={listData}
        title={isKo ? '작업 목록' : 'Task List'}
      />

      {/* TreeView */}
      <ComponentLabel $isDark={isDark}>TreeView</ComponentLabel>
      <TreeView isDark={isDark} data={treeData} />

      {/* SearchFilter */}
      <ComponentLabel $isDark={isDark}>SearchFilter</ComponentLabel>
      <SearchFilter
        isDark={isDark}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder={isKo ? '검색어를 입력하세요...' : 'Type to search...'}
        filterGroups={filterGroups}
        selectedFilters={selectedFilters}
        onFilterChange={(groupId, optionId) =>
          setSelectedFilters(prev => ({ ...prev, [groupId]: optionId }))
        }
        onClearFilters={() => setSelectedFilters({})}
      />

      {/* MultiSelect */}
      <ComponentLabel $isDark={isDark}>MultiSelect</ComponentLabel>
      <div style={{ maxWidth: 400 }}>
        <MultiSelect
          isDark={isDark}
          options={multiSelectOptions}
          value={multiSelected}
          onChange={setMultiSelected}
          placeholder={isKo ? '기술 스택 선택...' : 'Select tech stack...'}
        />
      </div>

      {/* DatePicker / TimePicker */}
      <ComponentLabel $isDark={isDark}>DatePicker / TimePicker</ComponentLabel>
      <Row>
        <DatePicker isDark={isDark} />
        <TimePicker isDark={isDark} />
      </Row>

      {/* Summary */}
      <SectionTitle $isDark={isDark}>
        {isKo ? '렌더링 결과' : 'Rendering Results'}
      </SectionTitle>
      <Grid>
        <Card isDark={isDark}>
          <CardContent isDark={isDark} style={{ padding: '20px' }}>
            <h4 style={{ marginBottom: 12 }}>@jy/awesome-ui</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {['Button', 'Badge', 'Input', 'Textarea', 'RadioGroup', 'Select', 'Slider', 'Switch',
                'Avatar', 'Chip', 'Alert', 'Banner', 'StatusIndicator',
                'Progress', 'ProgressBar', 'LinearProgress', 'Spinner', 'Skeleton', 'Divider',
                'Card', 'StatCard', 'EmptyState', 'Tabs', 'Accordion', 'Toggle', 'Tooltip',
                'Stepper', 'Timeline', 'Layout (Grid/Stack/Flex)', 'Drawer', 'Popover',
                'Navbar', 'Breadcrumb', 'BottomNavigation'
              ].map(name => (
                <StatusBadge key={name} $ok={true}>✓ {name}</StatusBadge>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card isDark={isDark}>
          <CardContent isDark={isDark} style={{ padding: '20px' }}>
            <h4 style={{ marginBottom: 12 }}>@jy/data-ui-kit</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {['DataChart (Line)', 'DataChart (Bar)', 'DataChart (Area)', 'DataChart (Pie)', 'DataTable', 'DataList', 'TreeView', 'SearchFilter', 'MultiSelect', 'DatePicker', 'TimePicker'
              ].map(name => (
                <StatusBadge key={name} $ok={true}>✓ {name}</StatusBadge>
              ))}
            </div>
          </CardContent>
        </Card>
      </Grid>
    </PageContainer>
  );
}

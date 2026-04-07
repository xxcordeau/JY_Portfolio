import styled from "styled-components";
import { useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Toggle } from "../ui/toggle";
import { Slider } from "../ui/slider";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { Panel, Section, Grid, Stack, Flex, Container } from "../ui/layout";
import { Separator } from "../ui/separator";
import { Divider } from "../ui/divider";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Stepper } from "../ui/stepper";
import { Navbar, NavbarBrand, NavbarContent, NavbarMenu, NavbarItem, NavbarLink, NavbarActions, AppBar, Header, HeaderTop, HeaderBottom } from "../ui/navbar";
import { BreadcrumbStyled, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb-styled";
import { PaginationStyled, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from "../ui/pagination-styled";
import { SidebarStyledProvider, SidebarStyled, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarToggle, SidebarInset, useSidebarStyled } from "../ui/sidebar-styled";
import { Search, Mail, Lock, Bold, Italic, Underline, Star, Zap, Heart, User, Settings, X, Home, FileText, Users, Bell, CheckCircle, Circle, AlertCircle, Inbox } from "lucide-react";
import { BottomNavigation } from "../ui/bottom-navigation";
import { Chip } from "../ui/chip";
import { toast, ToastProvider } from "../ui/toast";
import { Banner } from "../ui/banner";
import { ProgressBar, Spinner, LinearProgress } from "../ui/loading";
import { Timeline } from "../ui/timeline";
import { EmptyState } from "../ui/empty-state";
import { StatusIndicator, OnlineStatus } from "../ui/status-indicator";
import { DataTable } from "../ui/data-table";
import { StatCard, KPICard } from "../ui/stat-card";
import { DataLineChart, DataBarChart, DataAreaChart, DataPieChart } from "../ui/data-chart";
import { DataList, GridList } from "../ui/data-list";
import { TreeView } from "../ui/tree-view";
import { DatePicker, TimePicker } from "../ui/date-time-picker";
import { SearchBar, SearchFilter } from "../ui/search-filter";
import { MultiSelect, TagSelector } from "../ui/multi-select";
import { DollarSign, TrendingUp, Activity, ShoppingCart, Folder, Image as ImageIcon } from "lucide-react";

const ShowcaseContainer = styled.div<{ $isDark: boolean }>`
  background: ${(props) =>
    props.$isDark ? "#0a0a0a" : "#fafafa"};
  border: 1px solid
    ${(props) =>
      props.$isDark
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.1)"};
  border-radius: 12px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 200px;
  align-items: flex-start;
  justify-content: center;
  overflow: visible;
`;

const EmptyMessage = styled.p<{ $isDark: boolean }>`
  color: ${(props) => props.$isDark ? "#86868b" : "#6e6e73"};
  font-size: 14px;
  opacity: 0.6;
`;

const SidebarHeaderText = styled.span<{ $collapsed?: boolean }>`
  font-weight: 600;
  font-size: 16px;
  display: ${props => props.$collapsed ? 'none' : 'block'};
`;

// Helper component for Sidebar header with conditional text
function SidebarHeaderWithToggle({ isDark }: { isDark: boolean }) {
  const { state } = useSidebarStyled();
  const isCollapsed = state === "collapsed";
  
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: isCollapsed ? 'center' : 'space-between',
      width: '100%' 
    }}>
      <SidebarHeaderText $collapsed={isCollapsed}>Navigation</SidebarHeaderText>
      <SidebarToggle isDark={isDark} />
    </div>
  );
}

interface ComponentShowcaseProps {
  componentName: string;
  isDark: boolean;
}

export default function ComponentShowcase({
  componentName,
  isDark,
}: ComponentShowcaseProps) {
  const [radioValue, setRadioValue] = useState("option1");
  const [selectValue, setSelectValue] = useState("");
  const [switchValue, setSwitchValue] = useState(false);
  const [toggleValue, setToggleValue] = useState(false);
  const [sliderValue, setSliderValue] = useState([50]);
  const [currentStep, setCurrentStep] = useState(1);
  const [activeNavItem, setActiveNavItem] = useState("Home");
  const [activeHeaderTab, setActiveHeaderTab] = useState("Dashboard");
  const [currentPage, setCurrentPage] = useState(1);
  const [bottomNavActive, setBottomNavActive] = useState("home");

  const renderComponent = () => {
    switch (componentName) {
      case "Input":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              width: "100%",
              maxWidth: "500px",
            }}
          >
            {/* Text Input */}
            <div>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "12px",
                  opacity: 0.8,
                }}
              >
                Text Input
              </h4>
              <Input 
                type="text" 
                placeholder="Enter your name..." 
                isDark={isDark}
              />
            </div>

            {/* Email Input */}
            <div>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "12px",
                  opacity: 0.8,
                }}
              >
                Email Input
              </h4>
              <Input 
                type="email" 
                placeholder="your@email.com" 
                isDark={isDark}
              />
            </div>

            {/* Password Input */}
            <div>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "12px",
                  opacity: 0.8,
                }}
              >
                Password Input
              </h4>
              <Input 
                type="password" 
                placeholder="Enter password" 
                isDark={isDark}
              />
            </div>

            {/* Search Input */}
            <div>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "12px",
                  opacity: 0.8,
                }}
              >
                Search Input
              </h4>
              <Input 
                type="search" 
                placeholder="Search..." 
                isDark={isDark}
              />
            </div>

            {/* Number Input */}
            <div>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "12px",
                  opacity: 0.8,
                }}
              >
                Number Input
              </h4>
              <Input 
                type="number" 
                placeholder="Enter amount" 
                isDark={isDark}
              />
            </div>

            {/* Disabled Input */}
            <div>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "12px",
                  opacity: 0.8,
                }}
              >
                Disabled State
              </h4>
              <Input 
                type="text"
                placeholder="Disabled input" 
                disabled 
                isDark={isDark}
              />
            </div>
          </div>
        );

      case "Textarea":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              width: "100%",
              maxWidth: "500px",
            }}
          >
            {/* Default Textarea */}
            <div>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "12px",
                  opacity: 0.8,
                }}
              >
                Default Textarea
              </h4>
              <Textarea 
                placeholder="Enter your message..." 
                isDark={isDark}
              />
            </div>

            {/* Larger Textarea */}
            <div>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "12px",
                  opacity: 0.8,
                }}
              >
                Large Textarea
              </h4>
              <Textarea 
                placeholder="Write a detailed description..." 
                isDark={isDark}
                style={{ minHeight: "180px" }}
              />
            </div>

            {/* Disabled Textarea */}
            <div>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "12px",
                  opacity: 0.8,
                }}
              >
                Disabled State
              </h4>
              <Textarea 
                placeholder="This textarea is disabled" 
                disabled
                isDark={isDark}
              />
            </div>
          </div>
        );

      case "Button":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "32px",
              width: "100%",
            }}
          >
            {/* Default Buttons */}
            <div>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "16px",
                  opacity: 0.8,
                }}
              >
                Default Variant
              </h4>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Button isDark={isDark} size="sm">
                  Small Button
                </Button>
                <Button isDark={isDark}>
                  Default Button
                </Button>
                <Button isDark={isDark} size="lg">
                  Large Button
                </Button>
              </div>
            </div>

            {/* Outline Buttons */}
            <div>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "16px",
                  opacity: 0.8,
                }}
              >
                Outline Variant
              </h4>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Button isDark={isDark} variant="outline" size="sm">
                  Small Outline
                </Button>
                <Button isDark={isDark} variant="outline">
                  Default Outline
                </Button>
                <Button isDark={isDark} variant="outline" size="lg">
                  Large Outline
                </Button>
              </div>
            </div>

            {/* Ghost Buttons */}
            <div>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "16px",
                  opacity: 0.8,
                }}
              >
                Ghost Variant
              </h4>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Button isDark={isDark} variant="ghost" size="sm">
                  Small Ghost
                </Button>
                <Button isDark={isDark} variant="ghost">
                  Default Ghost
                </Button>
                <Button isDark={isDark} variant="ghost" size="lg">
                  Large Ghost
                </Button>
              </div>
            </div>

            {/* Destructive Buttons */}
            <div>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "16px",
                  opacity: 0.8,
                }}
              >
                Destructive Variant
              </h4>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Button isDark={isDark} variant="destructive" size="sm">
                  Delete
                </Button>
                <Button isDark={isDark} variant="destructive">
                  Remove Item
                </Button>
                <Button isDark={isDark} variant="destructive" size="lg">
                  Delete Forever
                </Button>
              </div>
            </div>

            {/* Buttons with Icons */}
            <div>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "16px",
                  opacity: 0.8,
                }}
              >
                With Icons
              </h4>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Button isDark={isDark}>
                  <Search />
                  Search
                </Button>
                <Button isDark={isDark} variant="outline">
                  <Mail />
                  Email
                </Button>
                <Button isDark={isDark} variant="ghost">
                  <Lock />
                  Secure
                </Button>
              </div>
            </div>

            {/* Disabled State */}
            <div>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "16px",
                  opacity: 0.8,
                }}
              >
                Disabled State
              </h4>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Button isDark={isDark} disabled>
                  Disabled
                </Button>
                <Button isDark={isDark} variant="outline" disabled>
                  Disabled Outline
                </Button>
                <Button isDark={isDark} variant="destructive" disabled>
                  Disabled Destructive
                </Button>
              </div>
            </div>
          </div>
        );

      case "Radio":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              width: "100%",
              maxWidth: "400px",
            }}
          >
            <div>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "16px",
                  opacity: 0.8,
                }}
              >
                Choose an option
              </h4>
              <RadioGroup value={radioValue} onValueChange={setRadioValue} isDark={isDark}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <RadioGroupItem value="option1" id="r1" isDark={isDark} />
                  <label htmlFor="r1" style={{ fontSize: "15px", cursor: "pointer" }}>
                    Default Option
                  </label>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <RadioGroupItem value="option2" id="r2" isDark={isDark} />
                  <label htmlFor="r2" style={{ fontSize: "15px", cursor: "pointer" }}>
                    Another Option
                  </label>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <RadioGroupItem value="option3" id="r3" isDark={isDark} />
                  <label htmlFor="r3" style={{ fontSize: "15px", cursor: "pointer" }}>
                    Third Option
                  </label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case "Select":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              width: "100%",
              maxWidth: "400px",
            }}
          >
            <div>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "12px",
                  opacity: 0.8,
                }}
              >
                Choose a fruit
              </h4>
              <Select value={selectValue} onValueChange={setSelectValue}>
                <SelectTrigger isDark={isDark}>
                  <SelectValue placeholder="Select a fruit..." />
                </SelectTrigger>
                <SelectContent isDark={isDark}>
                  <SelectGroup>
                    <SelectLabel isDark={isDark}>Fruits</SelectLabel>
                    <SelectItem value="apple" isDark={isDark}>Apple</SelectItem>
                    <SelectItem value="banana" isDark={isDark}>Banana</SelectItem>
                    <SelectItem value="orange" isDark={isDark}>Orange</SelectItem>
                    <SelectItem value="grape" isDark={isDark}>Grape</SelectItem>
                    <SelectItem value="strawberry" isDark={isDark}>Strawberry</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "Switch":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Switch 
                checked={switchValue} 
                onCheckedChange={setSwitchValue} 
                isDark={isDark}
                id="s1"
              />
              <label htmlFor="s1" style={{ fontSize: "15px", cursor: "pointer" }}>
                Enable notifications
              </label>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Switch isDark={isDark} id="s2" defaultChecked />
              <label htmlFor="s2" style={{ fontSize: "15px", cursor: "pointer" }}>
                Auto-save enabled
              </label>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Switch isDark={isDark} id="s3" disabled />
              <label htmlFor="s3" style={{ fontSize: "15px", cursor: "pointer", opacity: 0.5 }}>
                Disabled switch
              </label>
            </div>
          </div>
        );

      case "Toggle":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              width: "100%",
            }}
          >
            <div>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "16px",
                  opacity: 0.8,
                }}
              >
                Default Toggle
              </h4>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Toggle isDark={isDark}>
                  <Bold />
                </Toggle>
                <Toggle isDark={isDark}>
                  <Italic />
                </Toggle>
                <Toggle isDark={isDark}>
                  <Underline />
                </Toggle>
              </div>
            </div>

            <div>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "16px",
                  opacity: 0.8,
                }}
              >
                Outline Toggle
              </h4>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Toggle isDark={isDark} variant="outline" size="sm">
                  <Bold />
                </Toggle>
                <Toggle isDark={isDark} variant="outline">
                  <Italic />
                </Toggle>
                <Toggle isDark={isDark} variant="outline" size="lg">
                  <Underline />
                </Toggle>
              </div>
            </div>
          </div>
        );

      case "Slider":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "32px",
              width: "100%",
              maxWidth: "400px",
            }}
          >
            <div>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "16px",
                  opacity: 0.8,
                }}
              >
                Single Value: {sliderValue[0]}
              </h4>
              <Slider 
                value={sliderValue} 
                onValueChange={setSliderValue}
                max={100}
                step={1}
                isDark={isDark}
              />
            </div>

            <div>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "16px",
                  opacity: 0.8,
                }}
              >
                Range Slider
              </h4>
              <Slider 
                defaultValue={[25, 75]} 
                max={100}
                step={1}
                isDark={isDark}
              />
            </div>

            <div>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "16px",
                  opacity: 0.8,
                }}
              >
                Disabled Slider
              </h4>
              <Slider 
                defaultValue={[50]} 
                max={100}
                disabled
                isDark={isDark}
              />
            </div>
          </div>
        );

      case "Avatar":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "32px",
              width: "100%",
            }}
          >
            <div>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "16px",
                  opacity: 0.8,
                }}
              >
                Avatar Sizes
              </h4>
              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <Avatar size={32}>
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" />
                  <AvatarFallback isDark={isDark}>SM</AvatarFallback>
                </Avatar>
                <Avatar size={40}>
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" />
                  <AvatarFallback isDark={isDark}>MD</AvatarFallback>
                </Avatar>
                <Avatar size={56}>
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" />
                  <AvatarFallback isDark={isDark}>LG</AvatarFallback>
                </Avatar>
              </div>
            </div>

            <div>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "16px",
                  opacity: 0.8,
                }}
              >
                With Fallback
              </h4>
              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <Avatar>
                  <AvatarFallback isDark={isDark}>JD</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback isDark={isDark}>AB</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback isDark={isDark}>
                    <User />
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        );

      case "Badge":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "32px",
              width: "100%",
            }}
          >
            <div>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "16px",
                  opacity: 0.8,
                }}
              >
                Badge Variants
              </h4>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Badge isDark={isDark}>Default</Badge>
                <Badge isDark={isDark} variant="secondary">Secondary</Badge>
                <Badge isDark={isDark} variant="outline">Outline</Badge>
                <Badge isDark={isDark} variant="destructive">Destructive</Badge>
              </div>
            </div>

            <div>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "16px",
                  opacity: 0.8,
                }}
              >
                With Icons
              </h4>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Badge isDark={isDark}>
                  <Star />
                  Featured
                </Badge>
                <Badge isDark={isDark} variant="secondary">
                  <Zap />
                  Fast
                </Badge>
                <Badge isDark={isDark} variant="outline">
                  <Heart />
                  Favorite
                </Badge>
              </div>
            </div>
          </div>
        );

      case "Card":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
            <Card isDark={isDark}>
              <CardHeader>
                <CardTitle isDark={isDark}>Card Title</CardTitle>
                <CardDescription isDark={isDark}>Card description goes here</CardDescription>
              </CardHeader>
              <CardContent>
                <p style={{ fontSize: "14px", lineHeight: "1.6" }}>
                  This is a card component with header, content, and footer sections.
                </p>
              </CardContent>
              <CardFooter>
                <Button isDark={isDark} variant="outline">Cancel</Button>
                <Button isDark={isDark}>Continue</Button>
              </CardFooter>
            </Card>
          </div>
        );

      case "Panel":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
            <Panel isDark={isDark}>
              <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>
                Simple Panel
              </h4>
              <p style={{ fontSize: "14px", opacity: 0.8 }}>
                This is a simple panel component for grouping content.
              </p>
            </Panel>
          </div>
        );

      case "Layout":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px", width: "100%" }}>
            <div>
              <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px", opacity: 0.8 }}>
                Grid Layout
              </h4>
              <Grid columns={3} gap="16px">
                <Panel isDark={isDark} style={{ padding: "20px", textAlign: "center" }}>
                  Grid Item 1
                </Panel>
                <Panel isDark={isDark} style={{ padding: "20px", textAlign: "center" }}>
                  Grid Item 2
                </Panel>
                <Panel isDark={isDark} style={{ padding: "20px", textAlign: "center" }}>
                  Grid Item 3
                </Panel>
              </Grid>
            </div>
            
            <div>
              <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px", opacity: 0.8 }}>
                Stack Layout (Vertical)
              </h4>
              <Stack gap="12px">
                <Panel isDark={isDark} style={{ padding: "16px" }}>Stack Item 1</Panel>
                <Panel isDark={isDark} style={{ padding: "16px" }}>Stack Item 2</Panel>
                <Panel isDark={isDark} style={{ padding: "16px" }}>Stack Item 3</Panel>
              </Stack>
            </div>

            <div>
              <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px", opacity: 0.8 }}>
                Flex Layout (Horizontal)
              </h4>
              <Flex gap="12px" wrap>
                <Panel isDark={isDark} style={{ padding: "16px", flex: 1 }}>Flex Item 1</Panel>
                <Panel isDark={isDark} style={{ padding: "16px", flex: 1 }}>Flex Item 2</Panel>
                <Panel isDark={isDark} style={{ padding: "16px", flex: 1 }}>Flex Item 3</Panel>
              </Flex>
            </div>
          </div>
        );



      case "Divider":
        return (
          <div style={{ width: "100%" }}>
            <p style={{ fontSize: "14px", marginBottom: "16px" }}>Section 1</p>
            <Divider isDark={isDark} />
            <p style={{ fontSize: "14px", margin: "16px 0" }}>Section 2</p>
            <Divider isDark={isDark}>OR</Divider>
            <p style={{ fontSize: "14px", marginTop: "16px" }}>Section 3</p>
          </div>
        );

      case "Dialog":
        return (
          <Dialog>
            <DialogTrigger asChild>
              <Button isDark={isDark}>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent isDark={isDark}>
              <DialogHeader>
                <DialogTitle isDark={isDark}>Dialog Title</DialogTitle>
                <DialogDescription isDark={isDark}>
                  This is a dialog description. Dialogs are great for important actions.
                </DialogDescription>
              </DialogHeader>
              <div style={{ padding: "16px 0" }}>
                <p style={{ fontSize: "14px" }}>Dialog content goes here.</p>
              </div>
              <DialogFooter>
                <Button isDark={isDark} variant="outline">Cancel</Button>
                <Button isDark={isDark}>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );

      case "Drawer":
        return (
          <Drawer>
            <DrawerTrigger asChild>
              <Button isDark={isDark}>Open Drawer</Button>
            </DrawerTrigger>
            <DrawerContent isDark={isDark}>
              <DrawerHeader>
                <DrawerTitle isDark={isDark}>Drawer Title</DrawerTitle>
                <DrawerDescription isDark={isDark}>
                  This is a drawer component that slides in from the bottom.
                </DrawerDescription>
              </DrawerHeader>
              <div style={{ padding: "16px" }}>
                <p style={{ fontSize: "14px" }}>Drawer content goes here.</p>
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button isDark={isDark} variant="outline">Close</Button>
                </DrawerClose>
                <Button isDark={isDark}>Submit</Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        );

      case "Popover":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button isDark={isDark}>Open Popover</Button>
            </PopoverTrigger>
            <PopoverContent isDark={isDark}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <h4 style={{ fontSize: "14px", fontWeight: "600" }}>Popover Title</h4>
                <p style={{ fontSize: "13px", opacity: 0.8 }}>
                  This is a popover component for displaying contextual information.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        );

      case "Tooltip":
        return (
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button isDark={isDark}>Hover me</Button>
              </TooltipTrigger>
              <TooltipContent isDark={isDark}>
                <p>This is a tooltip</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button isDark={isDark} variant="outline">
                  <Settings />
                </Button>
              </TooltipTrigger>
              <TooltipContent isDark={isDark}>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </div>
        );

      case "Accordion":
        return (
          <Accordion type="single" collapsible style={{ width: "100%" }}>
            <AccordionItem value="item-1" isDark={isDark}>
              <AccordionTrigger isDark={isDark}>What is this component?</AccordionTrigger>
              <AccordionContent>
                This is an accordion component that allows you to show and hide content sections.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" isDark={isDark}>
              <AccordionTrigger isDark={isDark}>How do I use it?</AccordionTrigger>
              <AccordionContent>
                Click on any section to expand or collapse the content.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" isDark={isDark}>
              <AccordionTrigger isDark={isDark}>Can I customize it?</AccordionTrigger>
              <AccordionContent>
                Yes! You can customize the styling and behavior using props.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );

      case "Tabs":
        return (
          <Tabs defaultValue="tab1" style={{ width: "100%" }}>
            <TabsList isDark={isDark}>
              <TabsTrigger value="tab1" isDark={isDark}>Tab 1</TabsTrigger>
              <TabsTrigger value="tab2" isDark={isDark}>Tab 2</TabsTrigger>
              <TabsTrigger value="tab3" isDark={isDark}>Tab 3</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">
              <Panel isDark={isDark} style={{ padding: "20px", marginTop: "16px" }}>
                <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>
                  Tab 1 Content
                </h4>
                <p style={{ fontSize: "14px", opacity: 0.8 }}>
                  This is the content for the first tab.
                </p>
              </Panel>
            </TabsContent>
            <TabsContent value="tab2">
              <Panel isDark={isDark} style={{ padding: "20px", marginTop: "16px" }}>
                <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>
                  Tab 2 Content
                </h4>
                <p style={{ fontSize: "14px", opacity: 0.8 }}>
                  This is the content for the second tab.
                </p>
              </Panel>
            </TabsContent>
            <TabsContent value="tab3">
              <Panel isDark={isDark} style={{ padding: "20px", marginTop: "16px" }}>
                <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>
                  Tab 3 Content
                </h4>
                <p style={{ fontSize: "14px", opacity: 0.8 }}>
                  This is the content for the third tab.
                </p>
              </Panel>
            </TabsContent>
          </Tabs>
        );

      case "Stepper":
        return (
          <Stepper
            steps={[
              { label: "Step 1" },
              { label: "Step 2" },
              { label: "Step 3" },
              { label: "Step 4" },
            ]}
            currentStep={currentStep}
            isDark={isDark}
          >
            <Panel isDark={isDark} style={{ padding: "20px", marginTop: "16px" }}>
              <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>
                {currentStep === 0 && "Step 1: Getting Started"}
                {currentStep === 1 && "Step 2: In Progress"}
                {currentStep === 2 && "Step 3: Almost Done"}
                {currentStep === 3 && "Step 4: Complete"}
              </h4>
              <p style={{ fontSize: "14px", opacity: 0.8 }}>
                {currentStep === 0 && "Let's begin the setup process."}
                {currentStep === 1 && "Complete the current step to move forward in the wizard."}
                {currentStep === 2 && "You're almost there!"}
                {currentStep === 3 && "All steps completed successfully!"}
              </p>
              <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                <Button 
                  isDark={isDark} 
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>
                <Button 
                  isDark={isDark}
                  onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
                  disabled={currentStep === 3}
                >
                  Next
                </Button>
              </div>
            </Panel>
          </Stepper>
        );

      case "Navbar":
        return (
          <div style={{ width: "100%", position: "relative", minHeight: "120px" }}>
            <Navbar isDark={isDark} sticky={false}>
              <NavbarBrand isDark={isDark}>
                <Star style={{ width: "24px", height: "24px" }} />
                Brand
              </NavbarBrand>
              <NavbarContent>
                <NavbarMenu>
                  <NavbarItem>
                    <NavbarLink 
                      isDark={isDark} 
                      active={activeNavItem === "Home"} 
                      href="#" 
                      onClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        setActiveNavItem("Home");
                      }}
                    >
                      Home
                    </NavbarLink>
                  </NavbarItem>
                  <NavbarItem>
                    <NavbarLink 
                      isDark={isDark} 
                      active={activeNavItem === "Products"} 
                      href="#" 
                      onClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        setActiveNavItem("Products");
                      }}
                    >
                      Products
                    </NavbarLink>
                  </NavbarItem>
                  <NavbarItem>
                    <NavbarLink 
                      isDark={isDark} 
                      active={activeNavItem === "About"} 
                      href="#" 
                      onClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        setActiveNavItem("About");
                      }}
                    >
                      About
                    </NavbarLink>
                  </NavbarItem>
                  <NavbarItem>
                    <NavbarLink 
                      isDark={isDark} 
                      active={activeNavItem === "Contact"} 
                      href="#" 
                      onClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        setActiveNavItem("Contact");
                      }}
                    >
                      Contact
                    </NavbarLink>
                  </NavbarItem>
                </NavbarMenu>
              </NavbarContent>
              <NavbarActions>
                <Button isDark={isDark} variant="ghost" size="sm">
                  Sign In
                </Button>
                <Button isDark={isDark} size="sm">
                  Sign Up
                </Button>
              </NavbarActions>
            </Navbar>
            <div style={{ padding: "20px", textAlign: "center", opacity: 0.6 }}>
              <p style={{ fontSize: "14px" }}>Page content below navbar</p>
            </div>
          </div>
        );



      case "Header":
        return (
          <div style={{ width: "100%", position: "relative", minHeight: "140px" }}>
            <Header isDark={isDark}>
              <HeaderTop>
                <NavbarBrand isDark={isDark}>
                  <Heart style={{ width: "24px", height: "24px" }} />
                  Brand
                </NavbarBrand>
                <NavbarActions>
                  <Button isDark={isDark} variant="ghost" size="sm">
                    Account
                  </Button>
                  <Button isDark={isDark} size="sm">
                    Get Started
                  </Button>
                </NavbarActions>
              </HeaderTop>
              <HeaderBottom isDark={isDark}>
                <Button 
                  isDark={isDark} 
                  variant={activeHeaderTab === "Dashboard" ? "default" : "ghost"} 
                  size="sm"
                  onClick={() => setActiveHeaderTab("Dashboard")}
                >
                  <Home style={{ width: "16px", height: "16px" }} />
                  Dashboard
                </Button>
                <Button 
                  isDark={isDark} 
                  variant={activeHeaderTab === "Projects" ? "default" : "ghost"} 
                  size="sm"
                  onClick={() => setActiveHeaderTab("Projects")}
                >
                  <FileText style={{ width: "16px", height: "16px" }} />
                  Projects
                </Button>
                <Button 
                  isDark={isDark} 
                  variant={activeHeaderTab === "Team" ? "default" : "ghost"} 
                  size="sm"
                  onClick={() => setActiveHeaderTab("Team")}
                >
                  <Users style={{ width: "16px", height: "16px" }} />
                  Team
                </Button>
                <Button 
                  isDark={isDark} 
                  variant={activeHeaderTab === "Settings" ? "default" : "ghost"} 
                  size="sm"
                  onClick={() => setActiveHeaderTab("Settings")}
                >
                  <Settings style={{ width: "16px", height: "16px" }} />
                  Settings
                </Button>
              </HeaderBottom>
            </Header>
            <div style={{ padding: "20px", textAlign: "center", opacity: 0.6 }}>
              <p style={{ fontSize: "14px" }}>Page content - {activeHeaderTab}</p>
            </div>
          </div>
        );

      case "Breadcrumb":
        return (
          <BreadcrumbStyled>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink isDark={isDark} href="#" onClick={(e: React.MouseEvent) => e.preventDefault()}>
                  <Home style={{ width: "14px", height: "14px" }} />
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator isDark={isDark} />
              <BreadcrumbItem>
                <BreadcrumbLink isDark={isDark} href="#" onClick={(e: React.MouseEvent) => e.preventDefault()}>
                  Products
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator isDark={isDark} />
              <BreadcrumbItem>
                <BreadcrumbLink isDark={isDark} href="#" onClick={(e: React.MouseEvent) => e.preventDefault()}>
                  Category
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator isDark={isDark} />
              <BreadcrumbItem>
                <BreadcrumbPage isDark={isDark}>
                  Current Item
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </BreadcrumbStyled>
        );

      case "Pagination":
        return (
          <PaginationStyled>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  isDark={isDark} 
                  href="#" 
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    setCurrentPage(Math.max(1, currentPage - 1));
                  }} 
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink 
                  isDark={isDark} 
                  href="#" 
                  active={currentPage === 1} 
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    setCurrentPage(1);
                  }}
                >
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink 
                  isDark={isDark} 
                  href="#" 
                  active={currentPage === 2} 
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    setCurrentPage(2);
                  }}
                >
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink 
                  isDark={isDark} 
                  href="#" 
                  active={currentPage === 3} 
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    setCurrentPage(3);
                  }}
                >
                  3
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis isDark={isDark} />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink 
                  isDark={isDark} 
                  href="#" 
                  active={currentPage === 8} 
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    setCurrentPage(8);
                  }}
                >
                  8
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink 
                  isDark={isDark} 
                  href="#" 
                  active={currentPage === 9} 
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    setCurrentPage(9);
                  }}
                >
                  9
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink 
                  isDark={isDark} 
                  href="#" 
                  active={currentPage === 10} 
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    setCurrentPage(10);
                  }}
                >
                  10
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext 
                  isDark={isDark} 
                  href="#" 
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    setCurrentPage(Math.min(10, currentPage + 1));
                  }} 
                />
              </PaginationItem>
            </PaginationContent>
          </PaginationStyled>
        );

      case "Sidebar":
        return (
          <div style={{ width: "100%", height: "500px", position: "relative", overflow: "hidden", border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`, borderRadius: "12px" }}>
            <SidebarStyledProvider defaultOpen={true}>
              <SidebarStyled isDark={isDark} variant="sidebar">
                <SidebarHeader isDark={isDark}>
                  <SidebarHeaderWithToggle isDark={isDark} />
                </SidebarHeader>
                <SidebarContent>
                  <SidebarGroup>
                    <SidebarGroupLabel isDark={isDark}>
                      Main Menu
                    </SidebarGroupLabel>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton isDark={isDark} active>
                          <Home style={{ width: "20px", height: "20px" }} />
                          <span>Dashboard</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton isDark={isDark}>
                          <FileText style={{ width: "20px", height: "20px" }} />
                          <span>Projects</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton isDark={isDark}>
                          <Users style={{ width: "20px", height: "20px" }} />
                          <span>Team</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroup>
                  <SidebarGroup>
                    <SidebarGroupLabel isDark={isDark}>
                      Resources
                    </SidebarGroupLabel>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton isDark={isDark}>
                          <Star style={{ width: "20px", height: "20px" }} />
                          <span>Favorites</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton isDark={isDark}>
                          <Heart style={{ width: "20px", height: "20px" }} />
                          <span>Saved Items</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroup>
                </SidebarContent>
                <SidebarFooter isDark={isDark}>
                  <SidebarMenuButton isDark={isDark}>
                    <Settings style={{ width: "20px", height: "20px" }} />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarFooter>
              </SidebarStyled>
              <SidebarInset>
                <div style={{ padding: "24px" }}>
                  <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px" }}>
                    Main Content Area
                  </h3>
                  <p style={{ fontSize: "14px", opacity: 0.8, lineHeight: 1.6 }}>
                    This is the main content area. The sidebar can be toggled using the button in the header.
                    On mobile devices, the sidebar will slide in as an overlay.
                  </p>
                </div>
              </SidebarInset>
            </SidebarStyledProvider>
          </div>
        );

      case "BottomNavigation":
        const bottomNavItems = [
          {
            id: 'home',
            label: 'Home',
            icon: <Home />,
          },
          {
            id: 'search',
            label: 'Search',
            icon: <Search />,
          },
          {
            id: 'notifications',
            label: 'Alerts',
            icon: <Bell />,
            badge: 3
          },
          {
            id: 'profile',
            label: 'Profile',
            icon: <User />,
          }
        ];
        
        return (
          <div style={{ width: "100%", minHeight: "300px", position: "relative", border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`, borderRadius: "12px", paddingBottom: "60px" }}>
            <div style={{ padding: "24px", textAlign: "center" }}>
              <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>
                Active: {bottomNavActive}
              </h4>
              <p style={{ fontSize: "13px", opacity: 0.6 }}>
                Tap navigation items below
              </p>
            </div>
            <BottomNavigation
              items={bottomNavItems}
              activeId={bottomNavActive}
              isDark={isDark}
              onItemClick={(id) => setBottomNavActive(id)}
            />
          </div>
        );

      case "Chip":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", opacity: 0.8 }}>
                Variants
              </h4>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <Chip label="Default" isDark={isDark} />
                <Chip label="Primary" variant="primary" isDark={isDark} />
                <Chip label="Success" variant="success" isDark={isDark} />
                <Chip label="Warning" variant="warning" isDark={isDark} />
                <Chip label="Error" variant="error" isDark={isDark} />
              </div>
            </div>
            
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", opacity: 0.8 }}>
                Sizes
              </h4>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                <Chip label="Small" size="sm" isDark={isDark} />
                <Chip label="Medium" size="md" isDark={isDark} />
                <Chip label="Large" size="lg" isDark={isDark} />
              </div>
            </div>
            
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", opacity: 0.8 }}>
                With Icons & Actions
              </h4>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <Chip label="Featured" icon={<Star />} variant="primary" isDark={isDark} />
                <Chip label="New" icon={<Zap />} variant="warning" isDark={isDark} />
                <Chip label="Removable" isDark={isDark} onDelete={() => {}} />
                <Chip label="Click Me" variant="primary" isDark={isDark} onClick={() => {}} />
              </div>
            </div>
          </div>
        );

      case "Toast":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%", maxWidth: "500px" }}>
            <ToastProvider isDark={isDark} />
            <Button isDark={isDark} onClick={() => toast.success('Success!', 'Operation completed successfully')}>
              Show Success Toast
            </Button>
            <Button isDark={isDark} onClick={() => toast.error('Error!', 'Something went wrong')}>
              Show Error Toast
            </Button>
            <Button isDark={isDark} onClick={() => toast.warning('Warning!', 'Please check this')}>
              Show Warning Toast
            </Button>
            <Button isDark={isDark} onClick={() => toast.info('Info', 'Here is some information')}>
              Show Info Toast
            </Button>
          </div>
        );

      case "Banner":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
            <Banner
              variant="info"
              title="Information"
              description="This is an informational message."
              isDark={isDark}
            />
            <Banner
              variant="success"
              title="Success"
              description="Your changes have been saved successfully."
              isDark={isDark}
            />
            <Banner
              variant="warning"
              title="Warning"
              description="Your trial period will expire in 3 days."
              isDark={isDark}
              action={{
                label: 'Upgrade Now',
                onClick: () => {}
              }}
            />
            <Banner
              variant="error"
              title="Error"
              description="Unable to connect to the server."
              isDark={isDark}
              dismissible
              onDismiss={() => {}}
            />
          </div>
        );

      case "ProgressBar":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", opacity: 0.8 }}>
                Progress Levels
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <ProgressBar progress={30} isDark={isDark} />
                <ProgressBar progress={60} isDark={isDark} />
                <ProgressBar progress={100} isDark={isDark} />
              </div>
            </div>
            
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", opacity: 0.8 }}>
                Variants
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <ProgressBar progress={50} variant="default" isDark={isDark} />
                <ProgressBar progress={75} variant="success" isDark={isDark} />
                <ProgressBar progress={40} variant="warning" isDark={isDark} />
                <ProgressBar progress={20} variant="error" isDark={isDark} />
              </div>
            </div>
          </div>
        );

      case "Spinner":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", opacity: 0.8 }}>
                Sizes
              </h4>
              <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
                <Spinner size="sm" isDark={isDark} />
                <Spinner size="md" isDark={isDark} />
                <Spinner size="lg" isDark={isDark} />
              </div>
            </div>
            
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", opacity: 0.8 }}>
                Variants
              </h4>
              <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
                <Spinner variant="default" isDark={isDark} />
                <Spinner variant="success" isDark={isDark} />
                <Spinner variant="warning" isDark={isDark} />
                <Spinner variant="error" isDark={isDark} />
              </div>
            </div>
          </div>
        );

      case "LinearProgress":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", opacity: 0.8 }}>
                Indeterminate Progress
              </h4>
              <LinearProgress isDark={isDark} />
            </div>
            
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", opacity: 0.8 }}>
                Variants
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <LinearProgress variant="default" isDark={isDark} />
                <LinearProgress variant="success" isDark={isDark} />
                <LinearProgress variant="warning" isDark={isDark} />
                <LinearProgress variant="error" isDark={isDark} />
              </div>
            </div>
          </div>
        );

      case "Timeline":
        const timelineItems = [
          {
            id: '1',
            title: 'Project Started',
            time: '2 hours ago',
            description: 'The project has been initialized with basic setup.',
            variant: 'success' as const,
            icon: <CheckCircle />
          },
          {
            id: '2',
            title: 'First Milestone',
            time: '1 hour ago',
            description: 'Completed the first phase of development.',
            variant: 'primary' as const,
            icon: <Circle />
          },
          {
            id: '3',
            title: 'Review Pending',
            time: '30 minutes ago',
            description: 'Waiting for code review from the team.',
            variant: 'warning' as const,
            icon: <AlertCircle />
          },
          {
            id: '4',
            title: 'In Progress',
            time: 'Just now',
            description: 'Currently working on the final features.',
            variant: 'default' as const
          }
        ];
        
        return (
          <div style={{ width: "100%", maxWidth: "600px" }}>
            <Timeline items={timelineItems} isDark={isDark} />
          </div>
        );

      case "EmptyState":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
            <EmptyState
              variant="empty"
              title="No items found"
              description="There are no items to display at the moment."
              isDark={isDark}
            />
            
            <EmptyState
              variant="search"
              title="No results"
              description="Try adjusting your search to find what you're looking for."
              isDark={isDark}
              actions={[
                {
                  label: 'Clear Search',
                  onClick: () => {},
                  primary: true
                }
              ]}
            />
          </div>
        );

      case "StatusIndicator":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", opacity: 0.8 }}>
                Basic Status Dots
              </h4>
              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <StatusIndicator variant="success" isDark={isDark} />
                <StatusIndicator variant="warning" isDark={isDark} />
                <StatusIndicator variant="error" isDark={isDark} />
                <StatusIndicator variant="info" isDark={isDark} />
                <StatusIndicator variant="offline" isDark={isDark} />
              </div>
            </div>
            
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", opacity: 0.8 }}>
                With Labels
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <StatusIndicator variant="success" label="Active" isDark={isDark} />
                <StatusIndicator variant="warning" label="Pending" isDark={isDark} />
                <StatusIndicator variant="error" label="Failed" isDark={isDark} />
                <StatusIndicator variant="info" label="Processing" isDark={isDark} />
              </div>
            </div>
            
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", opacity: 0.8 }}>
                With Pulse Animation
              </h4>
              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <StatusIndicator variant="success" pulse isDark={isDark} />
                <StatusIndicator variant="info" label="Live" pulse isDark={isDark} />
              </div>
            </div>
            
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", opacity: 0.8 }}>
                As Badge
              </h4>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <StatusIndicator variant="success" label="Online" showBadge isDark={isDark} />
                <StatusIndicator variant="warning" label="Away" showBadge isDark={isDark} />
                <StatusIndicator variant="error" label="Busy" showBadge isDark={isDark} />
              </div>
            </div>
            
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", opacity: 0.8 }}>
                Online Status
              </h4>
              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <OnlineStatus online isDark={isDark} />
                <OnlineStatus online={false} isDark={isDark} />
              </div>
            </div>
          </div>
        );

      case "DataTable":
        const tableColumns = [
          { key: 'name', header: 'Name', sortable: true },
          { key: 'email', header: 'Email', sortable: true },
          { key: 'role', header: 'Role', sortable: true },
          { key: 'status', header: 'Status', sortable: true }
        ];

        const tableData = [
          { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'Active' },
          { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
          { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'Admin', status: 'Active' },
          { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'User', status: 'Active' },
          { id: 6, name: 'Diana Davis', email: 'diana@example.com', role: 'Editor', status: 'Inactive' },
          { id: 7, name: 'Eve Martinez', email: 'eve@example.com', role: 'User', status: 'Active' },
          { id: 8, name: 'Frank Wilson', email: 'frank@example.com', role: 'Editor', status: 'Active' }
        ];

        return (
          <div style={{ width: "100%" }}>
            <DataTable
              title="User Management"
              columns={tableColumns}
              data={tableData}
              pageSize={5}
              searchable
              searchPlaceholder="Search users..."
              isDark={isDark}
            />
          </div>
        );

      case "StatCard":
        return (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px", width: "100%" }}>
            <StatCard
              title="Total Users"
              value="12,543"
              change={{ value: '+12.5%', trend: 'up', label: 'vs last month' }}
              icon={<Users />}
              iconColor="blue"
              isDark={isDark}
            />
            <StatCard
              title="Revenue"
              value="$45,231"
              change={{ value: '+8.2%', trend: 'up', label: 'vs last month' }}
              icon={<DollarSign />}
              iconColor="green"
              isDark={isDark}
            />
            <StatCard
              title="Bounce Rate"
              value="42.3%"
              change={{ value: '-3.1%', trend: 'down', label: 'vs last month' }}
              icon={<Activity />}
              iconColor="red"
              isDark={isDark}
            />
            <StatCard
              title="Conversions"
              value="3.2%"
              change={{ value: '+0.5%', trend: 'up', label: 'vs last month' }}
              icon={<TrendingUp />}
              iconColor="orange"
              isDark={isDark}
            />
          </div>
        );

      case "KPICard":
        return (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px", width: "100%" }}>
            <KPICard
              title="Sales Performance"
              subtitle="Q4 2024"
              value="$124,563"
              change={{ value: '+23.4%', trend: 'up', label: 'vs Q3 2024' }}
              metrics={[
                { label: 'Orders', value: '1,234' },
                { label: 'Avg. Order', value: '$101' },
                { label: 'Conversion', value: '3.2%' },
                { label: 'Customers', value: '892' }
              ]}
              isDark={isDark}
            />
            <KPICard
              title="Monthly Revenue"
              subtitle="December 2024"
              value="$45,231"
              change={{ value: '+18.2%', trend: 'up', label: 'vs last month' }}
              metrics={[
                { label: 'New Sales', value: '$32,543' },
                { label: 'Recurring', value: '$12,688' },
                { label: 'Refunds', value: '$1,245' },
                { label: 'Net', value: '$44,986' }
              ]}
              isDark={isDark}
            />
          </div>
        );

      case "DataChart":
        const chartData = [
          { name: 'Jan', value: 400, sales: 240 },
          { name: 'Feb', value: 300, sales: 139 },
          { name: 'Mar', value: 600, sales: 380 },
          { name: 'Apr', value: 800, sales: 430 },
          { name: 'May', value: 500, sales: 210 },
          { name: 'Jun', value: 700, sales: 350 }
        ];

        const pieData = [
          { name: 'Desktop', value: 400 },
          { name: 'Mobile', value: 300 },
          { name: 'Tablet', value: 200 }
        ];

        return (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px", width: "100%" }}>
            <DataLineChart
              title="Monthly Revenue"
              subtitle="Last 6 months"
              data={chartData}
              dataKey="value"
              xAxisKey="name"
              color="blue"
              height={250}
              showGrid
              isDark={isDark}
            />
            <DataBarChart
              title="Sales by Month"
              subtitle="Last 6 months"
              data={chartData}
              dataKey="sales"
              xAxisKey="name"
              color="green"
              height={250}
              isDark={isDark}
            />
            <DataAreaChart
              title="User Growth"
              subtitle="Last 6 months"
              data={chartData}
              dataKey="value"
              xAxisKey="name"
              color="purple"
              height={250}
              isDark={isDark}
            />
            <DataPieChart
              title="Device Distribution"
              subtitle="Current month"
              data={pieData}
              dataKey="value"
              nameKey="name"
              colors={['blue', 'green', 'orange']}
              height={250}
              isDark={isDark}
            />
          </div>
        );

      case "DataList":
        const listItems = [
          {
            id: 1,
            title: 'John Doe',
            description: 'Software Engineer at Tech Corp',
            icon: <Users />,
            meta: 'Active'
          },
          {
            id: 2,
            title: 'Jane Smith',
            description: 'Product Designer at Design Studio',
            icon: <Users />,
            meta: 'Active'
          },
          {
            id: 3,
            title: 'Bob Johnson',
            description: 'Marketing Manager',
            icon: <Users />,
            meta: 'Away'
          }
        ];

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
            <DataList
              title="Team Members"
              items={listItems}
              showActions
              isDark={isDark}
            />
            <GridList
              items={listItems}
              columns={2}
              isDark={isDark}
            />
          </div>
        );

      case "TreeView":
        const treeData = [
          {
            id: '1',
            label: 'src',
            icon: <Folder />,
            children: [
              {
                id: '1-1',
                label: 'components',
                children: [
                  { id: '1-1-1', label: 'Button.tsx', icon: <FileText /> },
                  { id: '1-1-2', label: 'Input.tsx', icon: <FileText /> }
                ]
              },
              { id: '1-2', label: 'utils', icon: <Folder />, children: [] }
            ]
          },
          {
            id: '2',
            label: 'public',
            icon: <Folder />,
            children: [
              { id: '2-1', label: 'index.html', icon: <FileText /> }
            ]
          }
        ];

        return (
          <div style={{ width: "100%", maxWidth: "500px" }}>
            <TreeView
              title="Project Structure"
              data={treeData}
              defaultExpandedIds={['1']}
              isDark={isDark}
            />
          </div>
        );

      case "DateTimePicker":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%", minHeight: "450px", overflow: "visible" }}>
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", opacity: 0.8 }}>
                Date Picker
              </h4>
              <DatePicker
                placeholder="Select date"
                isDark={isDark}
              />
            </div>
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", opacity: 0.8 }}>
                Time Picker
              </h4>
              <TimePicker
                placeholder="Select time"
                isDark={isDark}
              />
            </div>
          </div>
        );

      case "SearchFilter":
        const filterGroups = [
          {
            id: 'status',
            label: 'Status',
            options: [
              { id: 'active', label: 'Active' },
              { id: 'inactive', label: 'Inactive' },
              { id: 'pending', label: 'Pending' }
            ]
          },
          {
            id: 'role',
            label: 'Role',
            options: [
              { id: 'admin', label: 'Admin' },
              { id: 'editor', label: 'Editor' },
              { id: 'user', label: 'User' }
            ]
          }
        ];

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%", minHeight: "400px", overflow: "visible" }}>
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", opacity: 0.8 }}>
                Search Bar
              </h4>
              <SearchBar
                value=""
                onChange={() => {}}
                placeholder="Search..."
                isDark={isDark}
              />
            </div>
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", opacity: 0.8 }}>
                Search with Filters
              </h4>
              <SearchFilter
                searchValue=""
                onSearchChange={() => {}}
                filterGroups={filterGroups}
                selectedFilters={{}}
                onFilterChange={() => {}}
                onClearFilters={() => {}}
                isDark={isDark}
              />
            </div>
          </div>
        );

      case "MultiSelect":
        const selectOptions = [
          { id: '1', label: 'React' },
          { id: '2', label: 'TypeScript' },
          { id: '3', label: 'JavaScript' },
          { id: '4', label: 'Node.js' },
          { id: '5', label: 'Python' }
        ];

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%", minHeight: "350px", overflow: "visible" }}>
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", opacity: 0.8 }}>
                Multi-Select Dropdown
              </h4>
              <MultiSelect
                options={selectOptions}
                value={[]}
                onChange={() => {}}
                placeholder="Select technologies..."
                searchable
                maxTags={3}
                isDark={isDark}
              />
            </div>
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", opacity: 0.8 }}>
                Tag Selector
              </h4>
              <TagSelector
                options={selectOptions}
                value={[]}
                onChange={() => {}}
                multiSelect
                isDark={isDark}
              />
            </div>
          </div>
        );

      default:
        return (
          <EmptyMessage $isDark={isDark}>
            Preview coming soon...
          </EmptyMessage>
        );
    }
  };

  return (
    <ShowcaseContainer $isDark={isDark}>
      {renderComponent()}
    </ShowcaseContainer>
  );
}

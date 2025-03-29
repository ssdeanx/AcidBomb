'use client';

import * as React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Typography,
  Divider,
  useTheme,
  styled,
  alpha,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Dashboard,
  Psychology,
  Science,
  QueryStats,
  Settings,
  Help,
  ExpandLess,
  ExpandMore,
  Chat,
  Timeline,
} from '@mui/icons-material';

export interface SidebarItem {
  /**
   * Item title
   */
  title: string;

  /**
   * Icon component
   */
  icon?: React.ReactElement;

  /**
   * Path for navigation
   */
  path?: string;

  /**
   * Nested items
   */
  items?: SidebarItem[];

  /**
   * If true, marks item as active
   */
  active?: boolean;
}

export interface SidebarProps {
  /**
   * Array of navigation items
   */
  items?: SidebarItem[];

  /**
   * Width of the sidebar when expanded
   * @default 240
   */
  width?: number;

  /**
   * If true, sidebar will be collapsed
   * @default false
   */
  collapsed?: boolean;

  /**
   * Callback when an item is selected
   */
  onItemSelect?: (path: string) => void;

  /**
   * Callback when collapse state changes
   */
  onCollapse?: (collapsed: boolean) => void;

  /**
   * Custom className
   */
  className?: string;
}

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => !['sidebarWidth'].includes(prop as string),
})<{ sidebarWidth: number }>(({ theme, sidebarWidth }) => ({
  width: sidebarWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  '& .MuiDrawer-paper': {
    width: sidebarWidth,
    boxSizing: 'border-box',
    borderRight: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    transition: theme.transitions.create(['width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  margin: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  '&.active': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
}));

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({
    items = defaultItems,
    width = 240,
    collapsed = false,
    onItemSelect,
    onCollapse,
    className,
    ...props
  }, ref) => {
    const theme = useTheme();
    const [open, setOpen] = React.useState(!collapsed);
    const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

    const handleDrawerToggle = () => {
      setOpen(!open);
      onCollapse?.(!open);
    };

    const handleItemClick = (path: string) => {
      onItemSelect?.(path);
    };

    const handleExpandClick = (title: string) => {
      setExpandedItems((prev) =>
        prev.includes(title)
          ? prev.filter((item) => item !== title)
          : [...prev, title]
      );
    };

    const renderItems = (items: SidebarItem[], level = 0) => {
      return items.map((item) => {
        const hasChildren = item.items && item.items.length > 0;
        const isExpanded = expandedItems.includes(item.title);

        return (
          <React.Fragment key={item.title}>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <StyledListItemButton
                onClick={() => {
                  if (hasChildren) {
                    handleExpandClick(item.title);
                  } else if (item.path) {
                    handleItemClick(item.path);
                  }
                }}
                className={item.active ? 'active' : ''}
                sx={{ pl: level * 2 + 2 }}
              >
                {item.icon && (
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                )}
                <ListItemText
                  primary={item.title}
                  sx={{
                    opacity: open ? 1 : 0,
                    display: open ? 'block' : 'none',
                  }}
                />
                {hasChildren && open && (
                  <>
                    {isExpanded ? <ExpandLess /> : <ExpandMore />}
                  </>
                )}
              </StyledListItemButton>
            </ListItem>
            {hasChildren && (
              <Collapse in={isExpanded && open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {renderItems(item.items!, level + 1)}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        );
      });
    };

    return (
      <StyledDrawer
        ref={ref}
        variant="permanent"
        sidebarWidth={open ? width : Number(theme.spacing(7))}
        className={className}
        {...props}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {open && (
            <Typography variant="h6" noWrap>
              Dashboard
            </Typography>
          )}
          <IconButton onClick={handleDrawerToggle}>
            {open ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </Box>
        <Divider />
        <List component="nav">
          {renderItems(items)}
        </List>
      </StyledDrawer>
    );
  }
);

Sidebar.displayName = 'Sidebar';

const defaultItems: SidebarItem[] = [
  {
    title: 'Overview',
    icon: <Dashboard />,
    path: '/dashboard',
  },
  {
    title: 'Chat',
    icon: <Chat />,
    path: '/dashboard/chat',
  },
  {
    title: 'Prompts',
    icon: <Psychology />,
    path: '/dashboard/prompt_manager',
  },
  {
    title: 'Traces',
    icon: <Timeline />,
    path: '/dashboard/traces',
  },
  {
    title: 'Models',
    icon: <Science />,
    path: '/dashboard/models',
  },
  {
    title: 'Metrics',
    icon: <QueryStats />,
    path: '/dashboard/metrics',
  },
  {
    title: 'Settings',
    icon: <Settings />,
    path: '/dashboard/settings'
  }
];

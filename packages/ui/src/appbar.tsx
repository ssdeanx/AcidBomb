'use client';

import * as React from 'react';
import {
  AppBar as MuiAppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Home,
  Dashboard,
  Description,
  Info,
  ChevronRight,
  Close
} from '@mui/icons-material';

interface NavigationItem {
  label: string;
  path: string;
  icon: React.ReactElement;
}

const navigationItems: NavigationItem[] = [
  { label: 'Home', path: '/', icon: <Home /> },
  { label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
  { label: 'Documentation', path: '/documentation', icon: <Description /> },
  { label: 'About', path: '/about', icon: <Info /> },
];

export interface AppBarProps {
  /**
   * The title to display in the AppBar
   */
  title?: string;

  /**
   * Logo component or element to display
   */
  logo?: React.ReactNode;

  /**
   * Custom navigation items
   */
  navigationItems?: NavigationItem[];

  /**
   * Function called when a navigation item is clicked
   */
  onNavigate?: (path: string) => void;

  /**
   * Function called when profile menu items are clicked
   */
  onProfileAction?: (action: 'profile' | 'settings' | 'logout') => void;

  /**
   * Whether to show the profile button
   * @default true
   */
  showProfileButton?: boolean;

  /**
   * Additional profile menu items
   */
  profileMenuItems?: Array<{
    label: string;
    action: string;
  }>;
}

export const AppBar = ({
  title = 'DeanMachines',
  logo,
  navigationItems: customNavigationItems,
  onNavigate,
  onProfileAction,
  showProfileButton = true,
  profileMenuItems = [],
}: AppBarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const items = customNavigationItems || navigationItems;

  const handleProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      // Default navigation handler
      console.log(`Navigating to: ${path}`);
    }

    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleProfileMenuItem = (action: 'profile' | 'settings' | 'logout' | string) => {
    handleMenuClose();
    if (onProfileAction) {
      onProfileAction(action as any);
    } else {
      console.log(`Profile action: ${action}`);
    }
  };

  const navigationList = (
    <List>
      {items.map(({ label, path, icon }) => (
        <ListItem
          key={path}
          onClick={() => handleNavigation(path)}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            {icon}
          </ListItemIcon>
          <ListItemText primary={label} />
          <ChevronRight sx={{ opacity: 0.5 }} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <MuiAppBar
        position="static"
        elevation={0}
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {logo ? (
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              {logo}
            </Box>
          ) : null}

          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              color: theme.palette.text.primary,
              fontWeight: 600,
              letterSpacing: -0.5
            }}
          >
            {title}
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {items.map(({ label, path }) => (
                <Button
                  key={path}
                  onClick={() => handleNavigation(path)}
                  sx={{
                    color: theme.palette.text.primary,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    }
                  }}
                >
                  {label}
                </Button>
              ))}
            </Box>
          )}

          {showProfileButton && (
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleProfileMenu}
              color="inherit"
              sx={{ ml: 2 }}
            >
              <AccountCircle />
            </IconButton>
          )}

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleProfileMenuItem('profile')}>Profile</MenuItem>
            <MenuItem onClick={() => handleProfileMenuItem('settings')}>Settings</MenuItem>
            {profileMenuItems.map((item) => (
              <MenuItem key={item.action} onClick={() => handleProfileMenuItem(item.action)}>
                {item.label}
              </MenuItem>
            ))}
            <Divider />
            <MenuItem onClick={() => handleProfileMenuItem('logout')}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </MuiAppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Navigation
          </Typography>
          <IconButton onClick={handleDrawerToggle}>
            <Close />
          </IconButton>
        </Box>
        <Divider />
        {navigationList}
      </Drawer>
    </Box>
  );
};

AppBar.displayName = 'AppBar';

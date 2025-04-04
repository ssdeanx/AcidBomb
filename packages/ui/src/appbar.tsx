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
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Popover,
  Avatar,
  Tooltip,
  ListItemButton
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Home,
  Dashboard,
  Description,
  Info,
  ChevronRight,
  Close,
  Login,
  Logout,
  Settings,
  Person,
  PriceChange,
  Handyman,
  LightMode,
  DarkMode,
  BrightnessAuto
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from './theme/ThemeProvider'; // Adjust path if necessary

/**
 * Represents a navigation item in the application
 */
interface NavigationItem {
  /** Display label for the navigation item */
  label: string;
  /** URL path for navigation */
  path: string;
  /** Icon component to display with the navigation item */
  icon: React.ReactElement;
  /** Whether this item should only be shown to authenticated users */
  requiresAuth?: boolean;
}

/**
 * Available theme modes for the application
 */
export type ThemeMode = 'light' | 'dark' | 'system';

const navigationItems: NavigationItem[] = [
  { label: 'Home', path: '/', icon: <Home /> },
  { label: 'Documentation', path: '/documentation', icon: <Description /> },
  { label: 'Services', path: '/services', icon: <Handyman /> },
  { label: 'Pricing', path: '/pricing', icon: <PriceChange /> },
  { label: 'About', path: '/about', icon: <Info /> },
  { label: 'Dashboard', path: '/private', icon: <Dashboard />, requiresAuth: true },
];

/**
 * Props for the AppBar component
 */
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
  onProfileAction?: (action: 'profile' | 'settings' | 'logout' | 'login' | 'signup') => void;

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

  /**
   * Whether the user is authenticated
   * @default false
   */
  isAuthenticated?: boolean;

  /**
   * User data if authenticated
   */
  user?: {
    name?: string;
    email?: string;
    avatarUrl?: string;
  };
}

/**
 * Application navigation bar component that adapts to different screen sizes
 * and authentication states. Includes theme toggling functionality using ThemeContext.
 *
 * @param props - Component properties
 * @returns React component
 */
export const AppBar = ({
  title = 'DeanMachines',
  logo,
  navigationItems: customNavigationItems,
  onNavigate,
  onProfileAction,
  showProfileButton = true,
  profileMenuItems = [],
  isAuthenticated = false,
  user,
}: AppBarProps) => {
  const { mode: themeMode, setMode: setThemeMode, ...theme } = useTheme(); // Destructure mode and setMode from context
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [authAnchorEl, setAuthAnchorEl] = React.useState<null | HTMLElement>(null);
  const [themeMenuAnchorEl, setThemeMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const items = customNavigationItems || navigationItems.filter(item =>
    !item.requiresAuth || (item.requiresAuth && isAuthenticated)
  );

  const handleProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAuthButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAuthAnchorEl(event.currentTarget);
  };

  const handleAuthMenuClose = () => {
    setAuthAnchorEl(null);
  };

  const handleThemeMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setThemeMenuAnchorEl(event.currentTarget);
  };

  const handleThemeMenuClose = () => {
    setThemeMenuAnchorEl(null);
  };

  const handleThemeChange = (newMode: ThemeMode) => {
    setThemeMode(newMode); // Call the function from context
    handleThemeMenuClose();
  };

  /**
   * Gets the appropriate theme icon based on the current theme mode from context
   */
  const getThemeIcon = () => {
    switch (themeMode) {
      case 'light':
        return <LightMode />;
      case 'dark':
        return <DarkMode />;
      case 'system':
      default:
        return <BrightnessAuto />;
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      // Use Next.js router for navigation
      router.push(path);
    }

    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleProfileMenuItem = (action: 'profile' | 'settings' | 'logout' | 'login' | 'signup' | string) => {
    handleMenuClose();

    if (onProfileAction) {
      onProfileAction(action as any);
    } else {
      // Default actions
      switch (action) {
        case 'login':
          router.push('/login');
          break;
        case 'signup':
          router.push('/login?mode=signup');
          break;
        case 'logout':
          // Handle logout - this would typically call a logout function
          console.log('Logging out');
          router.push('/');
          break;
        case 'profile':
          router.push('/private');
          break;
        case 'settings':
          router.push('/private/settings');
          break;
        default:
          console.log(`Profile action: ${action}`);
      }
    }
  };

  const handleAuthMenuItem = (action: 'login' | 'signup') => {
    handleAuthMenuClose();
    handleProfileMenuItem(action);
  };

  const navigationList = (
    <List>
      {items.map(({ label, path, icon }) => {
        const isActive = pathname === path;

        return (
          <ListItem key={path} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(path)}
              selected={isActive}
              sx={{
                borderRadius: 1,
                my: 0.5,
                mx: 1,
                '&.Mui-selected': {
                  bgcolor: 'action.selected',
                }
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: isActive ? 'primary.main' : 'inherit'
                }}
              >
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{
                  color: isActive ? 'primary' : 'inherit',
                  fontWeight: isActive ? 600 : 400
                }}
              />
              {isActive && <ChevronRight color="primary" fontSize="small" />}
            </ListItemButton>
          </ListItem>
        );
      })}

      {/* Add Theme toggle in mobile drawer */}
      <Divider sx={{ my: 1 }} />
      <ListItem>
        <ListItemText primary="Theme" primaryTypographyProps={{ fontWeight: 500 }} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            size="small"
            color={themeMode === 'light' ? 'primary' : 'default'}
            onClick={() => handleThemeChange('light')}
            aria-label="Light theme"
          >
            <LightMode fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color={themeMode === 'system' ? 'primary' : 'default'}
            onClick={() => handleThemeChange('system')}
            aria-label="System theme"
            sx={{ mx: 1 }}
          >
            <BrightnessAuto fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color={themeMode === 'dark' ? 'primary' : 'default'}
            onClick={() => handleThemeChange('dark')}
            aria-label="Dark theme"
          >
            <DarkMode fontSize="small" />
          </IconButton>
        </Box>
      </ListItem>
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
          ) : (
            <Typography
              variant="h6"
              component={Link}
              href="/"
              sx={{
                flexGrow: 0,
                mr: 4,
                color: theme.palette.text.primary,
                fontWeight: 600,
                letterSpacing: -0.5,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'none',
                }
              }}
            >
              {title}
            </Typography>
          )}

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {items.filter(item => !item.requiresAuth).map(({ label, path }) => {
                const isActive = pathname === path;

                return (
                  <Button
                    key={path}
                    component={Link}
                    href={path}
                    sx={{
                      color: isActive ? 'primary.main' : 'text.primary',
                      fontWeight: isActive ? 600 : 400,
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                      ...(isActive && {
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: '20%',
                          width: '60%',
                          height: 2,
                          bgcolor: 'primary.main',
                        }
                      })
                    }}
                  >
                    {label}
                  </Button>
                );
              })}
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {/* Theme Toggle */}
          <Tooltip title="Change theme">
            <IconButton
              color="inherit"
              onClick={handleThemeMenuOpen}
              size="small"
              aria-label="Change theme mode"
              aria-controls={Boolean(themeMenuAnchorEl) ? 'theme-menu' : undefined}
              aria-expanded={Boolean(themeMenuAnchorEl) ? 'true' : undefined}
              aria-haspopup="true"
              sx={{
                ml: 1,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                p: 0.75,
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'action.hover',
                  color: 'text.primary',
                }
              }}
            >
              {getThemeIcon()}
            </IconButton>
          </Tooltip>

          <Menu
            id="theme-menu"
            anchorEl={themeMenuAnchorEl}
            open={Boolean(themeMenuAnchorEl)}
            onClose={handleThemeMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              elevation: 3,
              sx: {
                minWidth: 180,
                mt: 0.5,
                borderRadius: 1,
                overflow: 'visible',
                border: `1px solid ${theme.palette.divider}`,
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  borderLeft: `1px solid ${theme.palette.divider}`,
                  borderTop: `1px solid ${theme.palette.divider}`,
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                }
              }
            }}
          >
            <MenuItem
              onClick={() => handleThemeChange('light')}
              selected={themeMode === 'light'}
            >
              <ListItemIcon>
                <LightMode fontSize="small" />
              </ListItemIcon>
              Light
            </MenuItem>
            <MenuItem
              onClick={() => handleThemeChange('dark')}
              selected={themeMode === 'dark'}
            >
              <ListItemIcon>
                <DarkMode fontSize="small" />
              </ListItemIcon>
              Dark
            </MenuItem>
            <MenuItem
              onClick={() => handleThemeChange('system')}
              selected={themeMode === 'system'}
            >
              <ListItemIcon>
                <BrightnessAuto fontSize="small" />
              </ListItemIcon>
              System
            </MenuItem>
          </Menu>

          {/* Authentication / Profile section */}
          {isAuthenticated ? (
            // Authenticated user view
            <>
              {!isMobile && items.filter(item => item.requiresAuth).map(({ label, path }) => {
                const isActive = pathname === path;

                return (
                  <Button
                    key={path}
                    component={Link}
                    href={path}
                    sx={{
                      color: isActive ? 'primary.main' : 'text.primary',
                      fontWeight: isActive ? 600 : 400,
                      ml: 1,
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      }
                    }}
                  >
                    {label}
                  </Button>
                );
              })}

              {showProfileButton && (
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleProfileMenu}
                  color="inherit"
                  sx={{ ml: 1 }}
                >
                  {user?.avatarUrl ? (
                    <Avatar
                      src={user.avatarUrl}
                      alt={user.name || user.email || 'User'}
                      sx={{ width: 32, height: 32 }}
                    />
                  ) : (
                    <AccountCircle />
                  )}
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
                PaperProps={{
                  elevation: 3,
                  sx: {
                    minWidth: 200,
                    mt: 0.5,
                    borderRadius: 1,
                  }
                }}
              >
                <MenuItem onClick={() => handleProfileMenuItem('profile')}>
                  <ListItemIcon>
                    <Person fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => handleProfileMenuItem('settings')}>
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem>
                {profileMenuItems.map((item) => (
                  <MenuItem key={item.action} onClick={() => handleProfileMenuItem(item.action)}>
                    {item.label}
                  </MenuItem>
                ))}
                <Divider />
                <MenuItem onClick={() => handleProfileMenuItem('logout')}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            // Unauthenticated user view
            <>
              <Button
                color="primary"
                variant="contained"
                startIcon={<Login />}
                onClick={handleAuthButtonClick}
                sx={{
                  ml: 2,
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontWeight: 500,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }
                }}
              >
                Login / Sign Up
              </Button>

              <Popover
                open={Boolean(authAnchorEl)}
                anchorEl={authAnchorEl}
                onClose={handleAuthMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    borderRadius: 1.5,
                    overflow: 'visible',
                    mt: 0.5,
                    width: 280,
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 20,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  }
                }}
              >
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Welcome to DeanMachines
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Sign in to access your dashboard and build AI solutions
                  </Typography>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => handleAuthMenuItem('login')}
                    sx={{ mb: 1.5, borderRadius: 1, py: 1, boxShadow: 'none' }}
                  >
                    Login
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleAuthMenuItem('signup')}
                    sx={{ borderRadius: 1, py: 1 }}
                  >
                    Create Account
                  </Button>
                </Box>
              </Popover>
            </>
          )}
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
            backgroundColor: 'background.paper',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Navigation
          </Typography>
          <IconButton onClick={handleDrawerToggle} aria-label="close menu">
            <Close />
          </IconButton>
        </Box>
        <Divider />
        {navigationList}
        {!isAuthenticated && (
          <>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ px: 2, py: 3 }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<Login />}
                onClick={() => handleProfileMenuItem('login')}
                sx={{ mb: 1.5, borderRadius: 1, py: 1, boxShadow: 'none' }}
              >
                Login
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => handleProfileMenuItem('signup')}
                sx={{ borderRadius: 1, py: 1 }}
              >
                Sign Up
              </Button>
            </Box>
          </>
        )}
      </Drawer>
    </Box>
  );
};

AppBar.displayName = 'AppBar';

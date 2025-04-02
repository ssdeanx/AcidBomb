'use client';

import * as React from 'react';
import {
  styled,
  alpha,
  useTheme,
  Box,
  Typography,
} from '@mui/material';
import {
  KeyboardArrowDown,
  CheckCircle,
} from '@mui/icons-material';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

/**
 * Type definition for dropdown menu items
 * @interface DropdownItem
 */
export interface DropdownItem {
  /**
   * Unique identifier for the item
   */
  id: string;

  /**
   * Label text to display
   */
  label: string;

  /**
   * Optional icon to display next to the label
   */
  icon?: React.ReactNode;

  /**
   * Whether the item is currently disabled
   */
  disabled?: boolean;

  /**
   * Whether the item is a separator
   */
  isSeparator?: boolean;

  /**
   * Whether the item has a checkbox
   */
  isCheckbox?: boolean;

  /**
   * Whether the checkbox is checked (only applies if isCheckbox is true)
   */
  checked?: boolean;

  /**
   * Additional description text to display below the label
   */
  description?: string;

  /**
   * For nested dropdown items
   */
  items?: DropdownItem[];
}

/**
 * Props for the Dropdown component
 * @interface DropdownProps
 */
export interface DropdownProps {
  /**
   * The trigger element that opens the dropdown
   */
  trigger: React.ReactNode;

  /**
   * Array of dropdown items to display
   */
  items: DropdownItem[];

  /**
   * Callback function when an item is selected
   * @param item The selected item
   */
  onItemSelect?: (item: DropdownItem) => void;

  /**
   * Callback for checkbox state changes
   * @param item The item whose checkbox changed
   * @param checked The new checked state
   */
  onCheckboxChange?: (item: DropdownItem, checked: boolean) => void;

  /**
   * Width of the dropdown menu
   * @default 220
   */
  width?: number;

  /**
   * Alignment of the dropdown relative to trigger
   * @default 'end'
   */
  align?: 'start' | 'center' | 'end';

  /**
   * Side of the trigger where the dropdown appears
   * @default 'bottom'
   */
  side?: 'top' | 'right' | 'bottom' | 'left';

  /**
   * Whether the dropdown menu has a subtle animation
   * @default true
   */
  animated?: boolean;

  /**
   * Whether to close the dropdown when an item is clicked
   * @default true
   */
  closeOnItemClick?: boolean;

  /**
   * Custom CSS class for the dropdown
   */
  className?: string;

  /**
   * Whether to show check icons for selected items
   * @default true
   */
  showCheckIcons?: boolean;
}

// Styled components for the dropdown
const StyledContent = styled(DropdownMenuPrimitive.Content)(({ theme }) => ({
  minWidth: 220,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(0.5),
  boxShadow: theme.shadows[3],
  animationDuration: '400ms',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  willChange: 'transform, opacity',
  zIndex: theme.zIndex.modal,
  overflow: 'hidden',
}));

const StyledItem = styled(DropdownMenuPrimitive.Item)<{ disabled?: boolean }>(
  ({ theme, disabled }) => ({
    fontSize: 14,
    lineHeight: 1,
    color: disabled ? theme.palette.text.disabled : theme.palette.text.primary,
    borderRadius: theme.shape.borderRadius,
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1, 1.5),
    position: 'relative',
    userSelect: 'none',
    outline: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',

    '&[data-highlighted]': !disabled && {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },

    '&[data-disabled]': {
      color: theme.palette.text.disabled,
    },
  })
);

const StyledCheckboxItem = styled(DropdownMenuPrimitive.CheckboxItem)<{ disabled?: boolean }>(
  ({ theme, disabled }) => ({
    fontSize: 14,
    lineHeight: 1,
    color: disabled ? theme.palette.text.disabled : theme.palette.text.primary,
    borderRadius: theme.shape.borderRadius,
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1, 1.5),
    position: 'relative',
    userSelect: 'none',
    outline: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',

    '&[data-highlighted]': !disabled && {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },

    '&[data-disabled]': {
      color: theme.palette.text.disabled,
      pointerEvents: 'none',
    },
  })
);

const StyledSubTrigger = styled(DropdownMenuPrimitive.SubTrigger)<{ disabled?: boolean }>(
  ({ theme, disabled }) => ({
    fontSize: 14,
    lineHeight: 1,
    color: disabled ? theme.palette.text.disabled : theme.palette.text.primary,
    borderRadius: theme.shape.borderRadius,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1, 1.5),
    position: 'relative',
    userSelect: 'none',
    outline: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',

    '&[data-highlighted]': !disabled && {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },

    '&[data-state="open"]': {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },
  })
);

const StyledSeparator = styled(DropdownMenuPrimitive.Separator)(({ theme }) => ({
  height: 1,
  backgroundColor: theme.palette.divider,
  margin: theme.spacing(0.5, 0),
}));

const StyledItemIcon = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  marginRight: theme.spacing(1.5),
  color: theme.palette.text.secondary,
  flexShrink: 0,
}));

const StyledItemIndicator = styled(DropdownMenuPrimitive.ItemIndicator)(({ theme }) => ({
  position: 'absolute',
  left: theme.spacing(0.5),
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledRightSlot = styled('div')(({ theme }) => ({
  marginLeft: 'auto',
  paddingLeft: theme.spacing(2),
  color: theme.palette.text.secondary,
}));

const StyledDescription = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(0.5),
}));

/**
 * Dropdown component for displaying a dropdown menu with various item types
 * Built using Radix UI DropdownMenu primitive with Material UI styling
 *
 * @component
 * @example
 * ```tsx
 * const items = [
 *   { id: 'edit', label: 'Edit', icon: <EditIcon /> },
 *   { id: 'duplicate', label: 'Duplicate' },
 *   { id: 'separator-1', isSeparator: true },
 *   { id: 'archive', label: 'Archive', disabled: true },
 *   { id: 'settings', label: 'Settings', items: [
 *     { id: 'general', label: 'General' },
 *     { id: 'advanced', label: 'Advanced' },
 *   ]},
 *   { id: 'dark-mode', label: 'Dark Mode', isCheckbox: true, checked: true },
 * ];
 *
 * const handleSelect = (item) => {
 *   console.log(`Selected: ${item.label}`);
 * };
 *
 * return (
 *   <Dropdown
 *     trigger={<Button>Options</Button>}
 *     items={items}
 *     onItemSelect={handleSelect}
 *   />
 * );
 * ```
 */
export const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      trigger,
      items,
      onItemSelect,
      onCheckboxChange,
      width = 220,
      align = 'end',
      side = 'bottom',
      animated = true,
      closeOnItemClick = true,
      className,
      showCheckIcons = true,
      ...props
    },
    ref
  ) => {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleItemClick = (item: DropdownItem) => {
      if (item.disabled || item.isSeparator) return;

      if (onItemSelect) {
        onItemSelect(item);
      }

      if (closeOnItemClick && !item.isCheckbox && !item.items) {
        setOpen(false);
      }
    };

    const handleCheckboxChange = (item: DropdownItem, checked: boolean) => {
      if (onCheckboxChange) {
        onCheckboxChange(item, checked);
      }
    };

    // Recursive function to render dropdown items and nested submenus
    const renderItems = (menuItems: DropdownItem[]) => {
      return menuItems.map((item) => {
        if (item.isSeparator) {
          return <StyledSeparator key={item.id} />;
        }

        if (item.items) {
          return (
            <DropdownMenuPrimitive.Sub key={item.id}>
              <StyledSubTrigger disabled={item.disabled}>
                {item.icon && (
                  <StyledItemIcon>{item.icon}</StyledItemIcon>
                )}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2">{item.label}</Typography>
                  {item.description && (
                    <StyledDescription variant="caption">
                      {item.description}
                    </StyledDescription>
                  )}
                </Box>
                <StyledRightSlot>
                  <KeyboardArrowDown
                    style={{
                      fontSize: 18,
                      transform: 'rotate(-90deg)',
                    }}
                  />
                </StyledRightSlot>
              </StyledSubTrigger>
              <DropdownMenuPrimitive.Portal>
                <StyledContent
                  sideOffset={5}
                  alignOffset={-5}
                  style={{ width }}
                >
                  {renderItems(item.items)}
                </StyledContent>
              </DropdownMenuPrimitive.Portal>
            </DropdownMenuPrimitive.Sub>
          );
        }

        if (item.isCheckbox) {
          return (
            <StyledCheckboxItem
              key={item.id}
              checked={item.checked}
              disabled={item.disabled}
              onCheckedChange={(checked: boolean) => {
                handleCheckboxChange(item, checked);
              }}
              onSelect={() => handleItemClick(item)}
            >
              {showCheckIcons && (
                <StyledItemIndicator>
                  <CheckCircle fontSize="small" color="primary" />
                </StyledItemIndicator>
              )}
              <Box sx={{ pl: showCheckIcons ? 3 : 0 }}>
                {item.icon && (
                  <StyledItemIcon>{item.icon}</StyledItemIcon>
                )}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2">{item.label}</Typography>
                  {item.description && (
                    <StyledDescription variant="caption">
                      {item.description}
                    </StyledDescription>
                  )}
                </Box>
              </Box>
            </StyledCheckboxItem>
          );
        }

        return (
          <StyledItem
            key={item.id}
            disabled={item.disabled}
            onSelect={() => handleItemClick(item)}
          >
            {item.icon && (
              <StyledItemIcon>{item.icon}</StyledItemIcon>
            )}
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2">{item.label}</Typography>
              {item.description && (
                <StyledDescription variant="caption">
                  {item.description}
                </StyledDescription>
              )}
            </Box>
          </StyledItem>
        );
      });
    };

    return (
      <DropdownMenuPrimitive.Root open={open} onOpenChange={setOpen}>
        <DropdownMenuPrimitive.Trigger asChild>
          <Box
            ref={ref}
            className={className}
            sx={{ display: 'inline-flex' }}
          >
            {trigger}
          </Box>
        </DropdownMenuPrimitive.Trigger>

        <DropdownMenuPrimitive.Portal>
          <StyledContent
            align={align}
            side={side}
            sideOffset={5}
            style={{ width }}
            className={animated ? 'animate-dropdown' : undefined}
          >
            {renderItems(items)}
          </StyledContent>
        </DropdownMenuPrimitive.Portal>
      </DropdownMenuPrimitive.Root>
    );
  }
);

Dropdown.displayName = 'Dropdown';

export default Dropdown;

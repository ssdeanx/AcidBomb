'use client';

import * as React from 'react';
import {
  Box,
  Collapse,
  IconButton,
  Typography,
  styled,
  alpha,
  useTheme,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import * as RadixCollapsible from '@radix-ui/react-collapsible';

/**
 * Props interface for the Collapsible component
 *
 * @interface CollapsibleProps
 */
export interface CollapsibleProps {
  /**
   * The header content for the collapsible component
   */
  header: React.ReactNode;

  /**
   * The content to be shown when the collapsible is expanded
   */
  children: React.ReactNode;

  /**
   * Whether the collapsible is initially open
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * Controls the open state (controlled component)
   */
  open?: boolean;

  /**
   * Callback fired when the open state changes
   * @param open - The new open state
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Custom icon to use when the collapsible is open
   */
  openIcon?: React.ReactNode;

  /**
   * Custom icon to use when the collapsible is closed
   */
  closedIcon?: React.ReactNode;

  /**
   * Whether the header should include a border
   * @default true
   */
  headerBorder?: boolean;

  /**
   * Whether the content should be padded
   * @default true
   */
  contentPadding?: boolean;

  /**
   * Disable the collapsible
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional CSS class for the component
   */
  className?: string;

  /**
   * Transition duration in milliseconds
   * @default 300
   */
  transitionDuration?: number;

  /**
   * Variant of the collapsible
   * @default 'default'
   */
  variant?: 'default' | 'card' | 'outlined';
}

// Styled components
const Root = styled(RadixCollapsible.Root)(({ theme }) => ({
  width: '100%',
  borderRadius: theme.shape.borderRadius,
}));

const CollapsibleTrigger = styled(RadixCollapsible.Trigger, {
  shouldForwardProp: (prop) =>
    prop !== 'headerBorder' && prop !== 'variant' && prop !== 'disabled',
})<{
  headerBorder?: boolean;
  variant?: 'default' | 'card' | 'outlined';
  disabled?: boolean;
}>(({ theme, headerBorder = true, variant = 'default', disabled = false }) => ({
  width: '100%',
  padding: theme.spacing(1.5, 2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: disabled ? 'not-allowed' : 'pointer',
  backgroundColor: 'transparent',
  border: 'none',
  textAlign: 'left',
  outline: 'none',

  ...(variant === 'card' && {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
  }),

  ...(variant === 'outlined' && {
    border: `1px solid ${theme.palette.divider}`,
  }),

  ...(headerBorder && {
    borderBottom: `1px solid ${
      variant === 'outlined' ? 'transparent' : theme.palette.divider
    }`,
  }),

  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,

  '&:focus-visible': {
    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.3)}`,
  },

  '&:hover': {
    backgroundColor: disabled
      ? undefined
      : alpha(theme.palette.action.hover, 0.1),
  },

  color: disabled
    ? theme.palette.text.disabled
    : theme.palette.text.primary,
}));

const CollapsibleContent = styled(RadixCollapsible.Content, {
  shouldForwardProp: (prop) =>
    prop !== 'contentPadding' && prop !== 'variant',
})<{
  contentPadding?: boolean;
  variant?: 'default' | 'card' | 'outlined';
}>(({ theme, contentPadding = true, variant = 'default' }) => ({
  overflow: 'hidden',

  ...(contentPadding && {
    padding: theme.spacing(2),
  }),

  ...(variant === 'card' && {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    borderTop: 'none',
  }),

  ...(variant === 'outlined' && {
    border: `1px solid ${theme.palette.divider}`,
    borderTop: 'none',
  }),

  borderBottomLeftRadius: theme.shape.borderRadius,
  borderBottomRightRadius: theme.shape.borderRadius,
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.5),
}));

const ExpandIcon = styled(Box)<{ open: boolean }>(({ theme, open }) => ({
  transition: theme.transitions.create(['transform'], {
    duration: theme.transitions.duration.shorter,
  }),
  transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
}));

/**
 * A collapsible component that allows toggling between expanded and collapsed states
 * Built using Radix UI Collapsible primitive with Material UI styling
 *
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <Collapsible header="Section Title">
 *   <Typography>Collapsible content goes here</Typography>
 * </Collapsible>
 *
 * // With custom styling
 * <Collapsible
 *   header={<Typography variant="h6">Advanced Settings</Typography>}
 *   variant="outlined"
 *   defaultOpen={true}
 * >
 *   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
 *     <TextField label="Setting 1" />
 *     <TextField label="Setting 2" />
 *   </Box>
 * </Collapsible>
 *
 * // Controlled component
 * const [open, setOpen] = React.useState(false);
 *
 * <Collapsible
 *   header="Controlled Section"
 *   open={open}
 *   onOpenChange={setOpen}
 * >
 *   <Typography>This section is controlled externally</Typography>
 * </Collapsible>
 * ```
 */
export const Collapsible: React.FC<CollapsibleProps> = ({
  header,
  children,
  defaultOpen = false,
  open,
  onOpenChange,
  openIcon,
  closedIcon,
  headerBorder = true,
  contentPadding = true,
  disabled = false,
  className,
  transitionDuration = 300,
  variant = 'default',
}) => {
  const theme = useTheme();
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);

  // Determine if the component is controlled or uncontrolled
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  // Handle open state changes
  const handleOpenChange = (newOpen: boolean): void => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }

    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  return (
    <Root
      className={className}
      open={isOpen}
      onOpenChange={handleOpenChange}
      disabled={disabled}
    >
      <CollapsibleTrigger
        headerBorder={headerBorder && isOpen}
        variant={variant}
        disabled={disabled}
      >
        {typeof header === 'string' ? (
          <Typography variant="subtitle1" fontWeight="medium">
            {header}
          </Typography>
        ) : (
          header
        )}

        <ExpandIcon open={isOpen}>
          {isOpen ? (
            openIcon || <ExpandMoreIcon />
          ) : (
            closedIcon || <ChevronRightIcon />
          )}
        </ExpandIcon>
      </CollapsibleTrigger>

      <Collapse in={isOpen} timeout={transitionDuration}>
        <CollapsibleContent contentPadding={contentPadding} variant={variant}>
          {children}
        </CollapsibleContent>
      </Collapse>
    </Root>
  );
};

Collapsible.displayName = 'Collapsible';

export default Collapsible;

'use client';

import * as React from 'react';
import {
  List as MuiList,
  ListProps as MuiListProps,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  styled,
  useTheme
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

export interface ListItemProps {
  /**
   * The icon to display for the list item
   */
  icon?: React.ReactElement;

  /**
   * The primary text to display
   */
  text: string;

  /**
   * Optional secondary text to display
   */
  description?: string;

  /**
   * Optional nested items
   */
  children?: ListItemProps[];

  /**
   * Optional click handler
   */
  onClick?: () => void;

  /**
   * Optional href for navigation
   */
  href?: string;

  /**
   * If true, the item will be highlighted as active
   */
  active?: boolean;
}

export interface ListProps extends Omit<MuiListProps, 'children'> {
  /**
   * Array of items to render in the list
   */
  items: ListItemProps[];

  /**
   * The variant of the list
   * @default "default"
   */
  variant?: 'default' | 'nested' | 'compact';

  /**
   * Additional class name
   */
  className?: string;
}

const StyledList = styled(MuiList)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,

  '& .MuiListItemButton-root': {
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(0.5),

    '&:last-child': {
      marginBottom: 0,
    },

    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },

    '&.active': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,

      '& .MuiListItemIcon-root': {
        color: 'inherit',
      },

      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  },

  '& .MuiListItemIcon-root': {
    minWidth: 40,
    color: theme.palette.text.secondary,
  },

  '&.compact': {
    '& .MuiListItemButton-root': {
      padding: theme.spacing(0.75, 1.5),
    },
  },

  '&.nested': {
    '& .MuiCollapse-root': {
      '& .MuiList-root': {
        padding: theme.spacing(1, 0, 0, 3),
      },
    },
  },
}));

const ListItem = ({ icon, text, description, children, onClick, href, active }: ListItemProps) => {
  const [open, setOpen] = React.useState(false);
  const hasChildren = children && children.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      setOpen(!open);
    }
    onClick?.();
  };

  return (
    <>
      <ListItemButton
        onClick={handleClick}
        className={active ? 'active' : ''}
        component={href ? 'a' : 'div'}
        href={href}
      >
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText
          primary={text}
          secondary={description}
          primaryTypographyProps={{
            fontWeight: active ? 600 : 400,
          }}
        />
        {hasChildren && (open ? <ExpandLess /> : <ExpandMore />)}
      </ListItemButton>

      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <StyledList>
            {children.map((child, index) => (
              <ListItem key={index} {...child} />
            ))}
          </StyledList>
        </Collapse>
      )}
    </>
  );
};

export const List = React.forwardRef<HTMLUListElement, ListProps>(
  ({ items, variant = 'default', className, ...props }, ref) => {
    return (
      <StyledList
        ref={ref}
        className={`${variant} ${className || ''}`}
        {...props}
      >
        {items.map((item, index) => (
          <ListItem key={index} {...item} />
        ))}
      </StyledList>
    );
  }
);

List.displayName = 'List';

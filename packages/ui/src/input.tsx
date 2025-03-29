'use client';

import * as React from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  FormHelperText,
  InputLabel,
  styled,
  alpha,
  TextFieldProps,
  useTheme,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Search,
  Clear,
} from '@mui/icons-material';

export interface InputProps extends Omit<TextFieldProps, 'variant'> {
  /**
   * The variant of the input
   * @default "primary"
   */
  variant?: 'primary' | 'search' | 'password';

  /**
   * If true, shows a clear button when input has value
   * @default false
   */
  clearable?: boolean;

  /**
   * If true, shows a loading indicator
   * @default false
   */
  loading?: boolean;

  /**
   * Custom start adornment
   */
  startAdornment?: React.ReactNode;

  /**
   * Custom end adornment
   */
  endAdornment?: React.ReactNode;

  /**
   * Callback when clear button is clicked
   */
  onClear?: () => void;
}

const StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) =>
    !['customVariant', 'loading', 'clearable'].includes(prop as string),
})<{ customVariant?: InputProps['variant']; loading?: boolean }>(
  ({ theme, customVariant, loading }) => ({
    '& .MuiInputBase-root': {
      borderRadius: theme.shape.borderRadius,
      transition: theme.transitions.create([
        'border-color',
        'background-color',
        'box-shadow',
      ]),

      ...(customVariant === 'search' && {
        backgroundColor: alpha(theme.palette.common.black, 0.04),
        '&:hover': {
          backgroundColor: alpha(theme.palette.common.black, 0.06),
        },
        '&.Mui-focused': {
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
          boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
        },
      }),

      ...(loading && {
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -1,
          left: 0,
          right: 0,
          height: 2,
          backgroundColor: theme.palette.primary.main,
          animation: 'loading 2s infinite',
        },
      }),
    },

    '& .MuiInputBase-input': {
      padding: theme.spacing(1.5, 2),
    },

    '& .MuiInputLabel-root': {
      '&.Mui-focused': {
        color: theme.palette.primary.main,
      },
    },

    '@keyframes loading': {
      '0%': {
        transform: 'translateX(-100%)',
      },
      '50%': {
        transform: 'translateX(100%)',
      },
      '100%': {
        transform: 'translateX(-100%)',
      },
    },
  })
);

export const Input = React.forwardRef<HTMLDivElement, InputProps>(
  ({
    variant = 'primary',
    clearable = false,
    loading = false,
    startAdornment,
    endAdornment,
    onClear,
    value,
    onChange,
    type = 'text',
    ...props
  }, ref) => {
    const theme = useTheme();
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = variant === 'password' || type === 'password';
    const hasValue = Boolean(value);

    const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      if (onChange) {
        const nativeEvent = new Event('input', { bubbles: true });
        Object.defineProperty(nativeEvent, 'target', {
          writable: false,
          value: { value: '' },
        });
        onChange(nativeEvent as unknown as React.ChangeEvent<HTMLInputElement>);
      }
      onClear?.();
    };

    const handleTogglePassword = () => {
      setShowPassword((prev) => !prev);
    };

    const renderStartAdornment = () => {
      if (startAdornment) return startAdornment;
      if (variant === 'search') {
        return (
          <InputAdornment position="start">
            <Search sx={{ color: 'action.active' }} />
          </InputAdornment>
        );
      }
      return null;
    };

    const renderEndAdornment = () => {
      if (endAdornment) return endAdornment;
      if (isPassword) {
        return (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleTogglePassword}
              edge="end"
              size="small"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        );
      }
      if (clearable && hasValue) {
        return (
          <InputAdornment position="end">
            <IconButton
              aria-label="clear input"
              onClick={handleClear}
              edge="end"
              size="small"
            >
              <Clear />
            </IconButton>
          </InputAdornment>
        );
      }
      return null;
    };

    return (
      <FormControl fullWidth variant="outlined">
        <StyledTextField
          ref={ref}
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          customVariant={variant}
          loading={loading}
          value={value}
          onChange={onChange}
          InputProps={{
            startAdornment: renderStartAdornment(),
            endAdornment: renderEndAdornment(),
          }}
          {...props}
        />
        {props.helperText && (
          <FormHelperText error={props.error}>
            {props.helperText}
          </FormHelperText>
        )}
      </FormControl>
    );
  }
);

Input.displayName = 'Input';

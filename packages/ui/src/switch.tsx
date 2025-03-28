'use client';

import * as React from 'react';
import {
  Switch as MuiSwitch,
  SwitchProps as MuiSwitchProps,
  FormControlLabel,
  FormGroup,
  styled
} from '@mui/material';

export interface SwitchProps extends Omit<MuiSwitchProps, 'defaultChecked'> {
  /**
   * The label for the switch
   */
  label?: string;

  /**
   * If true, the switch will be initially checked
   * @default false
   */
  defaultChecked?: boolean;

  /**
   * If true, the switch will be required
   * @default false
   */
  required?: boolean;

  /**
   * If true, the switch will be disabled
   * @default false
   */
  disabled?: boolean;
}

const StyledSwitch = styled(MuiSwitch)(({ theme }) => ({
  '& .MuiSwitch-switchBase': {
    '&.Mui-checked': {
      color: theme.palette.primary.main,
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.primary.main,
        opacity: 0.5,
      },
    },
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
  },
}));

export const switch_ = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ label, defaultChecked = false, required = false, disabled = false, ...props }, ref) => {
    return (
      <FormGroup>
        <FormControlLabel
          control={
            <StyledSwitch
              ref={ref}
              defaultChecked={defaultChecked}
              required={required}
              disabled={disabled}
              {...props}
            />
          }
          label={label || ''}
        />
      </FormGroup>
    );
  }
);

switch_.displayName = 'switch';

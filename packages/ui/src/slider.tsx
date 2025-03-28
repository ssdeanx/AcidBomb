'use client';

import * as React from 'react';
import { Box, Slider as MuiSlider, SliderProps as MuiSliderProps } from '@mui/material';

export interface SliderProps extends Omit<MuiSliderProps, 'defaultValue'> {
  /**
   * The default value of the slider
   * @default 0
   */
  defaultValue?: number;

  /**
   * The minimum allowed value of the slider
   * @default 0
   */
  min?: number;

  /**
   * The maximum allowed value of the slider
   * @default 100
   */
  max?: number;

  /**
   * The granularity with which the slider can step through values
   * @default 1
   */
  step?: number;

  /**
   * Display marks on the slider
   * @default false
   */
  marks?: boolean;
}

export const slider = React.forwardRef<HTMLSpanElement, SliderProps>(
  ({
    defaultValue = 0,
    min = 0,
    max = 100,
    step = 1,
    marks = false,
    ...props
  }, ref) => {
    return (
      <Box sx={{ width: '100%', px: 2 }}>
        <MuiSlider
          ref={ref}
          defaultValue={defaultValue}
          getAriaValueText={(value) => `${value}`}
          step={step}
          marks={marks}
          min={min}
          max={max}
          valueLabelDisplay="auto"
          {...props}
        />
      </Box>
    );
  }
);

slider.displayName = 'slider';

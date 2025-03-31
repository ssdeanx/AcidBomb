'use client';
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/**
 * Props for the TabPanel component.
 * @interface TabPanelProps
 */
interface TabPanelProps {
  /** The content of the tab panel. */
  children?: React.ReactNode;
  /** The index of the current tab panel. */
  index: number;
  /** The index of the currently active tab. */
  value: number;
}

/**
 * Renders the content of a tab panel.
 * It ensures accessibility attributes are correctly set.
 * @param {TabPanelProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered tab panel content.
 */
function TabPanel(props: TabPanelProps): React.ReactElement {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`advanced-tabpanel-${index}`}
      aria-labelledby={`advanced-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

/**
 * Generates accessibility props for a tab.
 * @param {number} index - The index of the tab.
 * @returns {{ id: string; 'aria-controls': string }} Accessibility props.
 */
function a11yProps(index: number): { id: string; 'aria-controls': string } {
  return {
    id: `advanced-tab-${index}`,
    'aria-controls': `advanced-tabpanel-${index}`,
  };
}

/**
 * Represents a single tab configuration.
 * @interface TabConfig
 */
export interface TabConfig {
  /** The label text for the tab. */
  label: string;
  /** The content to be displayed when the tab is active. */
  content: React.ReactNode;
  /** Whether the tab is disabled. Defaults to false. */
  disabled?: boolean;
}

/**
 * Props for the AdvancedTabs component.
 * @interface AdvancedTabsProps
 */
export interface AdvancedTabsProps {
  /** An array of tab configurations. */
  tabs: TabConfig[];
  /** The initial selected tab index. Defaults to 0. */
  initialValue?: number;
  /** Aria-label for the Tabs container for accessibility. */
  ariaLabel: string;
}

/**
 * An advanced Tabs component using Material UI (MUI),
 * designed with best practices for React 18+ and TypeScript.
 * Includes accessibility features and state management.
 *
 * @param {AdvancedTabsProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered Tabs component.
 */
export function AdvancedTabs({
  tabs,
  initialValue = 0,
  ariaLabel,
}: AdvancedTabsProps): React.ReactElement {
  const [value, setValue] = React.useState<number>(initialValue);

  /**
   * Handles the change event when a different tab is selected.
   * @param {React.SyntheticEvent} event - The event source of the callback.
   * @param {number} newValue - The index of the newly selected tab.
   */
  const handleChange = (
    event: React.SyntheticEvent,
    newValue: number,
  ): void => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label={ariaLabel}
          variant="scrollable" // Example: Use scrollable tabs
          scrollButtons="auto" // Example: Show scroll buttons automatically
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              disabled={tab.disabled}
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
      </Box>
      {tabs.map((tab, index) => (
        <TabPanel key={index} value={value} index={index}>
          {tab.content}
        </TabPanel>
      ))}
    </Box>
  );
}

AdvancedTabs.displayName = 'AdvancedTabs';

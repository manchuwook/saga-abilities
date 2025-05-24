import { Tabs } from '@mantine/core';
import { ReactNode } from 'react';
import { useStyles } from '../../hooks/useStyles';

/**
 * Interface for a tab item
 */
export interface TabItem {
  value: string;
  label: ReactNode;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  content: ReactNode;
}

/**
 * Props for the SafeTabs component
 */
interface SafeTabsProps {
  /**
   * Array of tab items to render
   */
  tabs: readonly TabItem[];
  
  /**
   * The currently active tab's value
   */
  activeTab: string;
  
  /**
   * Function to handle tab changes
   */
  onTabChange: (value: string | null) => void;
}

/**
 * A component that safely handles tabs with predetermined content rendering
 * Avoids having to use manual tab checking and conditional rendering in parent components
 */
export function SafeTabs({ tabs, activeTab, onTabChange }: SafeTabsProps) {
  const { styleService } = useStyles();
  const tabStyles = styleService.getTabsStyles();
  
  return (
    <>      <Tabs
        value={activeTab}
        onChange={onTabChange}
        styles={tabStyles}
        variant="outline"
        autoContrast
      >
        <Tabs.List>
          {tabs.map((tab) => (
            <Tabs.Tab
              key={tab.value}
              value={tab.value}
              leftSection={tab.leftSection}
              rightSection={tab.rightSection}
            >
              {tab.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>
      
      {/* Render the content for the active tab */}
      {tabs.find(tab => tab.value === activeTab)?.content}
    </>
  );
}
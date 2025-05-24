import { ActionIcon, Tooltip, useMantineColorScheme } from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  onToggle: () => void;
}

export function ThemeToggle({ onToggle }: ThemeToggleProps) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tooltip label="Theme Settings">
      <ActionIcon
        onClick={onToggle}
        variant="outline"
        size="lg"
        radius="md"
        aria-label="Open theme settings"
        color={isDark ? 'gray.4' : 'gray.7'}
        style={{ 
          position: 'fixed', 
          bottom: '20px', 
          left: '20px', 
          zIndex: 1000
        }}
      >
        <IconSettings size={18} />
      </ActionIcon>
    </Tooltip>
  );
}

import { ActionIcon, Tooltip, useMantineColorScheme } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';

export function ColorSchemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tooltip label={isDark ? 'Light mode' : 'Dark mode'}>
      <ActionIcon
        onClick={() => toggleColorScheme()}
        variant="outline"
        size="lg"
        radius="md"
        aria-label="Toggle color scheme"
      >
        {isDark ? <IconSun size={18} /> : <IconMoon size={18} />}
      </ActionIcon>
    </Tooltip>
  );
}

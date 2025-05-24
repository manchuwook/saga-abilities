import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

export function ColorSchemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <ActionIcon
      onClick={() => toggleColorScheme()}
      variant="outline"
      size="lg"
      radius="md"
      aria-label={isDark ? 'Light mode' : 'Dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {/* @ts-expect-error Icon type issue workaround */}
      {isDark ? <IconSun size={18} /> : <IconMoon size={18} />}
    </ActionIcon>
  );
}
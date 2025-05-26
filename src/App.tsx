import { AppShell, Group, Title, ActionIcon } from '@mantine/core';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ThemeCustomizer } from './components/ThemeCustomizer';
import { ColorSchemeToggle } from './components/ColorSchemeToggle';
import { ThemeToggle } from './components/ThemeToggle';
import { useTheme } from './context/ThemeContext';
import { useStyles } from './hooks/useStyles';
import { Prefetcher } from './components/Prefetcher';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { IconMenu2 } from '@tabler/icons-react';
import { useAbilityManuals } from './hooks/useAbilityManuals';
import { NavbarNested } from './components/NavbarNested';

export default function App() {
  const location = useLocation();
  const { colors } = useTheme();
  const { isDark } = useStyles(); // Use the isDark from useStyles which gets it from Mantine
  const [themeSettingsOpened, setThemeSettingsOpened] = useState(false);
  const [navbarCollapsed, { toggle: toggleNavbar }] = useDisclosure(false);
  const { AbilityManuals } = useAbilityManuals();

  // Generate inline styles based on theme settings
  const getComponentStyles = () => ({
    main: {
      backgroundImage: colors.imageEnabled ? 'url("/assets/img/parchment1.png")' : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      backgroundColor: isDark ? 'var(--mantine-color-dark-7)' : 'var(--mantine-color-gray-0)',
    },
    navbar: {
      borderRadius: `0 ${colors.borderRadius}px ${colors.borderRadius}px 0`,
      backgroundColor: isDark ? 'var(--mantine-color-dark-6)' : 'var(--mantine-color-gray-1)',
      borderRight: `1px solid ${isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-3)'}`,
    },
    header: {
      backgroundColor: isDark ? 'var(--mantine-color-dark-7)' : 'var(--mantine-color-' + colors.primaryColor + ')',
      borderBottom: `1px solid ${isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-3)'}`,
    }
  });

  const styles = getComponentStyles();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { desktop: navbarCollapsed, mobile: true }
      }}
      padding="md"
    >
      <AppShell.Header p="md" style={styles.header}>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <ActionIcon
              variant="subtle"
              color={isDark ? 'gray.0' : 'dark.0'}
              onClick={toggleNavbar}
              aria-label="Toggle navigation"
            >
              <IconMenu2 size={24} />
            </ActionIcon>
            <Title order={1} size="h3" c="white">SAGA Abilities Manager</Title>
          </Group>
          <ColorSchemeToggle />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar style={styles.navbar}>
        <NavbarNested
          opened={!navbarCollapsed}
          showUserInfo={true}
          customStyle={{
            backgroundColor: isDark ? 'var(--mantine-color-dark-6)' : 'var(--mantine-color-gray-1)'
          }}
        />
      </AppShell.Navbar>

      <AppShell.Main style={styles.main}>
        {/* Invisible component that prefetches critical resources */}
        <Prefetcher />
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

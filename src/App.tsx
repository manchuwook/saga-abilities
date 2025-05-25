import { AppShell, Group, Title, UnstyledButton, Text, rem, Box, Collapse, ActionIcon } from '@mantine/core';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ThemeCustomizer } from './components/ThemeCustomizer';
import { ColorSchemeToggle } from './components/ColorSchemeToggle';
import { ThemeToggle } from './components/ThemeToggle';
import { useTheme } from './context/ThemeContext';
import { useStyles } from './hooks/useStyles';
import { Prefetcher } from './components/Prefetcher';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronRight, IconChevronDown, IconBook, IconMenu2 } from '@tabler/icons-react';
import { useAbilityManuals } from './hooks/useAbilityManuals';

export default function App() {
  const location = useLocation();
  const { colors } = useTheme();
  const { isDark } = useStyles(); // Use the isDark from useStyles which gets it from Mantine
  const [themeSettingsOpened, setThemeSettingsOpened] = useState(false);
  const [navbarCollapsed, { toggle: toggleNavbar }] = useDisclosure(false);
  const [manualsExpanded, { toggle: toggleManuals }] = useDisclosure(false);
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
    navButton: {
      borderRadius: colors.borderRadius,
      padding: '6px 10px',
      fontSize: `${colors.fontScale}rem`,
      transition: 'all 0.2s ease',
    },
    header: {
      backgroundColor: isDark ? 'var(--mantine-color-dark-7)' : 'var(--mantine-color-' + colors.primaryColor + ')',
      borderBottom: `1px solid ${isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-3)'}`,
    }
  });

  const styles = getComponentStyles();

  // Determine text colors based on theme
  const getNavLinkColor = (isActive: boolean) => {
    if (isActive) {
      return colors.accentColor;
    }
    return isDark ? 'gray.3' : 'dark.6';
  };
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

      <AppShell.Navbar p="md" style={styles.navbar}>
        <AppShell.Section>
          <Title order={3} mb="md" c={isDark ? 'gray.3' : 'dark.8'}>Navigation</Title>
        </AppShell.Section>
        <AppShell.Section grow>
          <UnstyledButton
            component={Link}
            to="/"
            fw={location.pathname === '/' ? 'bold' : 'normal'}
            c={getNavLinkColor(location.pathname === '/')}
            mb={rem(10)}
            display="block"
            style={styles.navButton}
          >
            Abilities Library
          </UnstyledButton>

          <Box mb={rem(10)}>
            <Group justify="space-between" style={{ ...styles.navButton, cursor: 'pointer' }} onClick={toggleManuals}>
              <UnstyledButton
                component={Link}
                to="/AbilityManuals"
                fw={location.pathname.includes('/AbilityManuals') ? 'bold' : 'normal'}
                c={getNavLinkColor(location.pathname.includes('/AbilityManuals'))}
                style={{ flex: 1 }}
              >
                My Ability Manuals
              </UnstyledButton>
              {manualsExpanded ?
                <IconChevronDown size={16} color={isDark ? 'var(--mantine-color-gray-5)' : 'var(--mantine-color-dark-3)'} /> :
                <IconChevronRight size={16} color={isDark ? 'var(--mantine-color-gray-5)' : 'var(--mantine-color-dark-3)'} />
              }
            </Group>

            <Collapse in={manualsExpanded}>
              <Box pl={20} pt={5}>
                {AbilityManuals.length === 0 ? (
                  <Text size="sm" c={isDark ? 'gray.5' : 'gray.6'} fs="italic">No ability manuals</Text>
                ) : (
                  AbilityManuals.map((manual) => (
                    <UnstyledButton
                      key={manual.id}
                      component={Link}
                      to={`/AbilityManuals/${manual.id}`}
                      fw={location.pathname === `/AbilityManuals/${manual.id}` ? 'bold' : 'normal'}
                      c={getNavLinkColor(location.pathname === `/AbilityManuals/${manual.id}`)}
                      mb={rem(5)}
                      display="block"
                      style={{ ...styles.navButton, fontSize: `${(colors.fontScale * 0.85)}rem` }}
                    >
                      <Group gap={5}>
                        <IconBook size={14} />
                        <Text truncate>{manual.name}</Text>
                      </Group>
                    </UnstyledButton>
                  ))
                )}
              </Box>
            </Collapse>
          </Box>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main style={styles.main}>
        {/* Invisible component that prefetches critical resources */}
        <Prefetcher />
        <Outlet />
        <ThemeCustomizer opened={themeSettingsOpened} />
        <ThemeToggle onToggle={() => setThemeSettingsOpened(!themeSettingsOpened)} />
      </AppShell.Main>
    </AppShell>
  );
}

import { useMantineColorScheme, MantineTheme } from '@mantine/core';
import { useTheme } from '../context/ThemeContext';
import { styleService } from '../services/StyleService';
import { useMemo } from 'react';

/**
 * A custom hook that provides access to the StyleService and Mantine theme.
 * This hook provides consistent styling across the application.
 * It uses Mantine's color scheme directly for dark mode detection.
 */
export function useStyles() {
  const { colors } = useTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  // Memoize the theme to avoid unnecessary re-renders
  const theme = useMemo<MantineTheme>(() => styleService.getTheme(), [
    colorScheme,
    colors.primaryColor,
    colors.borderRadius,
    colors.fontScale
  ]);

  // Memoize all style objects to avoid unnecessary re-renders and infinite loops
  const modalStyles = useMemo(() => styleService.getModalStyles(), [colorScheme, colors]);
  const cardStyles = useMemo(() => styleService.getCardStyles(), [colorScheme, colors]);
  const shellStyles = useMemo(() => styleService.getShellStyles(), [colorScheme, colors]);
  const textStyles = useMemo(() => styleService.getTextStyles(), [colorScheme, colors]);
  const inputStyles = useMemo(() => styleService.getInputStyles(), [colorScheme, colors]);
  const buttonStyles = useMemo(() => styleService.getButtonStyles(), [colorScheme, colors]);
  const tabsStyles = useMemo(() => styleService.getTabsStyles(), [colorScheme, colors]);

  // Memoize callback functions
  const getNavLinkColor = useMemo(() =>
    (isActive: boolean) => styleService.getNavLinkColor(isActive),
    [colorScheme, colors]
  );

  const getNotificationStyles = useMemo(() =>
    (color?: string) => styleService.getNotificationStyles(color),
    [colorScheme, colors]
  );

  return {
    isDark,
    styleService,
    theme,
    // Return memoized objects and functions
    modalStyles,
    cardStyles,
    shellStyles,
    textStyles,
    inputStyles,
    buttonStyles,
    tabsStyles,
    getNavLinkColor,
    getNotificationStyles,
  };
}

import { useMantineColorScheme, useMantineTheme, MantineTheme } from '@mantine/core';
import { useTheme } from '../context/ThemeContext';
import { styleService } from '../services/StyleService';
import { useEffect, useMemo } from 'react';

/**
 * A custom hook that provides access to the StyleService
 * while ensuring it stays in sync with the current theme and color scheme.
 * This hook is designed to integrate with Mantine's theme system.
 */
export function useStyles() {
  const { colors } = useTheme();
  const { colorScheme } = useMantineColorScheme();
  const mantineTheme = useMantineTheme();
  const isDark = colorScheme === 'dark';

  // Keep StyleService in sync with the current theme and color scheme
  useEffect(() => {
    styleService.updateColorScheme(colorScheme);
    styleService.updateCustomTheme(colors);
  }, [colorScheme, colors]);

  // Initialize StyleService with the Mantine theme when it's available
  useEffect(() => {
    if (mantineTheme) {
      styleService.initialize(mantineTheme, colorScheme, colors);
    }
  }, [mantineTheme, colorScheme, colors]);
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

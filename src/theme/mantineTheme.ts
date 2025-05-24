import { createTheme } from '@mantine/core';

/**
 * Base Mantine Theme Configuration
 * 
 * This provides the foundational theme settings for the application.
 * It will be extended by the StyleService to incorporate user preferences.
 */
export const baseTheme = createTheme({
  fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: { fontFamily: 'Inter, sans-serif' },
  
  // Color scheme settings
  primaryColor: 'brown',
  
  // Enable autoContrast for better text visibility on colored backgrounds
  autoContrast: true,
  
  // Colors palette - these will be available throughout the app
  colors: {
    // Blue shades
    blue: [
      '#edf2ff', // 0
      '#dbe4ff', // 1
      '#bac8ff', // 2
      '#91a7ff', // 3
      '#748ffc', // 4
      '#5c7cfa', // 5
      '#4c6ef5', // 6
      '#4263eb', // 7
      '#3b5bdb', // 8
      '#364fc7', // 9
    ],
    
    // Brown/amber shades for AbilityManual theme
    amber: [
      '#fff8e1', // 0
      '#ffecb3', // 1
      '#ffe082', // 2
      '#ffd54f', // 3
      '#ffca28', // 4
      '#ffc107', // 5
      '#ffb300', // 6
      '#ffa000', // 7
      '#ff8f00', // 8
      '#ff6f00', // 9
    ],
    
    // Custom brown for fantasy theme
    brown: [
      '#f5f0e6', // 0
      '#e6d9c2', // 1
      '#d4c2a3', // 2
      '#c1aa84', // 3
      '#ad9165', // 4
      '#8b5d33', // 5
      '#774d2a', // 6
      '#633f23', // 7
      '#4e301c', // 8
      '#3a2415', // 9
    ],
    
    // Dark mode colors
    dark: [
      '#C1C2C5', // 0: Text color 
      '#A6A7AB', // 1: Dimmed text
      '#909296', // 2: More dimmed text
      '#5C5F66', // 3: Even more dimmed text
      '#373A40', // 4: Card borders 
      '#2C2E33', // 5: Card/hover backgrounds
      '#25262B', // 6: Main card backgrounds
      '#1A1B1E', // 7: Page background
      '#141517', // 8: Darker elements
      '#101113', // 9: Darkest elements
    ],
  },
  
  // Default components styling
  components: {
    // Button styling
    Button: {
      defaultProps: {
        color: 'brown.5',
      },
      styles: {
        root: {
          fontWeight: 600,
          borderRadius: '4px',
        },
      },
    },
    
    // ActionIcon styling
    ActionIcon: {
      defaultProps: {
        color: 'blue',
      },
    },
    
    // Card styling
    Card: {
      styles: (theme: any) => ({
        root: {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : '#fffcf5',
          borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.brown[2],
        },
      }),
    },
    
    // AppShell styling
    AppShell: {
      styles: (theme: any) => ({
        main: {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
        },
      }),
    },
    
    // Modal styling
    Modal: {
      styles: (theme: any) => ({
        header: {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
        },
        body: {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
        },
      }),
    },
    
    // Badge styling
    Badge: {
      styles: {
        root: {
          fontWeight: 600,
          textTransform: 'none',
        },
      },
    },
  },
});

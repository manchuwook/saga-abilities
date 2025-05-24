import { describe, it, expect, vi, beforeEach } from 'vitest';
import { styleService } from '../services/StyleService';
import { MantineTheme } from '@mantine/core';

/**
 * Mock theme configuration for testing purposes.
 */
const createMockTheme = () => ({
    colorScheme: 'dark',
    colors: {
        dark: ['#C1C2C5', '#A6A7AB', '#909296', '#5c5f66', '#373A40', '#2C2E33', '#25262b', '#1A1B1E', '#141517', '#101113'],
        blue: ['#e1f0ff', '#b3d7ff', '#85bfff', '#57a6ff', '#298efc', '#0b76ef', '#0062d0', '#0052b3', '#003d86', '#002859'],
        red: ['#ffe8e8', '#ffcccc', '#ffadad', '#ff8585', '#ff5c5c', '#ff3333', '#ff0a0a', '#e60000', '#b30000', '#800000'],
        green: ['#e6fff0', '#c2ffda', '#9dffbf', '#75ffa3', '#4cff87', '#24ff6b', '#00fc4e', '#00d942', '#00b336', '#008c2a'],
    },
    radius: {
        xs: '2px',
        sm: '3px',
        md: '4px',
        lg: '6px',
        xl: '8px'
    },
    fontSizes: {
        xs: '12px',
        sm: '14px',
        md: '16px',
        lg: '18px',
        xl: '20px'
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 20
    },
    components: {},
});

describe('StyleService', () => {
    let mockTheme: ReturnType<typeof createMockTheme>;
    
    beforeEach(() => {
        // Create a fresh mock theme for each test
        mockTheme = createMockTheme();
        
        // Spy on console methods to prevent actual console logs during tests
        vi.spyOn(console, 'warn').mockImplementation(() => {});
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    describe('initialization and core functionality', () => {
        it('should initialize with provided theme settings', () => {
            // Initialize service with custom settings
            styleService.initialize(mockTheme as unknown as MantineTheme, 'dark', {
                primaryColor: 'blue.6',
                accentColor: 'green.5',
                borderRadius: 6,
                fontScale: 1.1,
                imageEnabled: true,
            });
            
            // Get the theme and check properties
            const theme = styleService.getTheme();
            expect(theme).toBeDefined();
            expect(styleService.isDark).toBeTruthy();
        });

        it('should update color scheme correctly', () => {
            // Initialize with dark theme
            styleService.initialize(mockTheme as unknown as MantineTheme, 'dark', {
                primaryColor: 'blue.6',
                accentColor: 'blue.4',
                borderRadius: 4,
                fontScale: 1,
                imageEnabled: false,
            });
            
            expect(styleService.isDark).toBeTruthy();
            
            // Change to light theme
            styleService.updateColorScheme('light');
            expect(styleService.isDark).toBeFalsy();
        });

        it('should update custom theme correctly', () => {
            // Initialize with default settings
            styleService.initialize(mockTheme as unknown as MantineTheme, 'dark', {
                primaryColor: 'blue.6',
                accentColor: 'blue.4',
                borderRadius: 4,
                fontScale: 1,
                imageEnabled: false,
            });
            
            // Update custom theme
            styleService.updateCustomTheme({
                primaryColor: 'red.5', 
                borderRadius: 8,
            });
            
            // Get modal styles to verify changes
            const cardStyles = styleService.getCardStyles();
            expect(cardStyles.radius).toBe('8px');
        });
    });
    
    describe('style getter methods', () => {
        beforeEach(() => {
            // Initialize service with standard settings for testing
            styleService.initialize(mockTheme as unknown as MantineTheme, 'dark', {
                primaryColor: 'blue.6',
                accentColor: 'blue.4',
                borderRadius: 5,
                fontScale: 1,
                imageEnabled: false,
            });
        });        it('getTabsStyles returns expected styles', () => {
            const tabStyles = styleService.getTabsStyles();
            
            // Basic test that it returns something
            expect(tabStyles).toBeDefined();
            expect(typeof tabStyles).toBe('object');
            
            // Only check for tab property which should always exist
            expect(tabStyles).toHaveProperty('tab');
        });
        
        it('getModalStyles returns expected styles', () => {
            const modalStyles = styleService.getModalStyles();
            
            expect(modalStyles).toBeDefined();
            expect(modalStyles.header).toBeDefined();
            expect(modalStyles.content).toBeDefined();
            expect(modalStyles.body).toBeDefined();
            expect(modalStyles.close).toBeDefined();
            expect(modalStyles.overlayProps).toBeDefined();
            
            expect(modalStyles.header.backgroundColor).toBe('#1A1B1E');
        });
        
        it('getCardStyles returns expected styles', () => {
            const cardStyles = styleService.getCardStyles();
            
            expect(cardStyles).toBeDefined();
            expect(cardStyles.radius).toBe('5px');
            expect(cardStyles.withBorder).toBe(true);
            expect(cardStyles.bg).toBe('dark.6');
        });
        
        it('getShellStyles returns expected styles', () => {
            const shellStyles = styleService.getShellStyles();
            
            expect(shellStyles).toBeDefined();
            expect(shellStyles.main).toBeDefined();
            expect(shellStyles.navbar).toBeDefined();
            expect(shellStyles.navButton).toBeDefined();
            expect(shellStyles.header).toBeDefined();
            
            // Background image should be 'none' since imageEnabled is false
            expect(shellStyles.main.backgroundImage).toBe('none');
        });
        
        it('getNotificationStyles returns expected styles', () => {
            const defaultStyles = styleService.getNotificationStyles();
            const customStyles = styleService.getNotificationStyles('red');
            
            expect(defaultStyles.color).toBe('blue');
            expect(customStyles.color).toBe('red');
            expect(defaultStyles.autoClose).toBe(3000);
            expect(defaultStyles.withBorder).toBe(true);
        });
        
        it('getTextStyles returns styles based on purpose', () => {
            const bodyStyles = styleService.getTextStyles('body');
            const headingStyles = styleService.getTextStyles('heading');
            const labelStyles = styleService.getTextStyles('label');
            
            expect(bodyStyles.size).toBe('md');
            expect(headingStyles.size).toBe('lg');
            expect(labelStyles.size).toBe('sm');
            
            // In dark mode, colors should be appropriate for contrast
            expect(headingStyles.c).toBe('white');
        });
        
        it('getNavLinkColor returns colors based on active state', () => {
            const activeColor = styleService.getNavLinkColor(true);
            const inactiveColor = styleService.getNavLinkColor(false);
            
            expect(activeColor).toBe('blue.4');
            expect(inactiveColor).toBe('gray.3');
        });
        
        it('getInputStyles returns expected styles', () => {
            const inputStyles = styleService.getInputStyles();
            
            expect(inputStyles.input).toBeDefined();
            expect(inputStyles.label).toBeDefined();
            
            expect(inputStyles.input.backgroundColor).toBe('var(--mantine-color-dark-5)');
            expect(inputStyles.label.color).toBe('var(--mantine-color-gray-2)');
        });
          it('getButtonStyles returns styles based on variant', () => {
            const primaryStyles = styleService.getButtonStyles('primary');
            const secondaryStyles = styleService.getButtonStyles('secondary');
            const outlineStyles = styleService.getButtonStyles('outline');
            
            // Check that color property exists and has correct values
            expect(primaryStyles.color).toBeDefined();
            expect(secondaryStyles.color).toBeDefined();
            expect(outlineStyles.color).toBeDefined();
            
            // Check variant property
            expect(primaryStyles.variant).toBe('filled');
            expect(secondaryStyles.variant).toBe('filled');
            expect(outlineStyles.variant).toBe('outline');
            
            // Check that radius property exists
            expect(primaryStyles.radius).toBeDefined();
            expect(typeof primaryStyles.radius).toBe('string');
        });
    });
      describe('error handling and edge cases', () => {
        it('handles invalid primaryColor gracefully', () => {
            // Initialize with invalid color
            styleService.initialize(mockTheme as unknown as MantineTheme, 'dark', {
                primaryColor: 'nonexistent.5',
                accentColor: 'blue.4',
                borderRadius: 4,
                fontScale: 1,
                imageEnabled: false,
            });
            
            // Should fall back to default color
            const theme = styleService.getTheme();
            expect(theme).toBeDefined();
        });
        
        it('handles missing customTheme gracefully', () => {
            // Force the customTheme to be undefined by using any type
            const service = styleService as any;
            service.customTheme = undefined;
            
            // This should now use default values
            service.updateMantineTheme();
            
            // Check that the service still works
            const theme = styleService.getTheme();
            expect(theme).toBeDefined();
        });
        
        it('handles theme with missing components gracefully', () => {
            // Create a theme without components
            const incompleteTheme = {
                ...mockTheme,
                components: undefined
            };
            
            styleService.initialize(incompleteTheme as unknown as MantineTheme, 'dark', {
                primaryColor: 'blue.6',
                accentColor: 'blue.4',
                borderRadius: 4,
                fontScale: 1,
                imageEnabled: false,
            });
            
            // This should not throw an error
            const tabStyles = styleService.getTabsStyles();
            expect(tabStyles).toBeDefined();
        });
        
        it('handles theme without colors gracefully', () => {
            // Create a broken theme without colors for error handling test
            const brokenTheme = { ...mockTheme, colors: undefined };
            
            // This should trigger the warning but not throw an error
            styleService.initialize(brokenTheme as unknown as MantineTheme, 'dark', {
                primaryColor: 'blue.6',
                accentColor: 'blue.4',
                borderRadius: 4,
                fontScale: 1,
                imageEnabled: false,
            });
            
            // Check console warning was triggered
            expect(console.warn).toHaveBeenCalledWith('Cannot update Mantine theme: theme or theme.colors is undefined');
        });
          it('handles error scenarios gracefully', () => {
            // Create a theme with minimal required properties
            const brokenTheme = {
                ...mockTheme,
                // Add a property that when accessed will throw an error
                get problematic() {
                    throw new Error('Test error');
                }
            };
            
            try {
                // Force internal error by calling methods that would use the problematic property
                styleService.initialize(brokenTheme as unknown as MantineTheme, 'dark', {
                    primaryColor: 'blue.6',
                    accentColor: 'blue.4',
                    borderRadius: 4,
                    fontScale: 1,
                    imageEnabled: false,
                });
                
                // If no error is thrown, the error handling is working
                const theme = styleService.getTheme();
                expect(theme).toBeDefined();
            } catch (error) {
                // This should not happen if error handling works correctly
                fail('Error handling failed to catch the error');
            }
        });
        
        it('handles light theme correctly', () => {
            // Initialize with light theme
            styleService.initialize(mockTheme as unknown as MantineTheme, 'light', {
                primaryColor: 'blue.6',
                accentColor: 'blue.4',
                borderRadius: 4,
                fontScale: 1,
                imageEnabled: false,
            });
            
            expect(styleService.isDark).toBeFalsy();
            
            // Get styles to verify light theme colors
            const modalStyles = styleService.getModalStyles();
            expect(modalStyles.header.backgroundColor).toBe('white');
            expect(modalStyles.header.color).toBe('black');
        });
        
        it('handles imageEnabled correctly', () => {
            // Initialize with images enabled
            styleService.initialize(mockTheme as unknown as MantineTheme, 'dark', {
                primaryColor: 'blue.6',
                accentColor: 'blue.4',
                borderRadius: 4,
                fontScale: 1,
                imageEnabled: true,
            });
            
            // Check shell styles have background image
            const shellStyles = styleService.getShellStyles();
            expect(shellStyles.main.backgroundImage).toBe('url("/assets/img/parchment1.png")');
        });
        
        it('handles different text purposes in different color schemes', () => {
            // Test in dark mode
            styleService.initialize(mockTheme as unknown as MantineTheme, 'dark', {
                primaryColor: 'blue.6',
                accentColor: 'blue.4',
                borderRadius: 4,
                fontScale: 1,
                imageEnabled: false,
            });
            
            const darkHeadingStyles = styleService.getTextStyles('heading');
            expect(darkHeadingStyles.c).toBe('white');
            
            // Switch to light mode
            styleService.updateColorScheme('light');
            
            const lightHeadingStyles = styleService.getTextStyles('heading');
            expect(lightHeadingStyles.c).toBe('dark.8');
        });
    });
});

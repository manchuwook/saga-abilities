import { describe, it, expect, vi, beforeEach } from 'vitest';
import { styleService } from '../services/StyleService';
import { MantineTheme } from '@mantine/core';

describe('StyleService - Shell Styles Tests', () => {
    /**
     * Mock theme configuration for testing purposes.
     */
    const createMockTheme = () => ({
        colorScheme: 'dark',
        colors: {
            dark: ['#C1C2C5', '#A6A7AB', '#909296', '#5c5f66', '#373A40', '#2C2E33', '#25262b', '#1A1B1E', '#141517', '#101113'],
            blue: ['#e1f0ff', '#b3d7ff', '#85bfff', '#57a6ff', '#298efc', '#0b76ef', '#0062d0', '#0052b3', '#003d86', '#002859'],
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
        }
    });

    let mockTheme: ReturnType<typeof createMockTheme>;
    
    beforeEach(() => {
        // Create a fresh mock theme for each test
        mockTheme = createMockTheme();
        
        // Initialize service with standard settings for testing
        styleService.initialize(mockTheme as unknown as MantineTheme, 'dark', {
            primaryColor: 'blue.6',
            accentColor: 'blue.4',
            borderRadius: 5,
            fontScale: 1,
            imageEnabled: false,
        });
        
        // Spy on console methods to prevent actual console logs during tests
        vi.spyOn(console, 'warn').mockImplementation(() => {});
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('getShellStyles handles primaryColor formatting', () => {
        // Test with various primary color formats
        styleService.updateCustomTheme({ primaryColor: 'blue.5' });
        let shellStyles = styleService.getShellStyles();
        expect(shellStyles.header).toBeDefined();
        expect(shellStyles.header.backgroundColor).toBe('var(--mantine-color-dark-7)'); // Dark mode
        
        // Test with light mode and primary color
        styleService.updateColorScheme('light');
        shellStyles = styleService.getShellStyles();
        expect(shellStyles.header.backgroundColor).toBe('var(--mantine-color-blue-5)');
        
        // Test with no dot in color name
        styleService.updateCustomTheme({ primaryColor: 'blue' });
        shellStyles = styleService.getShellStyles();
        expect(shellStyles.header).toBeDefined();
        
        // Test with undefined primaryColor
        styleService.updateCustomTheme({ primaryColor: undefined });
        shellStyles = styleService.getShellStyles();
        expect(shellStyles.header).toBeDefined();
        
        // Test error handling in getPrimaryColorWithShade
        // Force an error by using an invalid customTheme that will cause error
        const service = styleService as any;
        service.customTheme = {
            get primaryColor() {
                throw new Error('Test error');
            }
        };
        shellStyles = styleService.getShellStyles();
        expect(shellStyles.header).toBeDefined();
        expect(console.warn).toHaveBeenCalledWith('Error in getPrimaryColorWithShade:', expect.anything());
    });
    
    it('getShellStyles handles font scaling', () => {
        // Test with different font scale values
        styleService.updateCustomTheme({ fontScale: 1.2 });
        let shellStyles = styleService.getShellStyles();
        expect(shellStyles.navButton.fontSize).toBeDefined();
        
        // Test with missing spacing values
        const incompleteTheme = createMockTheme();
        delete (incompleteTheme as any).spacing;
        
        styleService.initialize(incompleteTheme as unknown as MantineTheme, 'dark', {
            primaryColor: 'blue.6',
            accentColor: 'blue.4',
            borderRadius: 5,
            fontScale: 1,
            imageEnabled: false,
        });
        
        shellStyles = styleService.getShellStyles();
        expect(shellStyles).toBeDefined();
        expect(shellStyles.navButton).toBeDefined();
    });
    
    it('handles pxToRem conversions correctly', () => {
        // Initialize with font scale
        styleService.updateCustomTheme({ fontScale: 1.5 });
        
        // This indirectly tests the pxToRem function
        const shellStyles = styleService.getShellStyles();
        expect(shellStyles.navButton).toBeDefined();
        
        // Test different types of theme inputs with different radius formats
        const themeWithStringRadius = {
            ...mockTheme,
            radius: {
                xs: '2',  // No px suffix
                sm: '3rem', // rem unit
                md: '4em', // em unit
                lg: 6, // number
                xl: '8px' // px unit
            }
        };
        
        styleService.initialize(themeWithStringRadius as unknown as MantineTheme, 'dark', {
            primaryColor: 'blue.6',
            accentColor: 'blue.4',
            borderRadius: 5,
            fontScale: 1,
            imageEnabled: false,
        });
        
        const newShellStyles = styleService.getShellStyles();
        expect(newShellStyles.navbar).toBeDefined();
    });
});

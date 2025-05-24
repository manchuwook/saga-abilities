import { describe, it, expect, vi, beforeEach } from 'vitest';
import { styleService } from '../services/StyleService';
import { MantineTheme } from '@mantine/core';

describe('StyleService - Edge Cases and Complex Scenarios', () => {
    /**
     * Mock theme configuration for testing purposes.
     */
    const createMockTheme = () => ({
        colorScheme: 'dark',
        colors: {
            dark: ['#C1C2C5', '#A6A7AB', '#909296', '#5c5f66', '#373A40', '#2C2E33', '#25262b', '#1A1B1E', '#141517', '#101113'],
            blue: ['#e1f0ff', '#b3d7ff', '#85bfff', '#57a6ff', '#298efc', '#0b76ef', '#0062d0', '#0052b3', '#003d86', '#002859'],
            red: ['#ffe8e8', '#ffcccc', '#ffadad', '#ff8585', '#ff5c5c', '#ff3333', '#ff0a0a', '#e60000', '#b30000', '#800000'],
        },
        radius: {
            xs: '2px',
            sm: '3px',
            md: '4px',
            lg: '6px',
            xl: '8px'
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

    it('handles primaryColor with invalid shade values', () => {
        // Test with invalid shade values
        styleService.updateCustomTheme({ primaryColor: 'blue.15' }); // Invalid shade (higher than 9)
        let styles = styleService.getButtonStyles('primary');
        expect(styles).toBeDefined();
        
        styleService.updateCustomTheme({ primaryColor: 'blue.0' }); // Invalid shade (lower than 1)
        styles = styleService.getButtonStyles('primary');
        expect(styles).toBeDefined();
        
        styleService.updateCustomTheme({ primaryColor: 'blue.not-a-number' }); // Non-numeric shade
        styles = styleService.getButtonStyles('primary');
        expect(styles).toBeDefined();
    });
    
    it('handles nonexistent color names gracefully', () => {
        // Test with colors that don't exist in the Mantine palette
        styleService.updateCustomTheme({ primaryColor: 'nonexistent-color.5' });
        let styles = styleService.getButtonStyles('primary');
        expect(styles).toBeDefined(); // Should fall back to blue
        
        styleService.updateCustomTheme({ accentColor: 'another-nonexistent-color.5' });
        styles = styleService.getButtonStyles('secondary');
        expect(styles).toBeDefined();
    });
    
    it('all style getter methods work with both color schemes', () => {
        // Test all getter methods in dark mode
        expect(styleService.getModalStyles()).toBeDefined();
        expect(styleService.getCardStyles()).toBeDefined();
        expect(styleService.getShellStyles()).toBeDefined();
        expect(styleService.getNotificationStyles()).toBeDefined();
        expect(styleService.getTextStyles()).toBeDefined();
        expect(styleService.getNavLinkColor(true)).toBeDefined();
        expect(styleService.getInputStyles()).toBeDefined();
        expect(styleService.getButtonStyles()).toBeDefined();
        expect(styleService.getTabsStyles()).toBeDefined();
        
        // Switch to light mode
        styleService.updateColorScheme('light');
        
        // Test all getter methods in light mode
        expect(styleService.getModalStyles()).toBeDefined();
        expect(styleService.getCardStyles()).toBeDefined();
        expect(styleService.getShellStyles()).toBeDefined();
        expect(styleService.getNotificationStyles()).toBeDefined();
        expect(styleService.getTextStyles()).toBeDefined();
        expect(styleService.getNavLinkColor(true)).toBeDefined();
        expect(styleService.getInputStyles()).toBeDefined();
        expect(styleService.getButtonStyles()).toBeDefined();
        expect(styleService.getTabsStyles()).toBeDefined();
    });
    
    it('handles extreme fontScale values', () => {
        // Test with very small font scale
        styleService.updateCustomTheme({ fontScale: 0.1 });
        let styles = styleService.getInputStyles();
        expect(styles).toBeDefined();
        
        // Test with large font scale
        styleService.updateCustomTheme({ fontScale: 3.5 });
        styles = styleService.getInputStyles();
        expect(styles).toBeDefined();
        
        // Test with undefined font scale (should use default)
        styleService.updateCustomTheme({ fontScale: undefined });
        styles = styleService.getInputStyles();
        expect(styles).toBeDefined();
    });
    
    it('handles extreme borderRadius values', () => {
        // Test with zero border radius
        styleService.updateCustomTheme({ borderRadius: 0 });
        let styles = styleService.getCardStyles();
        expect(styles).toBeDefined();
        expect(styles.radius).toBe('0px');
        
        // Test with large border radius
        styleService.updateCustomTheme({ borderRadius: 50 });
        styles = styleService.getCardStyles();
        expect(styles).toBeDefined();
        expect(styles.radius).toBe('50px');
        
        // Test with undefined border radius (should use default)
        styleService.updateCustomTheme({ borderRadius: undefined });
        styles = styleService.getCardStyles();
        expect(styles).toBeDefined();
    });
});

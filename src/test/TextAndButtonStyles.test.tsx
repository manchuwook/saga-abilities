import { describe, it, expect, vi, beforeEach } from 'vitest';
import { styleService } from '../services/StyleService';
import { MantineTheme } from '@mantine/core';

describe('StyleService - Text and Button Styles', () => {
    /**
     * Mock theme configuration for testing purposes.
     */
    const createMockTheme = () => ({
        colorScheme: 'dark',
        colors: {
            dark: ['#C1C2C5', '#A6A7AB', '#909296', '#5c5f66', '#373A40', '#2C2E33', '#25262b', '#1A1B1E', '#141517', '#101113'],
            blue: ['#e1f0ff', '#b3d7ff', '#85bfff', '#57a6ff', '#298efc', '#0b76ef', '#0062d0', '#0052b3', '#003d86', '#002859'],
            green: ['#e6fff0', '#c2ffda', '#9dffbf', '#75ffa3', '#4cff87', '#24ff6b', '#00fc4e', '#00d942', '#00b336', '#008c2a'],
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

    describe('Text Styles', () => {
        it('returns appropriate styles for different text purposes in dark mode', () => {
            const headingStyles = styleService.getTextStyles('heading');
            const bodyStyles = styleService.getTextStyles('body');
            const labelStyles = styleService.getTextStyles('label');
            
            // Check sizes are correct
            expect(headingStyles.size).toBe('lg');
            expect(bodyStyles.size).toBe('md');
            expect(labelStyles.size).toBe('sm');
            
            // Check colors are appropriate for dark mode
            expect(headingStyles.c).toBe('white');
            expect(bodyStyles.c).toBe('white');
            expect(labelStyles.c).toBe('gray.1');
            
            // Check font weight for body text in dark mode
            expect(bodyStyles.fw).toBe(500);
        });
        
        it('returns appropriate styles for different text purposes in light mode', () => {
            // Switch to light mode
            styleService.updateColorScheme('light');
            
            const headingStyles = styleService.getTextStyles('heading');
            const bodyStyles = styleService.getTextStyles('body');
            const labelStyles = styleService.getTextStyles('label');
            
            // Check colors are appropriate for light mode
            expect(headingStyles.c).toBe('dark.8');
            expect(bodyStyles.c).toBe('dark.6');
            expect(labelStyles.c).toBe('dark.7');
            
            // No special font weight for body text in light mode
            expect(bodyStyles.fw).toBeUndefined();
        });
        
        it('handles default text purpose correctly', () => {
            // When no purpose is specified, should default to 'body'
            const defaultStyles = styleService.getTextStyles();
            const bodyStyles = styleService.getTextStyles('body');
            
            expect(defaultStyles.size).toBe(bodyStyles.size);
            expect(defaultStyles.c).toBe(bodyStyles.c);
            expect(defaultStyles.fw).toBe(bodyStyles.fw);
        });
    });
    
    describe('Button Styles', () => {
        it('returns appropriate styles for different button variants in dark mode', () => {
            const primaryStyles = styleService.getButtonStyles('primary');
            const secondaryStyles = styleService.getButtonStyles('secondary');
            const outlineStyles = styleService.getButtonStyles('outline');
            
            // Check color is set appropriately based on variant
            expect(primaryStyles.color).toBe('blue.6');
            expect(secondaryStyles.color).toBe('blue.4');
            expect(outlineStyles.color).toBe('gray.4');
            
            // Check variant property
            expect(primaryStyles.variant).toBe('filled');
            expect(secondaryStyles.variant).toBe('filled');
            expect(outlineStyles.variant).toBe('outline');
        });
        
        it('returns appropriate styles for different button variants in light mode', () => {
            // Switch to light mode
            styleService.updateColorScheme('light');
            
            const primaryStyles = styleService.getButtonStyles('primary');
            const secondaryStyles = styleService.getButtonStyles('secondary');
            const outlineStyles = styleService.getButtonStyles('outline');
            
            // Check color is set appropriately based on variant
            expect(primaryStyles.color).toBe('blue.6');
            expect(secondaryStyles.color).toBe('blue.4');
            expect(outlineStyles.color).toBe('dark.4');
        });
        
        it('handles default button variant correctly', () => {
            // When no variant is specified, should default to 'primary'
            const defaultStyles = styleService.getButtonStyles();
            const primaryStyles = styleService.getButtonStyles('primary');
            
            expect(defaultStyles.color).toBe(primaryStyles.color);
            expect(defaultStyles.variant).toBe(primaryStyles.variant);
        });
        
        it('handles custom theme colors for buttons', () => {
            // Update custom theme with different primary and accent colors
            styleService.updateCustomTheme({
                primaryColor: 'green.7',
                accentColor: 'green.5'
            });
            
            const primaryStyles = styleService.getButtonStyles('primary');
            const secondaryStyles = styleService.getButtonStyles('secondary');
            
            expect(primaryStyles.color).toBe('green.7');
            expect(secondaryStyles.color).toBe('green.5');
        });
    });
});

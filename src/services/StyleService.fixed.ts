import { MantineColorScheme, MantineTheme, createTheme, mergeMantineTheme } from '@mantine/core';
import { ThemeColors } from '../context/ThemeContext';

// Helper type for theme context
type ThemeWithColorScheme = MantineTheme & { colorScheme?: MantineColorScheme };
type MantineColorShadeType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * StyleService provides a centralized location for managing styles across the application.
 * It integrates with Mantine's theme system for consistent styling throughout the app.
 */
export class StyleService {
    private static instance: StyleService;
    private mantineTheme!: MantineTheme;
    private _colorScheme: MantineColorScheme = 'dark'; // Store colorScheme separately since it's not part of MantineTheme
    private customTheme: ThemeColors = {
        primaryColor: 'brown.5',
        accentColor: 'blue.6',
        borderRadius: 4,
        fontScale: 1,
        imageEnabled: false,
    };
    private constructor() {
        // Private constructor to enforce singleton pattern
        // Initialize with a default Mantine theme
        const defaultTheme = createTheme({
            primaryColor: 'blue',
            primaryShade: { light: 6, dark: 6 },
            fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
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
            components: {
                Modal: {
                    styles: (theme: ThemeWithColorScheme) => ({
                        header: {
                            backgroundColor: theme.colorScheme === 'dark' ? theme.colors?.dark?.[6] || '#1A1B1E' : theme.white || 'white',
                        },
                        body: {
                            backgroundColor: theme.colorScheme === 'dark' ? theme.colors?.dark?.[6] || '#1A1B1E' : theme.white || 'white',
                        },
                    }),
                },
            },
        });

        this.mantineTheme = defaultTheme as MantineTheme;
    }

    /**
     * Get the singleton instance of StyleService
     */
    public static getInstance(): StyleService {
        if (!StyleService.instance) {
            StyleService.instance = new StyleService();
        }
        return StyleService.instance;
    }

    /**
     * Initialize the service with theme information
     */
    public initialize(mantineTheme: MantineTheme, colorScheme: MantineColorScheme, customTheme: ThemeColors): void {
        this.mantineTheme = mantineTheme;
        this._colorScheme = colorScheme; // Store colorScheme for isDark getter
        this.customTheme = customTheme;
        this.updateMantineTheme();
    }

    /**
     * Update the Mantine color scheme
     * This is still needed for tests and initialization
     */
    public updateColorScheme(colorScheme: MantineColorScheme): void {
        this._colorScheme = colorScheme;
    }

    /**
     * Update the custom theme settings and regenerate Mantine theme
     */
    public updateCustomTheme(customTheme: Partial<ThemeColors>): void {
        this.customTheme = { ...this.customTheme, ...customTheme };
        this.updateMantineTheme();
    }

    /**
     * Update Mantine theme based on custom theme settings
     * This method creates a new Mantine theme that incorporates our custom settings
     */
    private updateMantineTheme(): void {
        // Safety check - if mantineTheme is not properly initialized, don't update
        if (!this.mantineTheme?.colors) {
            console.warn('Cannot update Mantine theme: theme or theme.colors is undefined');
            return;
        }

        try {
            // Default colors if customTheme is undefined
            if (!this.customTheme) {
                this.customTheme = {
                    primaryColor: 'blue',
                    accentColor: 'blue',
                    borderRadius: 4,
                    fontScale: 1,
                    imageEnabled: false,
                };
            }

            // For Mantine, primaryColor must be a key in the theme's colors object, not a color with shade
            // Extract just the color part (e.g., 'blue' from 'blue.6')
            let primaryColorName = 'blue'; // Default
            if (this.customTheme.primaryColor) {
                // If it contains a dot, take just the part before the dot
                if (this.customTheme.primaryColor.includes('.')) {
                    primaryColorName = this.customTheme.primaryColor.split('.')[0];
                } else {
                    primaryColorName = this.customTheme.primaryColor;
                }
            }

            // Make sure the color exists in Mantine's colors
            const mantineColors = ['red', 'pink', 'grape', 'violet', 'indigo', 'blue',
                'cyan', 'teal', 'green', 'lime', 'yellow', 'orange', 'gray', 'dark'];
            if (!primaryColorName || !mantineColors.includes(primaryColorName)) {
                primaryColorName = 'blue'; // Fallback to blue if not a valid Mantine color
            }

            // Extract shade value or default to 6
            const primaryShadeValue = parseInt(this.customTheme.primaryColor?.split('.')[1] || '6');
            const safeShade = (primaryShadeValue >= 1 && primaryShadeValue <= 9) ?
                primaryShadeValue as MantineColorShadeType :
                6 as MantineColorShadeType;

            // Set default border radius if not provided
            const borderRadius = this.customTheme?.borderRadius ?? 4;
            const fontScale = this.customTheme?.fontScale ?? 1;

            // Set radius values based on our custom borderRadius
            const radiusXs = `${borderRadius * 0.5}px`;
            const radiusSm = `${borderRadius * 0.75}px`;
            const radiusMd = `${borderRadius}px`;
            const radiusLg = `${borderRadius * 1.5}px`;
            const radiusXl = `${borderRadius * 2}px`;

            // Set font sizes with scale
            const fontSizeXs = `${12 * fontScale}px`;
            const fontSizeSm = `${14 * fontScale}px`;
            const fontSizeMd = `${16 * fontScale}px`;
            const fontSizeLg = `${18 * fontScale}px`;
            const fontSizeXl = `${20 * fontScale}px`;

            // Make sure primaryColorName is one of the valid Mantine color names, not a custom format with a dot
            const safeColorName = primaryColorName.includes('.') ? primaryColorName.split('.')[0] : primaryColorName;

            const customExtensions = createTheme({
                primaryColor: safeColorName,
                primaryShade: {
                    light: safeShade,
                    dark: safeShade
                },
                // Enable autoContrast for better text visibility on colored backgrounds
                autoContrast: true,
                radius: {
                    xs: radiusXs,
                    sm: radiusSm,
                    md: radiusMd,
                    lg: radiusLg,
                    xl: radiusXl
                },
                fontSizes: {
                    xs: fontSizeXs,
                    sm: fontSizeSm,
                    md: fontSizeMd,
                    lg: fontSizeLg,
                    xl: fontSizeXl
                },
                components: {
                    // Card styling
                    Card: {
                        styles: (theme: ThemeWithColorScheme) => ({
                            root: {
                                backgroundColor: theme.colorScheme === 'dark' ? theme.colors?.dark?.[6] || '#1A1B1E' : 'white',
                                borderColor: theme.colorScheme === 'dark' ? theme.colors?.dark?.[4] || '#373A40' : theme.colors?.gray?.[3] || '#dee2e6',
                            },
                        }),
                    },
                    // Modal styling
                    Modal: {
                        styles: (theme: ThemeWithColorScheme) => ({
                            header: {
                                backgroundColor: theme.colorScheme === 'dark' ? '#1A1B1E' : 'white',
                                color: theme.colorScheme === 'dark' ? 'white' : 'black',
                                borderBottom: theme.colorScheme === 'dark' ? '1px solid #2C2E33' : 'inherit',
                            },
                            content: {
                                backgroundColor: theme.colorScheme === 'dark' ? '#1A1B1E' : 'white',
                            },
                            body: {
                                backgroundColor: theme.colorScheme === 'dark' ? '#1A1B1E' : 'white',
                            },
                            close: {
                                color: theme.colorScheme === 'dark' ? 'white' : 'black',
                            },
                        }),
                    },
                    // Text input styling
                    TextInput: {
                        styles: (theme: ThemeWithColorScheme) => ({
                            input: {
                                backgroundColor: theme.colorScheme === 'dark' ? 'var(--mantine-color-dark-5)' : 'white',
                                borderColor: theme.colorScheme === 'dark' ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-4)',
                                fontSize: `${this.customTheme.fontScale}rem`,
                            },
                            label: {
                                color: theme.colorScheme === 'dark' ? 'var(--mantine-color-gray-2)' : 'var(--mantine-color-dark-8)',
                                fontSize: `${this.customTheme.fontScale}rem`,
                            }
                        }),
                    },

                    // Tabs styling
                    Tabs: {
                        defaultProps: {
                            autoContrast: true
                        },
                        styles: (theme: ThemeWithColorScheme) => ({
                            tab: {
                                backgroundColor: theme.colorScheme === 'dark' ? 'var(--mantine-color-dark-7)' : 'var(--mantine-color-white)',
                                '&[dataActive="true"]': {
                                    backgroundColor: theme.colorScheme === 'dark'
                                        ? `var(--mantine-color-${this.customTheme?.accentColor?.split('.')[0] || 'blue'}-9)`
                                        : `var(--mantine-color-${this.customTheme?.accentColor?.split('.')[0] || 'blue'}-2)`,
                                },
                                '&:hover': {
                                    backgroundColor: theme.colorScheme === 'dark' ? 'var(--mantine-color-dark-6)' : 'var(--mantine-color-gray-1)',
                                },
                            },
                            tabsList: {
                                borderBottomColor: theme.colorScheme === 'dark' ? 'var(--mantine-color-dark-3)' : 'var(--mantine-color-gray-3)',
                            },
                        }),
                    },
                },
            });

            // Merge the base theme with our custom extensions
            this.mantineTheme = mergeMantineTheme(this.mantineTheme, customExtensions as MantineTheme);
        } catch (error) {
            console.error('Error updating Mantine theme:', error);
            // If there's an error updating the theme, ensure we still have a usable theme
            if (!this.mantineTheme.fontSizes || !this.mantineTheme.radius) {
                // Use a minimal theme to prevent errors
                this.mantineTheme = {
                    ...this.mantineTheme,
                    fontSizes: {
                        xs: '12px',
                        sm: '14px',
                        md: '16px',
                        lg: '18px',
                        xl: '20px'
                    },
                    radius: {
                        xs: '2px',
                        sm: '3px',
                        md: '4px',
                        lg: '6px',
                        xl: '8px'
                    }
                };
            }
        }
    }

    /**
     * Check if dark mode is enabled
     */
    public get isDark(): boolean {
        return this._colorScheme === 'dark';
    }

    /**
     * Get the current Mantine theme with our customizations applied
     */
    public getTheme(): MantineTheme {
        return this.mantineTheme;
    }

    /**
     * Get modal styles with consistent theming
     */
    public getModalStyles() {
        return {
            header: {
                backgroundColor: this.isDark ? '#1A1B1E' : 'white',
                color: this.isDark ? 'white' : 'black',
                borderBottom: this.isDark ? '1px solid #2C2E33' : 'inherit',
            },
            content: {
                backgroundColor: this.isDark ? '#1A1B1E' : 'white',
            },
            body: {
                backgroundColor: this.isDark ? '#1A1B1E' : 'white',
            },
            close: {
                color: this.isDark ? 'white' : 'black',
            },
            overlayProps: {
                backgroundOpacity: 0.65,
                blur: 3,
                color: this.isDark ? 'black' : '#e6d9c2',
            }
        };
    }

    /**
     * Get card styles with consistent theming that integrates with Mantine
     */
    public getCardStyles() {
        return {
            radius: this.mantineTheme.radius?.md || '4px',
            padding: this.mantineTheme.spacing?.md,
            withBorder: true,
            shadow: "sm",
            bg: this.isDark ? 'dark.6' : 'white',
        };
    }

    /**
     * Get shell/container styles for main app layout
     */
    public getShellStyles() {
        const spacingXs = this.mantineTheme.spacing?.xs;
        const spacingSm = this.mantineTheme.spacing?.sm;

        // Helper function to convert px string or number to rem
        const pxToRem = (pxValue: string | number): string => {
            // If pxValue is already a number, use it directly
            if (typeof pxValue === 'number') {
                return `${pxValue / 16}rem`;
            }
            // Otherwise parse it as a string
            const numValue = Number(String(pxValue || '').replace('px', ''));
            return isNaN(numValue) ? '0.875rem' : `${numValue / 16}rem`;
        };

        // Helper function to get primary color with shade
        const getPrimaryColorWithShade = () => {
            try {
                if (!this.customTheme?.primaryColor) {
                    return 'var(--mantine-color-blue-5)'; // Default fallback
                }
                const colorParts = this.customTheme.primaryColor.split('.');
                const colorName = colorParts[0] || 'blue';
                const shade = colorParts[1] || '5';
                return `var(--mantine-color-${colorName}-${shade})`;
            } catch (error) {
                console.warn('Error in getPrimaryColorWithShade:', error);
                return 'var(--mantine-color-blue-5)'; // Default fallback
            }
        };

        return {
            main: {
                backgroundImage: this.customTheme.imageEnabled ? 'url("/assets/img/parchment1.png")' : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                backgroundColor: this.isDark ? 'var(--mantine-color-dark-7)' : 'var(--mantine-color-gray-0)',
            },
            navbar: {
                borderRadius: `0 ${this.mantineTheme.radius?.md || '4px'} ${this.mantineTheme.radius?.md || '4px'} 0`,
                backgroundColor: this.isDark ? 'var(--mantine-color-dark-6)' : 'var(--mantine-color-gray-1)',
                borderRight: `1px solid ${this.isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-3)'}`,
            },
            navButton: {
                borderRadius: this.mantineTheme.radius?.sm || '3px',
                padding: `${spacingXs}px ${spacingSm}px`,
                fontSize: pxToRem(this.mantineTheme.fontSizes?.sm || 14), // Default to 14px if fontSizes or sm is undefined
                transition: 'all 0.2s ease',
            },
            header: {
                backgroundColor: this.isDark
                    ? 'var(--mantine-color-dark-7)'
                    : getPrimaryColorWithShade(),
                borderBottom: `1px solid ${this.isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-3)'}`,
            }
        };
    }

    /**
     * Get notification styles with consistent theming
     */
    public getNotificationStyles(color: string = 'blue') {
        return {
            color,
            icon: null, // Override with your icon when calling this method
            autoClose: 3000,
            withBorder: true,
            style: { borderRadius: this.mantineTheme.radius?.md || '4px' },
        };
    }

    /**
     * Get text styles for different purposes
     */
    public getTextStyles(purpose: 'heading' | 'body' | 'label' = 'body') {
        // Helper function to determine text size
        const getTextSize = () => {
            if (purpose === 'heading') return 'lg';
            if (purpose === 'label') return 'sm';
            return 'md';
        };

        // Helper function to determine text color
        const getTextColor = () => {
            if (this.isDark) {
                if (purpose === 'heading') return 'white';
                if (purpose === 'label') return 'gray.1';
                return 'white'; // Maximum contrast for dark mode
            } else {
                if (purpose === 'heading') return 'dark.8';
                if (purpose === 'label') return 'dark.7';
                return 'dark.6';
            }
        };

        return {
            size: getTextSize(),
            c: getTextColor(),
            ...(this.isDark && { fw: purpose === 'body' ? 500 : undefined }) // Add font weight in dark mode for body text
        };
    }

    /**
     * Get color for active/inactive navigation items
     */
    public getNavLinkColor(isActive: boolean): string {
        if (isActive) {
            return this.customTheme?.accentColor || 'blue.6';
        }
        return this.isDark ? 'gray.3' : 'dark.6';
    }

    /**
     * Get form input styles with consistent theming
     */
    public getInputStyles() {
        return {
            input: {
                backgroundColor: this.isDark ? 'var(--mantine-color-dark-5)' : 'white',
                borderColor: this.isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-4)',
                borderRadius: this.mantineTheme.radius?.sm || '3px',
                fontSize: this.mantineTheme.fontSizes?.sm || '14px',
            },
            label: {
                color: this.isDark ? 'var(--mantine-color-gray-2)' : 'var(--mantine-color-dark-8)',
                fontSize: this.mantineTheme.fontSizes?.sm || '14px',
            }
        };
    }

    /**
     * Get button styles with consistent theming
     */
    public getButtonStyles(variant: 'primary' | 'secondary' | 'outline' = 'primary') {
        // Helper function to determine button color
        const getButtonColor = () => {
            if (variant === 'primary') {
                return this.customTheme?.primaryColor || 'blue.5';
            }
            if (variant === 'secondary') {
                return this.customTheme?.accentColor || 'blue.6';
            }
            return this.isDark ? 'gray.4' : 'dark.4';
        };

        return {
            color: getButtonColor(),
            variant: variant === 'outline' ? 'outline' : 'filled',
            radius: this.mantineTheme.radius?.sm || '3px',
            size: 'sm',
        };
    }

    /**
     * Get tab styles with consistent theming
     */
    public getTabsStyles() {
        // Get the theme's Tabs styles or fallback to our custom styles if not defined
        const themeTabsStyles = this.mantineTheme.components?.Tabs?.styles;

        if (themeTabsStyles) {
            // If theme has Tabs styles defined, use those
            try {
                return {
                    ...themeTabsStyles(this.mantineTheme as unknown as ThemeWithColorScheme),
                    autoContrast: true
                };
            } catch (error) {
                console.warn('Error applying Tabs styles:', error);
                // Fall through to default styles
            }
        }

        // Otherwise return our custom styles
        return {
            tab: {
                color: this.isDark ? 'white' : 'black', // Simple white/black text for maximum contrast
                backgroundColor: this.isDark ? 'var(--mantine-color-dark-7)' : 'var(--mantine-color-white)',
                '&:hover': {
                    backgroundColor: this.isDark ? 'var(--mantine-color-dark-6)' : 'var(--mantine-color-gray-1)',
                },
                '&[dataActive="true"]': {
                    color: this.isDark ? 'white' : 'black', // Keep text white in dark mode, black in light mode
                    borderColor: this.isDark
                        ? `var(--mantine-color-${this.customTheme?.accentColor?.split('.')[0] || 'blue'}-3)` // Matching border color with fallback
                        : `var(--mantine-color-${this.customTheme?.accentColor?.split('.')[0] || 'blue'}-6)`,
                    fontWeight: 600, // Make active tab text bold
                    backgroundColor: this.isDark ? 'var(--mantine-color-dark-6)' : 'var(--mantine-color-white)',
                },
            },
            tabsList: {
                borderBottomColor: this.isDark ? 'var(--mantine-color-dark-3)' : 'var(--mantine-color-gray-3)',
                borderBottomWidth: this.isDark ? '2px' : '1px', // Thicker border in dark mode for better visibility
            },
            panel: {
                color: this.isDark ? 'var(--mantine-color-white)' : 'var(--mantine-color-dark-8)',
            },
            autoContrast: true,
        };
    }
}

// Export a singleton instance
export const styleService = StyleService.getInstance();

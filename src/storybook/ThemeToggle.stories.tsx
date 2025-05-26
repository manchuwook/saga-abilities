import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from '../components/ThemeToggle';
import { MantineProvider, ColorSchemeScript, localStorageColorSchemeManager } from '@mantine/core';
import { ThemeProvider } from '../context/ThemeContext';
import { baseTheme } from '../theme/mantineTheme';

const meta: Meta<typeof ThemeToggle> = {
    component: ThemeToggle,
    title: 'Components/ThemeToggle',
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (Story) => {
            // Create a color scheme manager for storybook
            const colorSchemeManager = localStorageColorSchemeManager({ key: 'saga-abilities-storybook-color-scheme' });

            return (
                <>
                    <ColorSchemeScript defaultColorScheme="light" />
                    <MantineProvider theme={baseTheme} defaultColorScheme="light" colorSchemeManager={colorSchemeManager}>
                        <ThemeProvider>
                            <div style={{ padding: '20px', position: 'relative', height: '100px', width: '100px' }}>
                                <Story />
                            </div>
                        </ThemeProvider>
                    </MantineProvider>
                </>
            );
        },
    ],
};

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const Default: Story = {
    args: {
        onToggle: () => alert('Theme toggle clicked!'),
    },
};

export const DarkMode: Story = {
    args: {
        onToggle: () => alert('Theme toggle clicked in dark mode!'),
    },
    parameters: {
        backgrounds: { default: 'dark' },
    },
    decorators: [
        (Story) => {
            // Create a color scheme manager for storybook
            const colorSchemeManager = localStorageColorSchemeManager({ key: 'saga-abilities-storybook-color-scheme' });

            return (
                <>
                    <ColorSchemeScript defaultColorScheme="dark" />
                    <MantineProvider theme={baseTheme} defaultColorScheme="dark" colorSchemeManager={colorSchemeManager}>
                        <ThemeProvider>
                            <div style={{ padding: '20px', position: 'relative', height: '100px', width: '100px' }}>
                                <Story />
                            </div>
                        </ThemeProvider>
                    </MantineProvider>
                </>
            );
        },
    ],
};

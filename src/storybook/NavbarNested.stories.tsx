import type { Meta, StoryObj } from '@storybook/react';
import { NavbarNested } from '../components/NavbarNested/NavbarNested';
import { MantineProvider, ColorSchemeScript, localStorageColorSchemeManager } from '@mantine/core';
import { ThemeProvider } from '../context/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { baseTheme } from '../theme/mantineTheme';
import { BrowserRouter } from 'react-router-dom';
import { AbilityManualsContext } from '../context/AbilityManualsContext';

// Mock data for AbilityManuals
const mockAbilityManualsContext = {
    AbilityManuals: [
        { id: '1', name: 'Warrior Abilities', character: 'Warrior Character', description: 'Warrior abilities manual', abilities: [], createdAt: new Date(), updatedAt: new Date() },
        { id: '2', name: 'Mage Abilities', character: 'Mage Character', description: 'Mage abilities manual', abilities: [], createdAt: new Date(), updatedAt: new Date() },
        { id: '3', name: 'Rogue Abilities', character: 'Rogue Character', description: 'Rogue abilities manual', abilities: [], createdAt: new Date(), updatedAt: new Date() }
    ],
    addAbilityManual: () => { },
    updateAbilityManual: () => { },
    deleteAbilityManual: () => { },
    getAbilityManual: () => undefined,
    addAbilityToAbilityManual: () => { },
    removeAbilityFromAbilityManual: () => { }
};

const queryClient = new QueryClient();

const meta: Meta<typeof NavbarNested> = {
    component: NavbarNested,
    title: 'Components/NavbarNested',
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [
        (Story) => {
            // Create a color scheme manager for storybook
            const colorSchemeManager = localStorageColorSchemeManager({ key: 'saga-abilities-storybook-color-scheme' });

            return (
                <QueryClientProvider client={queryClient}>
                    <ColorSchemeScript />
                    <MantineProvider theme={baseTheme} defaultColorScheme="light" colorSchemeManager={colorSchemeManager}>
                        <ThemeProvider>
                            <AbilityManualsContext.Provider value={mockAbilityManualsContext}>
                                <BrowserRouter>
                                    <div style={{
                                        padding: 0,
                                        height: '100vh',
                                        width: '300px',
                                        border: '1px solid var(--mantine-color-gray-3)'
                                    }}>
                                        <Story />
                                    </div>
                                </BrowserRouter>
                            </AbilityManualsContext.Provider>
                        </ThemeProvider>
                    </MantineProvider>
                </QueryClientProvider>
            );
        },
    ],
};

export default meta;
type Story = StoryObj<typeof NavbarNested>;

export const Default: Story = {
    args: {
        opened: true
    }
};

export const DarkMode: Story = {
    args: {
        opened: true
    },
    parameters: {
        backgrounds: { default: 'dark' },
    },
    decorators: [
        (Story) => {
            const colorSchemeManager = localStorageColorSchemeManager({ key: 'saga-abilities-storybook-color-scheme' });

            return (
                <QueryClientProvider client={queryClient}>
                    <ColorSchemeScript defaultColorScheme="dark" />
                    <MantineProvider theme={baseTheme} defaultColorScheme="dark" colorSchemeManager={colorSchemeManager}>
                        <ThemeProvider>
                            <AbilityManualsContext.Provider value={mockAbilityManualsContext}>
                                <BrowserRouter>
                                    <div style={{
                                        padding: 0,
                                        height: '100vh',
                                        width: '300px',
                                        border: '1px solid var(--mantine-color-dark-4)'
                                    }}>
                                        <Story />
                                    </div>
                                </BrowserRouter>
                            </AbilityManualsContext.Provider>
                        </ThemeProvider>
                    </MantineProvider>
                </QueryClientProvider>
            );
        }
    ]
};

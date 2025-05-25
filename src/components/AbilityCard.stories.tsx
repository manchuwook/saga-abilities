import type { Meta, StoryObj } from '@storybook/react';
import { AbilityCard } from './AbilityCard';
import { Ability } from '../models/abilities.zod';
import { MantineProvider, ColorSchemeScript, localStorageColorSchemeManager } from '@mantine/core';
import { ThemeProvider } from '../context/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { baseTheme } from '../theme/mantineTheme';

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
            refetchOnWindowFocus: false,
        },
    },
});

// Mock data for stories
const sampleAbility: Ability = {
    abilityName: "Deflecting Edge",
    abilityCp: 40,
    abilityDiscipline: "Balanced_Sword",
    abilityLevel: "Intermediate",
    abilityType: "Active",
    abilityDescription: "When an opponent attacks you with a melee weapon, you may spend a degree of success to attempt to redirect their blow. Make an opposed Balanced Sword roll against the attacker. If you succeed, their attack is redirected to another target within your weapon's reach, and your opponent must apply their attack result to the new target instead."
};

const sampleAbilityWithComplexity: Ability = {
    abilityName: "Elemental Attunement",
    abilityCp: 30,
    abilityDiscipline: "Elementalism",
    abilityLevel: "Basic",
    abilityType: "Passive",
    abilityDescription: "You have an intuitive understanding of elemental magic. You gain a +1 bonus to all spellcasting rolls involving elemental magic and reduce the complexity of all elemental spells by 1.",
    complexityPyromancy: 1,
    complexityHydromancy: 1,
    complexityAeromancy: 1,
    complexityGeomancy: 1
};

const advancedAbility: Ability = {
    abilityName: "Whirlwind Strike",
    abilityCp: 60,
    abilityDiscipline: "Unbalanced_Sword",
    abilityLevel: "Advanced",
    abilityType: "Active",
    abilityDescription: "You spin in a deadly arc, striking all enemies within your reach. Make a single Unbalanced Sword roll and apply the result against the defense of all targets within your weapon's reach. This ability can only be used once per scene and requires a full turn to execute."
};

// Mock for the AbilityTags hook
// We mock the data in the decorator instead of trying to mock the hook itself
const mockAbilityTags = {
    tags: [
        {
            tag: "offensive",
            name: "Offensive",
            description: "Abilities focused on attacking",
            abilities: ["Deflecting Edge", "Whirlwind Strike"]
        },
        {
            tag: "defensive",
            name: "Defensive",
            description: "Abilities focused on defense",
            abilities: ["Deflecting Edge"]
        },
        {
            tag: "magic",
            name: "Magic",
            description: "Magic-related abilities",
            abilities: ["Elemental Attunement"]
        },
        {
            tag: "utility",
            name: "Utility",
            description: "Utility abilities",
            abilities: ["Elemental Attunement"]
        }
    ]
};

// Add mock data to the query client
queryClient.setQueryData(['abilityTags'], { data: mockAbilityTags });

const meta: Meta<typeof AbilityCard> = {
    component: AbilityCard,
    title: 'Components/AbilityCard',
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    }, decorators: [
        (Story) => {
            // Create a color scheme manager for storybook
            const colorSchemeManager = localStorageColorSchemeManager({ key: 'saga-abilities-storybook-color-scheme' });

            return (
                <QueryClientProvider client={queryClient}>
                    <ColorSchemeScript defaultColorScheme="light" />
                    <MantineProvider theme={baseTheme} defaultColorScheme="light" colorSchemeManager={colorSchemeManager}>
                        <ThemeProvider>
                            <div style={{ padding: '20px', width: '350px' }}>
                                <Story />
                            </div>
                        </ThemeProvider>
                    </MantineProvider>
                </QueryClientProvider>
            );
        },
    ],
};

export default meta;
type Story = StoryObj<typeof AbilityCard>;

export const Basic: Story = {
    args: {
        ability: sampleAbility,
        onViewDetails: (ability) => alert(`Viewing details for: ${ability.abilityName}`),
        onAddToAbilityManual: (ability) => alert(`Adding to manual: ${ability.abilityName}`),
    },
};

export const WithComplexity: Story = {
    args: {
        ability: sampleAbilityWithComplexity,
        onViewDetails: (ability) => alert(`Viewing details for: ${ability.abilityName}`),
        onAddToAbilityManual: (ability) => alert(`Adding to manual: ${ability.abilityName}`),
    },
};

export const Advanced: Story = {
    args: {
        ability: advancedAbility,
        onViewDetails: (ability) => alert(`Viewing details for: ${ability.abilityName}`),
        onAddToAbilityManual: (ability) => alert(`Adding to manual: ${ability.abilityName}`),
    },
};

export const RemovableCard: Story = {
    args: {
        ability: sampleAbility,
        onViewDetails: (ability) => alert(`Viewing details for: ${ability.abilityName}`),
        onRemoveFromAbilityManual: (abilityName) => alert(`Removing from manual: ${abilityName}`),
        showRemoveButton: true,
    },
};

export const DarkMode: Story = {
    args: {
        ability: sampleAbility,
        onViewDetails: (ability) => alert(`Viewing details for: ${ability.abilityName}`),
        onAddToAbilityManual: (ability) => alert(`Adding to manual: ${ability.abilityName}`),
    },
    parameters: {
        backgrounds: { default: 'dark' },
    }, decorators: [
        (Story) => {
            // Create a color scheme manager for storybook
            const colorSchemeManager = localStorageColorSchemeManager({ key: 'saga-abilities-storybook-color-scheme' });

            return (
                <QueryClientProvider client={queryClient}>
                    <ColorSchemeScript defaultColorScheme="dark" />
                    <MantineProvider theme={baseTheme} defaultColorScheme="dark" colorSchemeManager={colorSchemeManager}>
                        <ThemeProvider>
                            <div style={{ padding: '20px', width: '350px' }}>
                                <Story />
                            </div>
                        </ThemeProvider>
                    </MantineProvider>
                </QueryClientProvider>
            );
        },
    ],
};

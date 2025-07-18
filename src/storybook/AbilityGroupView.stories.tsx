import type { Meta, StoryObj } from '@storybook/react';
import { MantineProvider, ColorSchemeScript, localStorageColorSchemeManager } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../context/ThemeContext';
import { baseTheme } from '../theme/mantineTheme';
import { AbilityGroupView } from '../components/AbilityGroupView';
import { Ability } from '../models/abilities.zod';

// Create a client for React Query
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
            refetchOnWindowFocus: false,
        },
    },
});

// Sample abilities for demonstration
const sampleAbilities: Ability[] = [
    {
        abilityName: 'Advance!',
        abilityCp: 8,
        abilityDiscipline: 'Leadership',
        abilityLevel: 'Intermediate',
        abilityType: 'Boost (M+10T)',
        abilityDescription: 'Boost to a Motivate Action. In addition to the normal effects of a Motivate Action, the recipient reduces their current Initiative by a number of Ticks equal to your Effect.'
    },
    {
        abilityName: 'Aerial Flip',
        abilityCp: 16,
        abilityDiscipline: 'Tumbling',
        abilityLevel: 'Advanced',
        abilityType: 'Reaction (G+25T)',
        abilityDescription: 'Aerial Flip can be bid as a Reaction to an Attack Made while moving declared against you that ends at Measure 0.'
    },
    {
        abilityName: 'Aeromancy I',
        abilityCp: 4,
        abilityDiscipline: 'Elementalism',
        abilityLevel: 'Basic',
        abilityType: 'Modifier',
        abilityDescription: 'When casting any Aeromancy spell or ritual you treat the Complexity as 1 less (to a minimum of 0).',
        complexityAeromancy: -1
    },
    {
        abilityName: 'Aeromancy II',
        abilityCp: 8,
        abilityDiscipline: 'Elementalism',
        abilityLevel: 'Intermediate',
        abilityType: 'Modifier',
        abilityDescription: 'When casting any Aeromancy spell or ritual you treat the Complexity as 1 less (to a minimum of 0).',
        complexityAeromancy: -1
    },
    {
        abilityName: 'Alchemy I',
        abilityCp: 4,
        abilityDiscipline: 'Sorcery',
        abilityLevel: 'Basic',
        abilityType: 'Modifier',
        abilityDescription: 'When casting any Alchemy spell or ritual you treat the Complexity as 1 less (to a minimum of 0).',
        complexityAlchemy: -1
    },
    {
        abilityName: 'Argus',
        abilityCp: 16,
        abilityDiscipline: 'Sentinel',
        abilityLevel: 'Advanced',
        abilityType: 'Boost (M)',
        abilityDescription: 'A Boost to an attack action with a range increment made in the first range increment. Ignore up to 3 points of Cover or Concealment.'
    },
    {
        abilityName: 'Back Stance',
        abilityCp: 4,
        abilityDiscipline: 'Melee_Form',
        abilityLevel: 'Basic',
        abilityType: 'Stance',
        abilityDescription: 'Your main attacking hand is kept behind you. All Cut, Slice and Strike attacks are Accurate (+2), all other attacks are Accurate (-2).'
    },
    {
        abilityName: 'Bell Ringer',
        abilityCp: 4,
        abilityDiscipline: 'Balanced_Sword',
        abilityLevel: 'Basic',
        abilityType: 'Maneuver (Effect=BOD)',
        abilityDescription: 'You may use the Bell Ringer Maneuver with any Melee Attack that deals type I (Impact) Damage. Spend Effect equal to the target\'s Body Defense to daze your target.'
    },
    {
        abilityName: 'Block and Step',
        abilityCp: 4,
        abilityDiscipline: 'Shield_Use',
        abilityLevel: 'Basic',
        abilityType: 'Boost (5T)',
        abilityDescription: 'A +5T Boost to a Block Reaction, allows you to take a 1 yd Step after the Block is resolved.'
    },
    {
        abilityName: 'Blood Lust',
        abilityCp: 4,
        abilityDiscipline: 'Bearskin_Warrior',
        abilityLevel: 'Basic',
        abilityType: 'Modifier',
        abilityDescription: 'If you deliver a Moderate Wound, or greater, to a target via a Melee Attack, immediately restore 1 Reserve Pool.'
    }
];

// Mock abilities tags for the useAbilityTags hook
queryClient.setQueryData(['abilityTags'], {
    data: {
        tags: [
            {
                tag: 'offensive',
                name: 'Offensive',
                description: 'Abilities focused on attacking',
                abilities: ['Argus', 'Bell Ringer', 'Blood Lust']
            },
            {
                tag: 'defensive',
                name: 'Defensive',
                description: 'Abilities focused on defense',
                abilities: ['Block and Step', 'Back Stance']
            },
            {
                tag: 'magic',
                name: 'Magic',
                description: 'Magic-related abilities',
                abilities: ['Aeromancy I', 'Aeromancy II', 'Alchemy I']
            },
            {
                tag: 'movement',
                name: 'Movement',
                description: 'Movement abilities',
                abilities: ['Aerial Flip', 'Advance!']
            }
        ]
    }
});

const meta: Meta<typeof AbilityGroupView> = {
    component: AbilityGroupView,
    title: 'Components/AbilityGroupView',
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'A component that displays abilities grouped by various criteria such as discipline, level, type, or a nested combination of all three.'
            }
        }
    },
    decorators: [
        (Story) => {
            const colorSchemeManager = localStorageColorSchemeManager({
                key: 'saga-abilities-storybook-color-scheme'
            });

            return (
                <QueryClientProvider client={queryClient}>
                    <ColorSchemeScript defaultColorScheme="light" />
                    <MantineProvider
                        theme={baseTheme}
                        defaultColorScheme="light"
                        colorSchemeManager={colorSchemeManager}
                    >
                        <ThemeProvider>
                            <Story />
                        </ThemeProvider>
                    </MantineProvider>
                </QueryClientProvider>
            );
        },
    ],
    argTypes: {
        abilities: {
            description: 'Array of abilities to display grouped',
            control: { type: 'object' }
        },
        onViewDetails: {
            description: 'Callback when viewing ability details',
            action: 'viewDetails'
        },
        onAddToAbilityManual: {
            description: 'Callback when adding ability to manual',
            action: 'addToManual'
        },
        onRemoveFromAbilityManual: {
            description: 'Callback when removing ability from manual',
            action: 'removeFromManual'
        },
        showRemoveButton: {
            description: 'Whether to show remove buttons instead of add buttons',
            control: { type: 'boolean' }
        }
    }
};

export default meta;
type Story = StoryObj<typeof AbilityGroupView>;

// Default story showing abilities grouped by discipline
export const Default: Story = {
    args: {
        abilities: sampleAbilities,
        showRemoveButton: false,
    },
    parameters: {
        docs: {
            description: {
                story: 'Default view showing abilities grouped by discipline. Users can switch between different grouping types using the dropdown.'
            }
        }
    }
};

// Story showing abilities with remove buttons (for use in ability manuals)
export const WithRemoveButtons: Story = {
    args: {
        abilities: sampleAbilities.slice(0, 5), // Show fewer abilities for this example
        showRemoveButton: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'View with remove buttons enabled, typically used in ability manual detail pages where users can remove abilities from their collections.'
            }
        }
    }
};

// Story with a smaller set of abilities to show different grouping structures
export const SmallDataset: Story = {
    args: {
        abilities: sampleAbilities.slice(0, 4),
        showRemoveButton: false,
    },
    parameters: {
        docs: {
            description: {
                story: 'Example with a smaller dataset to better demonstrate the different grouping structures, especially the nested grouping view.'
            }
        }
    }
};

// Dark mode story
export const DarkMode: Story = {
    args: {
        abilities: sampleAbilities,
        showRemoveButton: false,
    },
    parameters: {
        backgrounds: { default: 'dark' },
        docs: {
            description: {
                story: 'Dark mode variant showing how the component adapts to different color schemes.'
            }
        }
    },
    decorators: [
        (Story) => {
            const colorSchemeManager = localStorageColorSchemeManager({
                key: 'saga-abilities-storybook-color-scheme'
            });

            return (
                <QueryClientProvider client={queryClient}>
                    <ColorSchemeScript defaultColorScheme="dark" />
                    <MantineProvider
                        theme={baseTheme}
                        defaultColorScheme="dark"
                        colorSchemeManager={colorSchemeManager}
                    >
                        <ThemeProvider>
                            <Story />
                        </ThemeProvider>
                    </MantineProvider>
                </QueryClientProvider>
            );
        },
    ],
};

// Empty state story
export const EmptyState: Story = {
    args: {
        abilities: [],
        showRemoveButton: false,
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows how the component handles an empty abilities array.'
            }
        }
    }
};

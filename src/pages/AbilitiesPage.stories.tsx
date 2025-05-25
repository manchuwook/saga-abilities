import type { Meta, StoryObj } from '@storybook/react';
import { useState, useEffect, useCallback } from 'react';
import { MantineProvider, ColorSchemeScript, localStorageColorSchemeManager } from '@mantine/core';
import { ThemeProvider } from '../context/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { baseTheme } from '../theme/mantineTheme';
import { AbilityManualsContext } from '../context/AbilityManualsContext';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import { Ability } from '../models/abilities.zod';
import { useStyles } from '../hooks/useStyles';

// Import components used in the actual AbilitiesPage
import {
    Container,
    Title,
    Text,
    SimpleGrid,
    Group,
    useMantineColorScheme,
    Loader,
    Center,
    Paper
} from '@mantine/core';
import { AbilityCard } from '../components/AbilityCard';
import { AbilityDetailsModal } from '../components/AbilityDetailsModal';
import { AddToAbilityManualModal } from '../components/AddToAbilityManualModal';
import { AbilitiesFilter } from '../components/AbilitiesFilter';
import { ExportButton } from '../components/ExportButton';

// Create a mocked version of the page that doesn't require hooks
function MockedAbilitiesPage({ isLoading = false, hasError = false }) {
    const { isDark } = useStyles();
    const [selectedAbility, setSelectedAbility] = useState<Ability | null>(null);
    const [filteredAbilities, setFilteredAbilities] = useState<Ability[]>([]);
    const [detailsModalOpened, { open: openDetailsModal, close: closeDetailsModal }] = useDisclosure(false);
    const [abilityManualModalOpened, { open: openAbilityManualModal, close: closeAbilityManualModal }] = useDisclosure(false);    // Using sample data directly from sampleAbilities// Initialize filtered abilities
    useEffect(() => {
        if (!isLoading && !hasError) {
            const sortedAbilities = [...sampleAbilities].sort((a, b) => a.abilityName.localeCompare(b.abilityName));
            setFilteredAbilities(sortedAbilities);
        }
    }, [isLoading, hasError]);

    const handleViewDetails = (ability: Ability) => {
        setSelectedAbility(ability);
        openDetailsModal();
    };

    const handleAddToAbilityManual = (ability: Ability) => {
        setSelectedAbility(ability);
        openAbilityManualModal();
    };    // Use useCallback to memoize the filter change handler
    const handleFilterChange = useCallback((filtered: Ability[]) => {
        // Create a new sorted array rather than modifying the input
        const sortedAbilities = [...filtered].sort((a, b) => a.abilityName.localeCompare(b.abilityName));
        setFilteredAbilities(sortedAbilities);
    }, []);

    if (isLoading) {
        return (
            <Center h="70vh">
                <Loader size="xl" color={isDark ? 'blue.4' : 'blue.6'} />
            </Center>
        );
    }

    if (hasError) {
        return (
            <Container size="md" py="xl">
                <Paper p="xl" withBorder radius="md" bg={isDark ? 'dark.6' : 'white'}>
                    <Title order={2} ta="center" c="red" mb="xl">
                        Error Loading Abilities
                    </Title>
                    <Text ta="center" c={isDark ? 'gray.2' : 'dark.7'}>
                        Failed to fetch abilities. Please try again later.
                    </Text>
                </Paper>
            </Container>
        );
    }

    return (
        <Container size="xl" py="xl">
            <Group justify="space-between" mb="xl">
                <Title order={1} c={isDark ? 'gray.1' : 'dark.8'}>Abilities Library</Title>
                <ExportButton abilities={filteredAbilities} label="Export Abilities" />
            </Group>            <AbilitiesFilter
                abilities={sampleAbilities}
                onFilterChange={handleFilterChange}
            />

            <Text mt="md" mb="md" c={isDark ? 'gray.3' : 'dark.7'}>
                {filteredAbilities.length} {filteredAbilities.length === 1 ? 'ability' : 'abilities'} found
            </Text>

            <SimpleGrid
                cols={{ base: 1, xs: 2, md: 3, lg: 4 }}
                spacing="md"
                mt="xl"
            >
                {filteredAbilities.map((ability) => (
                    <AbilityCard
                        key={`${ability.abilityName} (${ability.abilityDiscipline})`}
                        ability={ability}
                        onViewDetails={handleViewDetails}
                        onAddToAbilityManual={handleAddToAbilityManual}
                    />
                ))}
            </SimpleGrid>

            <AbilityDetailsModal
                ability={selectedAbility}
                opened={detailsModalOpened}
                onClose={closeDetailsModal}
            />

            <AddToAbilityManualModal
                ability={selectedAbility}
                opened={abilityManualModalOpened}
                onClose={closeAbilityManualModal}
            />
        </Container>
    );
}

// Create a client for React Query
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
            refetchOnWindowFocus: false,
        },
    },
});

// Sample abilities for our mock data
const sampleAbilities: Ability[] = [
    {
        abilityName: "Deflecting Edge",
        abilityCp: 40,
        abilityDiscipline: "Balanced_Sword",
        abilityLevel: "Intermediate",
        abilityType: "Active",
        abilityDescription: "When an opponent attacks you with a melee weapon, you may spend a degree of success to attempt to redirect their blow. Make an opposed Balanced Sword roll against the attacker. If you succeed, their attack is redirected to another target within your weapon's reach, and your opponent must apply their attack result to the new target instead."
    },
    {
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
    },
    {
        abilityName: "Whirlwind Strike",
        abilityCp: 60,
        abilityDiscipline: "Unbalanced_Sword",
        abilityLevel: "Advanced",
        abilityType: "Active",
        abilityDescription: "You spin in a deadly arc, striking all enemies within your reach. Make a single Unbalanced Sword roll and apply the result against the defense of all targets within your weapon's reach. This ability can only be used once per scene and requires a full turn to execute."
    },
    {
        abilityName: "Inner Strength",
        abilityCp: 25,
        abilityDiscipline: "Inner_Pillar",
        abilityLevel: "Basic",
        abilityType: "Passive",
        abilityDescription: "Through rigorous training, you have developed exceptional mental resilience. You gain a +2 bonus to all willpower checks to resist mental manipulation or control."
    },
    {
        abilityName: "Strategic Command",
        abilityCp: 45,
        abilityDiscipline: "Strategist",
        abilityLevel: "Intermediate",
        abilityType: "Active",
        abilityDescription: "As an action, you can analyze the battlefield and provide tactical guidance to your allies. Up to three allies of your choice gain a +1 bonus to their next attack or defense roll, provided they can hear and understand you."
    },
    {
        abilityName: "Shadow Step",
        abilityCp: 35,
        abilityDiscipline: "Sneak",
        abilityLevel: "Intermediate",
        abilityType: "Active",
        abilityDescription: "You can move silently from shadow to shadow. When in dim light or darkness, you can move up to half your movement speed without making any noise and without requiring a stealth check."
    }
];

// Sample ability manual for context
const sampleAbilityManual = {
    id: "123456",
    name: "Wizard's Spellbook",
    character: "Gandalf the Grey",
    description: "A collection of magical abilities for my wizard character",
    abilities: [sampleAbilities[0], sampleAbilities[1]],
    createdAt: new Date("2025-05-01"),
    updatedAt: new Date("2025-05-20"),
};

// Mock for AbilityManualsContext
const mockAbilityManualsContext = {
    AbilityManuals: [sampleAbilityManual],
    addAbilityManual: () => { },
    updateAbilityManual: () => { },
    deleteAbilityManual: () => { },
    getAbilityManual: (id: string) => {
        if (id === "123456") {
            return sampleAbilityManual;
        }
        return undefined;
    },
    addAbilityToAbilityManual: () => { },
    removeAbilityFromAbilityManual: () => { },
};

// Mock abilities tags for the useAbilityTags hook
queryClient.setQueryData(['abilityTags'], {
    data: {
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
                tag: "strategy",
                name: "Strategy",
                description: "Strategic abilities",
                abilities: ["Strategic Command"]
            },
            {
                tag: "stealth",
                name: "Stealth",
                description: "Stealth abilities",
                abilities: ["Shadow Step"]
            },
            {
                tag: "mental",
                name: "Mental",
                description: "Mental abilities",
                abilities: ["Inner Strength"]
            }
        ]
    }
});

// Mock abilities data for the useAbilities hook
queryClient.setQueryData(['abilities'], sampleAbilities);

const meta: Meta<typeof MockedAbilitiesPage> = {
    component: MockedAbilitiesPage,
    title: 'Pages/AbilitiesPage',
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
                    <ColorSchemeScript defaultColorScheme="light" />
                    <MantineProvider theme={baseTheme} defaultColorScheme="light" colorSchemeManager={colorSchemeManager}>
                        <Notifications position="top-right" />
                        <ModalsProvider>
                            <ThemeProvider>
                                <AbilityManualsContext.Provider value={mockAbilityManualsContext}>
                                    <Story />
                                </AbilityManualsContext.Provider>
                            </ThemeProvider>
                        </ModalsProvider>
                    </MantineProvider>
                </QueryClientProvider>
            );
        },
    ],
};

export default meta;
type Story = StoryObj<typeof MockedAbilitiesPage>;

// Default story showing the abilities page
export const Default: Story = {
    args: {
        isLoading: false,
        hasError: false
    }
};

// Loading state story
export const Loading: Story = {
    args: {
        isLoading: true,
        hasError: false
    }
};

// Error state story
export const Error: Story = {
    args: {
        isLoading: false,
        hasError: true
    }
};

// Dark mode variant
export const DarkMode: Story = {
    args: {
        isLoading: false,
        hasError: false
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
                        <Notifications position="top-right" />
                        <ModalsProvider>
                            <ThemeProvider>
                                <AbilityManualsContext.Provider value={mockAbilityManualsContext}>
                                    <Story />
                                </AbilityManualsContext.Provider>
                            </ThemeProvider>
                        </ModalsProvider>
                    </MantineProvider>
                </QueryClientProvider>
            );
        },
    ],
};

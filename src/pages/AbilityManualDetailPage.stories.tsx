import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { MantineProvider, ColorSchemeScript, localStorageColorSchemeManager } from '@mantine/core';
import { ThemeProvider } from '../context/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { baseTheme } from '../theme/mantineTheme';
import { AbilityManual } from '../context/AbilityManualsContext';
import { Ability } from '../models/abilities.zod';
import { AbilityManualsContext } from '../context/AbilityManualsContext';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';

// Import the actual components from AbilityManualDetailPage
import {
    Container,
    Title,
    Text,
    Group,
    Button,
    SimpleGrid,
    Card,
    Stack,
    Paper
} from '@mantine/core';
import { SafeTabs } from '../components/common/SafeTabs';
import { AbilityCardWide } from '../components/AbilityCardWide';
import { AbilityDetailsModal } from '../components/AbilityDetailsModal';
import { EditAbilityManualModal } from '../components/EditAbilityManualModal';
import { AbilityManualExportButton } from '../components/AbilityManualExportButton';
import { AbilitiesFilter } from '../components/AbilitiesFilter';
import { useDisclosure } from '@mantine/hooks';
// Removed Tabler icons to avoid TypeScript issues in Storybook
import { useStyles } from '../hooks/useStyles';

// Create mocked version of the page that doesn't require router
function MockedAbilityManualDetailPage({ id = "123456", notFound = false }) {
    const { isDark } = useStyles();
    const [activeTab, setActiveTab] = useState('abilities');
    const [selectedAbility, setSelectedAbility] = useState<Ability | null>(null);
    const [filteredAbilities, setFilteredAbilities] = useState<Ability[]>([]);
    const [detailsModalOpened, { open: openDetailsModal, close: closeDetailsModal }] = useDisclosure(false);
    const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);

    // Use the mocked context directly instead of hooks
    const AbilityManual = notFound ? undefined : mockAbilityManualsContext.getAbilityManual(id);
    const allAbilities = sampleAbilities;

    const handleNavigateBack = () => {
        console.log('Navigating back to AbilityManuals');
    };

    const handleFilterChange = (abilities: Ability[]) => {
        setFilteredAbilities(abilities);
    };

    const handleViewDetails = (ability: Ability) => {
        setSelectedAbility(ability);
        openDetailsModal();
    };

    const handleRemoveAbility = (abilityName: string) => {
        console.log(`Removing ability: ${abilityName}`);
    };

    const handleAddAbility = (ability: Ability) => {
        console.log(`Adding ability: ${ability.abilityName}`);
    };

    if (!AbilityManual) {
        return (
            <Container size="md" py="xl">
                <Paper p="xl" withBorder radius="md" bg={isDark ? 'dark.6' : 'white'}>
                    <Title order={2} ta="center" mb="md" c={isDark ? 'white' : 'dark.8'}>AbilityManual Not Found</Title>
                    <Text ta="center" mb="xl" c={isDark ? 'white' : 'dark.6'} fw={isDark ? 500 : 400}>The Ability Manual you&apos;re looking for doesn&apos;t exist or has been deleted.</Text>
                    <Group justify="center">
                        <Button onClick={handleNavigateBack} color={isDark ? 'blue.4' : 'blue.6'}>
                            Back to Ability Manuals
                        </Button>
                    </Group>
                </Paper>
            </Container>
        );
    }

    // Filter out abilities that are already in the AbilityManual and sort alphabetically
    const availableAbilities = allAbilities?.filter(
        (ability: Ability) => !AbilityManual.abilities.some((s: Ability) => s.abilityName === ability.abilityName)
    )?.sort((a, b) => a.abilityName.localeCompare(b.abilityName)) || [];

    return (
        <Container size="xl" py="xl">      <Group mb="md">
            <Button
                variant="subtle"
                onClick={handleNavigateBack}
                color={isDark ? 'gray.4' : 'dark.4'}
            >
                Back to Ability Manuals
            </Button>
        </Group>

            <Group justify="space-between" mb="xl">
                <Stack gap={0}>
                    <Title order={1} c={isDark ? 'gray.1' : 'dark.8'}>{AbilityManual.name}</Title>
                    <Text size="lg" c={isDark ? 'gray.3' : 'dimmed'} fw={isDark ? 500 : 400}>Character: {AbilityManual.character}</Text>
                </Stack>
                <Group>
                    <Button
                        variant="outline"
                        onClick={openEditModal}
                        color={isDark ? 'blue.4' : 'blue.6'}
                    >
                        Edit Ability Manual
                    </Button>
                    <AbilityManualExportButton AbilityManual={AbilityManual} label="Export Ability Manual" />
                </Group>
            </Group>

            {AbilityManual.description && (
                <Text mb="xl" c={isDark ? 'white' : 'dark.7'} fw={isDark ? 500 : 400}>{AbilityManual.description}</Text>
            )}
            <SafeTabs
                activeTab={activeTab}
                onTabChange={(value) => value && setActiveTab(value)}
                tabs={[
                    {
                        value: 'abilities',
                        label: `Manual Abilities (${AbilityManual.abilities.length})`,
                        leftSection: <span>🔍</span>, // Using emoji instead of icon
                        content: AbilityManual.abilities.length === 0 ? (
                            <Card withBorder p="xl" ta="center" bg={isDark ? 'dark.6' : 'white'}>
                                <Text size="lg" fw={500} mb="md" c={isDark ? 'gray.1' : 'dark.8'}>
                                    This Ability Manual is empty
                                </Text>
                                <Text mb="xl" c={isDark ? 'white' : 'dark.6'} fw={isDark ? 500 : 400}>
                                    Go to the "Add Abilities" tab to start adding abilities to this Ability Manual.
                                </Text>
                                <Button onClick={() => setActiveTab('add-abilities')} color={isDark ? 'blue.4' : 'blue.6'}>Add Abilities</Button>
                            </Card>
                        ) : (
                            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                                {[...AbilityManual.abilities]
                                    .sort((a, b) => a.abilityName.localeCompare(b.abilityName)).map((ability) => (
                                        <AbilityCardWide
                                            key={`${ability.abilityName} (${ability.abilityDiscipline})`}
                                            ability={ability}
                                            onViewDetails={handleViewDetails}
                                            onRemoveFromAbilityManual={handleRemoveAbility}
                                            showRemoveButton
                                        />
                                    ))}
                            </SimpleGrid>
                        )
                    }, {
                        value: 'add-abilities',
                        label: 'Add Abilities',
                        leftSection: <span>➕</span>, // Using emoji instead of icon
                        content: (
                            <Stack gap="lg">
                                <AbilitiesFilter
                                    abilities={availableAbilities}
                                    onFilterChange={handleFilterChange}
                                />
                                <Text c={isDark ? 'white' : 'dark.7'} fw={isDark ? 500 : 400}>
                                    {filteredAbilities.length} available {filteredAbilities.length === 1 ? 'ability' : 'abilities'}
                                </Text>
                                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                                    {[...filteredAbilities]
                                        .sort((a, b) => a.abilityName.localeCompare(b.abilityName))
                                        .map((ability) => (
                                            <AbilityCardWide
                                                key={`${ability.abilityName} (${ability.abilityDiscipline})`}
                                                ability={ability}
                                                onViewDetails={handleViewDetails}
                                                onAddToAbilityManual={handleAddAbility}
                                            />
                                        ))}
                                </SimpleGrid>
                            </Stack>
                        )
                    }
                ]}
            />

            <AbilityDetailsModal
                ability={selectedAbility}
                opened={detailsModalOpened}
                onClose={closeDetailsModal}
            />

            <EditAbilityManualModal
                AbilityManual={AbilityManual}
                opened={editModalOpened}
                onClose={closeEditModal}
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
    }
];

// Sample ability manual for our mock data
const sampleAbilityManual: AbilityManual = {
    id: "123456",
    name: "Wizard's Spellbook",
    character: "Gandalf the Grey",
    description: "A collection of magical abilities for my wizard character",
    abilities: [sampleAbilities[0], sampleAbilities[1]],
    createdAt: new Date("2025-05-01"),
    updatedAt: new Date("2025-05-20"),
};

// Create a mock for AbilityManualsContext
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

// Mock all abilities for the useAbilities hook
queryClient.setQueryData(['abilities'], sampleAbilities);

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
            }
        ]
    }
});

const meta: Meta<typeof MockedAbilityManualDetailPage> = {
    component: MockedAbilityManualDetailPage,
    title: 'Pages/AbilityManualDetailPage',
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
type Story = StoryObj<typeof MockedAbilityManualDetailPage>;

// Main story with a valid AbilityManual ID
export const WithValidID: Story = {
    args: {
        id: "123456",
        notFound: false
    }
};

// Story displaying the "not found" state
export const NotFound: Story = {
    args: {
        id: "invalid-id",
        notFound: true
    }
};

// Dark mode variant
export const DarkMode: Story = {
    args: {
        id: "123456",
        notFound: false
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

import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Loader,
  Center,
  Group,
  useMantineColorScheme,
  Paper
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAbilities } from '../hooks/useAbilities';
import { AbilityDetailsModal } from '../components/AbilityDetailsModal';
import { AddToAbilityManualModal } from '../components/AddToAbilityManualModal';
import { AbilityGroupView } from '../components/AbilityGroupView';
import { ExportButton } from '../components/ExportButton';
import { Ability } from '../models/abilities.zod';

export default function AbilitiesPage() {
  const { data: abilities, isLoading, error } = useAbilities();
  const [filteredAbilities, setFilteredAbilities] = useState<Ability[]>([]);
  const [selectedAbility, setSelectedAbility] = useState<Ability | null>(null);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const [detailsModalOpened, { open: openDetailsModal, close: closeDetailsModal }] = useDisclosure(false);
  const [AbilityManualModalOpened, { open: openAbilityManualModal, close: closeAbilityManualModal }] = useDisclosure(false);
  // Initialize filtered abilities when data is loaded
  useEffect(() => {
    if (abilities) {
      // Sort abilities alphabetically by name
      setFilteredAbilities([...abilities].sort((a, b) => a.abilityName.localeCompare(b.abilityName)));
    }
  }, [abilities]);

  const handleViewDetails = (ability: Ability) => {
    setSelectedAbility(ability);
    openDetailsModal();
  };

  const handleAddToAbilityManual = (ability: Ability) => {
    setSelectedAbility(ability);
    openAbilityManualModal();
  };
  // Custom filter handler to ensure alphabetical sorting after filtering
  const handleFilterChange = (filtered: Ability[]) => {
    // Only update state if the filtered abilities are different
    // This prevents unnecessary re-renders
    if (JSON.stringify(filtered) !== JSON.stringify(filteredAbilities)) {
      // Create a new sorted array rather than modifying the input
      const sortedAbilities = [...filtered].sort((a, b) => a.abilityName.localeCompare(b.abilityName));
      setFilteredAbilities(sortedAbilities);
    }
  };

  if (isLoading) {
    return (
      <Center h="70vh">
        <Loader size="xl" color={isDark ? 'blue.4' : 'blue.6'} />
      </Center>
    );
  }

  if (error) {
    return (
      <Container size="md" py="xl">
        <Paper p="xl" withBorder radius="md" bg={isDark ? 'dark.6' : 'white'}>
          <Title order={2} ta="center" c="red" mb="xl">
            Error Loading Abilities
          </Title>
          <Text ta="center" c={isDark ? 'gray.2' : 'dark.7'}>
            {error instanceof Error ? error.message : 'An unknown error occurred'}
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
      </Group>

      <AbilityGroupView
        abilities={filteredAbilities}
        allAbilities={abilities || []}
        onFilterChange={handleFilterChange}
        onViewDetails={handleViewDetails}
        onAddToAbilityManual={handleAddToAbilityManual}
      />

      <AbilityDetailsModal
        ability={selectedAbility}
        opened={detailsModalOpened}
        onClose={closeDetailsModal}
      />

      <AddToAbilityManualModal
        ability={selectedAbility}
        opened={AbilityManualModalOpened}
        onClose={closeAbilityManualModal}
      />
    </Container>
  );
}

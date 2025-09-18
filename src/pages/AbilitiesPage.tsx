import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Container,
  Title,
  Text,
  Loader,
  Center,
  Group,
  useMantineColorScheme,
  Paper,
  Pagination,
  Stack
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
  const [currentPage, setCurrentPage] = useState(1);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const ITEMS_PER_PAGE = 100; // Limit to 100 abilities per page

  const [detailsModalOpened, { open: openDetailsModal, close: closeDetailsModal }] = useDisclosure(false);
  const [AbilityManualModalOpened, { open: openAbilityManualModal, close: closeAbilityManualModal }] = useDisclosure(false);

  // Paginated abilities
  const paginatedAbilities = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAbilities.slice(startIndex, endIndex);
  }, [filteredAbilities, currentPage]);

  const totalPages = Math.ceil(filteredAbilities.length / ITEMS_PER_PAGE);
  // Initialize filtered abilities when data is loaded
  useEffect(() => {
    if (abilities && abilities.length > 0) {
      // Sort abilities alphabetically by name
      const sortedAbilities = [...abilities].sort((a, b) => a.abilityName.localeCompare(b.abilityName));
      setFilteredAbilities(sortedAbilities);
      setCurrentPage(1); // Reset to first page
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
  const handleFilterChange = useCallback((filtered: Ability[]) => {
    // Create a new sorted array rather than modifying the input
    const sortedAbilities = [...filtered].sort((a, b) => a.abilityName.localeCompare(b.abilityName));
    setFilteredAbilities(sortedAbilities);
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

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
        <Group>
          <Text size="sm" c={isDark ? 'gray.4' : 'gray.6'}>
            Showing {Math.min(ITEMS_PER_PAGE, filteredAbilities.length)} of {filteredAbilities.length} abilities
          </Text>
          <ExportButton abilities={filteredAbilities} label="Export Abilities" />
        </Group>
      </Group>

      <Stack gap="md">
        <AbilityGroupView
          abilities={paginatedAbilities}
          allAbilities={abilities || []}
          onFilterChange={handleFilterChange}
          onViewDetails={handleViewDetails}
          onAddToAbilityManual={handleAddToAbilityManual}
        />

        {totalPages > 1 && (
          <Center>
            <Pagination
              total={totalPages}
              value={currentPage}
              onChange={setCurrentPage}
              size="sm"
            />
          </Center>
        )}
      </Stack>

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

// filepath: x:\dev\saga-abilities\src\pages\AbilityManualDetailPage.tsx
import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { useDisclosure } from '@mantine/hooks';
import { IconArrowLeft, IconEdit, IconPlus, IconSearch, IconBooks } from '@tabler/icons-react';
import { useAbilityManuals } from '../hooks/useAbilityManuals';
import { AbilityCard } from '../components/AbilityCard';
import { AbilityDetailsModal } from '../components/AbilityDetailsModal';
import { EditAbilityManualModal } from '../components/EditAbilityManualModal';
import { AbilityManualExportButton } from '../components/AbilityManualExportButton';
import { Ability } from '../models/abilities.zod';
import { useAbilities } from '../hooks/useAbilities';
import { AbilitiesFilter } from '../components/AbilitiesFilter';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useStyles } from '../hooks/useStyles';

export default function AbilityManualDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAbilityManual, removeAbilityFromAbilityManual, addAbilityToAbilityManual } = useAbilityManuals();
  const { data: allAbilities } = useAbilities();
  const { isDark, styleService } = useStyles();
  const AbilityManual = id ? getAbilityManual(id) : undefined;
  const [activeTab, setActiveTab] = useState('abilities'); const [selectedAbility, setSelectedAbility] = useState<Ability | null>(null);
  const [filteredAbilities, setFilteredAbilities] = useState<Ability[]>([]);

  // Memoized callback to prevent infinite re-renders in AbilitiesFilter
  const handleFilterChange = useCallback((abilities: Ability[]) => {
    setFilteredAbilities(abilities);
  }, []);

  const [detailsModalOpened, { open: openDetailsModal, close: closeDetailsModal }] = useDisclosure(false);
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);

  if (!AbilityManual) {
    return (
      <Container size="md" py="xl">        <Paper p="xl" withBorder radius="md" bg={isDark ? 'dark.6' : 'white'}>
        <Title order={2} ta="center" mb="md" c={isDark ? 'white' : 'dark.8'}>AbilityManual Not Found</Title>
        <Text ta="center" mb="xl" c={isDark ? 'white' : 'dark.6'} fw={isDark ? 500 : 400}>The AbilityManual you're looking for doesn't exist or has been deleted.</Text>
        <Group justify="center">
          <Button onClick={() => navigate('/AbilityManuals')} color={isDark ? 'blue.4' : 'blue.6'}>
            Back to AbilityManuals
          </Button>
        </Group>
      </Paper>
      </Container>
    );
  }
  const handleViewDetails = (ability: Ability) => {
    setSelectedAbility(ability);
    openDetailsModal();
  }; const handleRemoveAbility = (abilityName: string) => {
    // Get modal styles from style service
    const modalStyles = styleService.getModalStyles();

    modals.openConfirmModal({
      title: <Text c={isDark ? 'white' : 'dark.9'} fw={700}>Remove Ability</Text>,
      children: (
        <Text size="sm" c={isDark ? 'gray.2' : 'dark.7'}>
          Are you sure you want to remove "{abilityName}" from this Ability Manual?
        </Text>
      ),
      labels: { confirm: 'Remove', cancel: 'Cancel' },
      confirmProps: { color: isDark ? 'red.4' : 'red.6' },
      cancelProps: { color: isDark ? 'gray.4' : 'gray.6' },
      overlayProps: modalStyles.overlayProps,
      styles: {
        header: modalStyles.header,
        content: modalStyles.content,
        body: modalStyles.body,
        close: modalStyles.close
      },
      onConfirm: () => {
        if (id) {
          removeAbilityFromAbilityManual(id, abilityName);
          notifications.show({
            title: 'Ability Removed',
            message: `${abilityName} has been removed from ${AbilityManual.name}`,
            color: 'red',
          });
        }
      },
    });
  }; const handleAddAbility = (ability: Ability) => {
    if (id) {
      addAbilityToAbilityManual(id, ability);

      // Get notification styles from style service
      const notificationStyles = styleService.getNotificationStyles('green');

      notifications.show({
        title: 'Ability Added',
        message: `${ability.abilityName} has been added to ${AbilityManual.name}`,
        color: notificationStyles.color,
        icon: <IconBooks size={20} />,
        autoClose: notificationStyles.autoClose,
        withBorder: notificationStyles.withBorder,
        style: notificationStyles.style,
      });
      // Removed auto-switching to abilities tab to keep user on add-abilities tab
    }
  };  // Filter out abilities that are already in the AbilityManual and sort alphabetically
  const availableAbilities = allAbilities?.filter(
    (ability: Ability) => !AbilityManual.abilities.some((s: Ability) => s.abilityName === ability.abilityName)
  )?.sort((a, b) => a.abilityName.localeCompare(b.abilityName)) || [];

  return (
    <Container size="xl" py="xl">
      <Group mb="md">
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate('/AbilityManuals')}
          color={isDark ? 'gray.4' : 'dark.4'}
        >
          Back to AbilityManuals
        </Button>
      </Group>      <Group justify="space-between" mb="xl">
        <Stack gap={0}>
          <Title order={1} c={isDark ? 'gray.1' : 'dark.8'}>{AbilityManual.name}</Title>
          <Text size="lg" c={isDark ? 'gray.3' : 'dimmed'} fw={isDark ? 500 : 400}>Character: {AbilityManual.character}</Text>
        </Stack>
        <Group>
          <Button
            variant="outline"
            leftSection={<IconEdit size={16} />}
            onClick={openEditModal}
            color={isDark ? 'blue.4' : 'blue.6'}
          >
            Edit AbilityManual
          </Button>
          <AbilityManualExportButton AbilityManual={AbilityManual} label="Export AbilityManual" />
        </Group>
      </Group>      {AbilityManual.description && (
        <Text mb="xl" c={isDark ? 'white' : 'dark.7'} fw={isDark ? 500 : 400}>{AbilityManual.description}</Text>
      )}      <SafeTabs
        activeTab={activeTab}
        onTabChange={(value) => value && setActiveTab(value)}
        tabs={[
          {
            value: 'abilities',
            label: `AbilityManual Contents (${AbilityManual.abilities.length})`,
            leftSection: <IconSearch size={16} />,
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
            ) : (<SimpleGrid cols={{ base: 1, xs: 2, md: 3, lg: 4 }} spacing="md">
              {[...AbilityManual.abilities]
                .sort((a, b) => a.abilityName.localeCompare(b.abilityName)).map((ability) => (
                  <AbilityCard
                    key={`${ability.abilityName} (${ability.abilityDiscipline})`}
                    ability={ability}
                    onViewDetails={handleViewDetails}
                    onRemoveFromAbilityManual={handleRemoveAbility}
                    showRemoveButton
                  />
                ))}
            </SimpleGrid>
            )
          },
          {
            value: 'add-abilities',
            label: 'Add Abilities',
            leftSection: <IconPlus size={16} />,
            content: (
              <Stack gap="lg">                <AbilitiesFilter
                abilities={availableAbilities}
                onFilterChange={handleFilterChange}
              /><Text c={isDark ? 'white' : 'dark.7'} fw={isDark ? 500 : 400}>
                  {filteredAbilities.length} available {filteredAbilities.length === 1 ? 'ability' : 'abilities'}
                </Text>                <SimpleGrid cols={{ base: 1, xs: 2, md: 3, lg: 4 }} spacing="md">
                  {[...filteredAbilities]
                    .sort((a, b) => a.abilityName.localeCompare(b.abilityName))
                    .map((ability) => (
                      <AbilityCard
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
      />      <AbilityDetailsModal
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

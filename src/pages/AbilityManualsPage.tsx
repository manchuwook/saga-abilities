// filepath: x:\dev\saga-abilities\src\pages\AbilityManualsPage.tsx
import { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Card,
  Group,
  Button,
  SimpleGrid,
  Badge,
  Stack,
  ActionIcon,
  Tooltip,
  useMantineColorScheme
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import { IconEye, IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';
import { useAbilityManuals } from '../hooks/useAbilityManuals';
import { AbilityManual } from '../context/AbilityManualsContext';
import { NewAbilityManualModal } from '../components/NewAbilityManualModal';
import { EditAbilityManualModal } from '../components/EditAbilityManualModal';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';

export default function AbilityManualsPage() {
  const { AbilityManuals, deleteAbilityManual } = useAbilityManuals();
  const navigate = useNavigate();
  const [selectedAbilityManual, setSelectedAbilityManual] = useState<AbilityManual | null>(null);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const [newModalOpened, { open: openNewModal, close: closeNewModal }] = useDisclosure(false);
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);

  const handleEditAbilityManual = (AbilityManual: AbilityManual) => {
    setSelectedAbilityManual(AbilityManual);
    openEditModal();
  };

  const handleViewAbilityManual = (id: string) => {
    navigate(`/AbilityManuals/${id}`);
  };
  const handleDeleteAbilityManual = (AbilityManual: AbilityManual) => {
    modals.openConfirmModal({
      title: <Text c={isDark ? 'white' : 'dark.9'} fw={700}>Delete AbilityManual</Text>,
      children: (
        <Text size="sm" c={isDark ? 'gray.2' : 'dark.7'}>
          Are you sure you want to delete "{AbilityManual.name}" for {AbilityManual.character}?
          This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: isDark ? 'red.4' : 'red.6' },
      cancelProps: { color: isDark ? 'gray.4' : 'gray.6' },
      overlayProps: {
        backgroundOpacity: 0.65,
        blur: 3,
        color: isDark ? 'black' : '#e6d9c2',
      },
      styles: {
        header: {
          backgroundColor: isDark ? '#1A1B1E' : 'white',
          color: isDark ? 'white' : 'black',
          borderBottom: isDark ? '1px solid #2C2E33' : 'inherit',
        },
        content: {
          backgroundColor: isDark ? '#1A1B1E' : 'white',
        },
        body: {
          backgroundColor: isDark ? '#1A1B1E' : 'white',
        },
        close: {
          color: isDark ? 'white' : 'black',
        }
      },
      onConfirm: () => {
        deleteAbilityManual(AbilityManual.id);
        notifications.show({
          title: 'AbilityManual Deleted',
          message: `${AbilityManual.name} has been deleted`,
          color: 'red',
        });
      },
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={1} c={isDark ? 'gray.1' : 'dark.8'}>My AbilityManuals</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={openNewModal}
          color={isDark ? 'blue.4' : 'blue.6'}
        >
          New Ability Manual
        </Button>
      </Group>

      {AbilityManuals.length === 0 ? (
        <Card withBorder p="xl" ta="center" bg={isDark ? 'dark.6' : 'white'}>
          <Text size="lg" fw={500} mb="md" c={isDark ? 'gray.1' : 'dark.8'}>
            You don't have any Ability Manuals yet
          </Text>
          <Text mb="xl" c={isDark ? 'gray.3' : 'dark.6'}>
            Create your first AbilityManual to start collecting abilities for your character.
          </Text>
          <Button onClick={openNewModal} color={isDark ? 'blue.4' : 'blue.6'}>Create Ability Manual</Button>
        </Card>
      ) : (
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 3 }}
          spacing="md"
        >
          {AbilityManuals.map((AbilityManual) => (
            <Card
              key={AbilityManual.id}
              withBorder
              shadow="sm"
              padding="md"
              radius="md"
              bg={isDark ? 'dark.6' : 'white'}
              style={{
                borderColor: isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-3)'
              }}
            >
              <Stack gap="xs">
                <Group justify="space-between">
                  <Title order={3} c={isDark ? 'gray.1' : 'dark.8'}>{AbilityManual.name}</Title>
                  <Group gap={5}>
                    <Tooltip label="View AbilityManual">
                      <ActionIcon
                        variant="subtle"
                        color={isDark ? 'blue.4' : 'blue.6'}
                        onClick={() => handleViewAbilityManual(AbilityManual.id)}
                      >
                        <IconEye size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Edit Ability Manual">
                      <ActionIcon
                        variant="subtle"
                        color={isDark ? 'yellow.4' : 'yellow.6'}
                        onClick={() => handleEditAbilityManual(AbilityManual)}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Delete AbilityManual">
                      <ActionIcon
                        variant="subtle"
                        color={isDark ? 'red.4' : 'red.6'}
                        onClick={() => handleDeleteAbilityManual(AbilityManual)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Group>
                <Text fw={500} c={isDark ? 'gray.4' : 'gray.7'}>
                  Character: {AbilityManual.character}
                </Text>

                <Group>
                  <Badge color={isDark ? 'green.4' : 'green.6'}>
                    {AbilityManual.abilities.length} {AbilityManual.abilities.length === 1 ? 'spell' : 'abilities'}
                  </Badge>
                  <Text size="xs" c={isDark ? 'gray.5' : 'gray.6'}>
                    Updated: {formatDate(AbilityManual.updatedAt)}
                  </Text>
                </Group>

                {AbilityManual.description && (
                  <Text lineClamp={2} size="sm" c={isDark ? 'gray.3' : 'dark.7'}>
                    {AbilityManual.description}
                  </Text>
                )}

                <Button
                  variant="light"
                  fullWidth
                  onClick={() => handleViewAbilityManual(AbilityManual.id)}
                  mt="md"
                  color={isDark ? 'blue.4' : 'blue.6'}
                >
                  Open Ability Manual
                </Button>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      )}

      <NewAbilityManualModal
        opened={newModalOpened}
        onClose={closeNewModal}
      />

      <EditAbilityManualModal
        AbilityManual={selectedAbilityManual}
        opened={editModalOpened}
        onClose={closeEditModal}
      />
    </Container>
  );
}

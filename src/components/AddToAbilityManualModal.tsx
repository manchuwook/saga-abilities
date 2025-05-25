import { Button, Select, Text, useMantineColorScheme, Paper } from '@mantine/core';
import { useAbilityManuals } from '../hooks/useAbilityManuals';
import { Ability } from '../models/abilities.zod';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { useStyles } from '../hooks/useStyles';
import { SafeModal } from './common/SafeModal';

interface AddToAbilityManualModalProps {
  readonly ability: Ability | null;
  readonly opened: boolean;
  readonly onClose: () => void;
}

export function AddToAbilityManualModal({ ability, opened, onClose }: AddToAbilityManualModalProps) {
  const { AbilityManuals, addAbilityToAbilityManual } = useAbilityManuals();
  const [selectedAbilityManualId, setSelectedAbilityManualId] = useState<string | null>(null); const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const { inputStyles, modalStyles } = useStyles();

  // Handle adding ability to AbilityManual
  const handleAddToAbilityManual = (ability: Ability) => {
    if (!selectedAbilityManualId) return;

    addAbilityToAbilityManual(selectedAbilityManualId, ability);

    const AbilityManualName = AbilityManuals.find(sb => sb.id === selectedAbilityManualId)?.name;
    notifications.show({
      title: 'Ability Added',
      message: `${ability.abilityName} has been added to ${AbilityManualName}`,
      color: 'green',
    });

    setSelectedAbilityManualId(null);
    onClose();
  };

  // Handle modal closing
  const handleClose = () => {
    setSelectedAbilityManualId(null);
    onClose();
  };

  // Convert AbilityManuals to options for Select and sort alphabetically
  const AbilityManualOptions = AbilityManuals
    .map(sb => ({
      value: sb.id,
      label: `${sb.name} (${sb.character})`,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
  const renderModalContent = (ability: Ability) => {
    return (
      <Paper
        p="md"
        withBorder={false}
        bg={isDark ? 'dark.6' : 'gray.0'}
        style={{ height: '100%', margin: 0 }}
      >
        <Text mb="md" c={isDark ? 'gray.2' : 'dark.7'}>
          Add <strong>{ability.abilityName}</strong> to one of your Ability Manuals:
        </Text>

        <Select
          data={AbilityManualOptions}
          placeholder="Select a AbilityManual"
          value={selectedAbilityManualId}
          onChange={setSelectedAbilityManualId}
          clearable
          mb="md"
          styles={{
            input: inputStyles.input,
            dropdown: {
              backgroundColor: isDark ? 'var(--mantine-color-dark-5)' : 'white',
            }
          }}
        />

        <Button
          onClick={() => handleAddToAbilityManual(ability)}
          disabled={!selectedAbilityManualId}
          fullWidth
          color={isDark ? 'blue.4' : 'blue.6'}
          variant="filled"
          style={{
            marginBottom: '0.5rem'
          }}
        >
          Add to Ability Manual
        </Button>
      </Paper>
    );
  };
  // Define title component outside the render function
  const ModalTitle = (_ability: Ability) => (
    <Text c={isDark ? 'white' : 'dark.9'} fw={700} size="xl">Add to Ability Manual</Text>
  ); return (
    <SafeModal
      data={ability}
      opened={opened}
      onClose={handleClose}
      title={ModalTitle}
      size="md"
      overlayProps={modalStyles.overlayProps}
      styles={{
        header: modalStyles.header,
        content: modalStyles.content,
        close: modalStyles.close,
        body: {
          padding: 0,
          backgroundColor: isDark ? '#1A1B1E' : 'white',
        }
      }}
    >
      {renderModalContent}
    </SafeModal>
  );
}

import { Text, useMantineColorScheme } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useAbilityManuals } from '../hooks/useAbilityManuals';
import { AbilityManual } from '../context/AbilityManualsContext';
import { notifications } from '@mantine/notifications';
import { SafeModal } from './common/SafeModal';
import { useEffect, useCallback } from 'react';
import { AbilityManualForm, AbilityManualFormValues } from './common/AbilityManualForm';

interface EditAbilityManualModalProps {
  AbilityManual: AbilityManual | null;
  opened: boolean;
  onClose: () => void;
}

export function EditAbilityManualModal({ AbilityManual, opened, onClose }: EditAbilityManualModalProps) {
  const { updateAbilityManual } = useAbilityManuals();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const form = useForm<AbilityManualFormValues>({
    initialValues: {
      name: '',
      character: '',
      description: '',
    },
    validate: {
      name: (value) => (!value ? 'Ability Manual name is required' : null),
      character: (value) => (!value ? 'Character name is required' : null),
    },
  });

  // Update form values when AbilityManual changes
  useEffect(() => {
    if (AbilityManual && opened) {
      form.setValues({
        name: AbilityManual.name,
        character: AbilityManual.character,
        description: AbilityManual.description,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [AbilityManual, opened]);

  const handleClose = useCallback(() => {
    form.reset();
    onClose();
  }, [form, onClose]);

  const handleSubmit = useCallback(() => {
    if (!AbilityManual) return;
    const values = form.values;
    updateAbilityManual(AbilityManual.id, {
      name: values.name,
      character: values.character,
      description: values.description,
    });
    notifications.show({
      title: 'AbilityManual Updated',
      message: `${values.name} has been updated`,
      color: 'blue',
    });
    form.reset();
    onClose();
  }, [AbilityManual, form, onClose, updateAbilityManual]);

  return (
    <SafeModal
      data={AbilityManual}
      opened={opened}
      onClose={handleClose}
      title={() => <Text fw={700} c={isDark ? 'gray.1' : 'dark.8'}>Edit Ability Manual</Text>}
    >
      <AbilityManualForm
        form={form}
        onSubmit={handleSubmit}
        onCancel={handleClose}
        submitLabel="Save Changes"
      />
    </SafeModal>
  );
}

import { Text, useMantineColorScheme } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useAbilityManuals } from '../hooks/useAbilityManuals';
import { AbilityManual } from '../context/AbilityManualsContext';
import { notifications } from '@mantine/notifications';
import { SafeModal } from './common/SafeModal';
import { useEffect } from 'react';
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
      name: (value) => (!value ? 'AbilityManual name is required' : null),
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
  }, [AbilityManual, opened, form]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const renderModalContent = (AbilityManual: AbilityManual) => {
    const handleSubmit = () => {
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
    };

    return (
      <AbilityManualForm
        form={form}
        onSubmit={handleSubmit}
        onCancel={handleClose}
        submitLabel="Save Changes"
      />
    );
  };

  return (
    <SafeModal
      data={AbilityManual}
      opened={opened}
      onClose={handleClose}
      title={() => <Text fw={700} c={isDark ? 'gray.1' : 'dark.8'}>Edit AbilityManual</Text>}
    >
      {renderModalContent}
    </SafeModal>
  );
}

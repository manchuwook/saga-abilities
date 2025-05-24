import { Text, useMantineColorScheme } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useAbilityManuals } from '../hooks/useAbilityManuals';
import { notifications } from '@mantine/notifications';
import { useStyles } from '../hooks/useStyles';
import { AbilityManualForm, AbilityManualFormValues } from './common/AbilityManualForm';
import { Modal } from '@mantine/core';

interface NewAbilityManualModalProps {
  opened: boolean;
  onClose: () => void;
}

export function NewAbilityManualModal({ opened, onClose }: NewAbilityManualModalProps) {
  const { addAbilityManual } = useAbilityManuals();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const { modalStyles } = useStyles();

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

  const handleSubmit = () => {
    const values = form.values;

    addAbilityManual({
      name: values.name,
      character: values.character,
      description: values.description,
      abilities: [],
    });

    notifications.show({
      title: 'AbilityManual Created',
      message: `${values.name} has been created for ${values.character}`,
      color: 'green',
    });

    form.reset();
    onClose();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={<Text c={isDark ? 'white' : 'dark.9'} fw={700} size="xl">Create New AbilityManual</Text>}
      size="md"
      overlayProps={modalStyles.overlayProps}
      styles={{
        header: modalStyles.header,
        content: modalStyles.content,
        close: modalStyles.close,
        body: {
          padding: 0,
        }
      }}
    >
      <AbilityManualForm
        form={form}
        onSubmit={handleSubmit}
        onCancel={handleClose}
        submitLabel="Create Ability Manual"
        usePaper
      />
    </Modal>
  );
}

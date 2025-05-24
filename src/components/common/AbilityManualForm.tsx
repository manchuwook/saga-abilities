import { TextInput, Textarea, Button, Group, useMantineColorScheme, Text, Stack, Paper } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';

export interface AbilityManualFormValues {
  name: string;
  character: string;
  description: string;
}

interface AbilityManualFormProps {
  form: UseFormReturnType<AbilityManualFormValues>;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
  usePaper?: boolean;
}

export function AbilityManualForm({ form, onSubmit, onCancel, submitLabel, usePaper = false }: AbilityManualFormProps) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const formContent = (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap="md">
        <TextInput
          label={<Text fw={600} size="sm" c={isDark ? 'gray.2' : 'dark.9'}>AbilityManual Name</Text>}
          placeholder="My Wizard's AbilityManual"
          {...form.getInputProps('name')}
          styles={{
            input: {
              backgroundColor: isDark ? 'var(--mantine-color-dark-5)' : 'white',
              borderColor: isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-4)',
            }
          }}
        />

        <TextInput
          label={<Text fw={600} size="sm" c={isDark ? 'gray.2' : 'dark.9'}>Character Name</Text>}
          placeholder="Gandalf the Grey"
          {...form.getInputProps('character')}
          styles={{
            input: {
              backgroundColor: isDark ? 'var(--mantine-color-dark-5)' : 'white',
              borderColor: isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-4)',
            }
          }}
        />

        <Textarea
          label={<Text fw={600} size="sm" c={isDark ? 'gray.2' : 'dark.9'}>Description (Optional)</Text>}
          placeholder="A brief description of this Ability Manual..."
          {...form.getInputProps('description')}
          autosize
          minRows={3}
          maxRows={5}
          styles={{
            input: {
              backgroundColor: isDark ? 'var(--mantine-color-dark-5)' : 'white',
              borderColor: isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-4)',
            }
          }}
        />

        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={onCancel} color={isDark ? 'gray.4' : 'gray.6'}>
            Cancel
          </Button>
          <Button type="submit" color={isDark ? 'blue.4' : 'blue.6'}>
            {submitLabel}
          </Button>
        </Group>
      </Stack>
    </form>
  );

  if (usePaper) {
    return (
      <Paper p="md" withBorder={false} bg={isDark ? 'dark.6' : 'gray.0'}>
        {formContent}
      </Paper>
    );
  }

  return formContent;
}

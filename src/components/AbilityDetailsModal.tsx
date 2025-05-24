import { Text, Grid, Badge, Group, Stack, useMantineColorScheme } from '@mantine/core';
import { Ability } from '../models/abilities.zod';
import { useStyles } from '../hooks/useStyles';
import { SafeModal } from './common/SafeModal';

interface AbilityDetailsModalProps {
  ability: Ability | null;
  opened: boolean;
  onClose: () => void;
}

export function AbilityDetailsModal({ ability, opened, onClose }: AbilityDetailsModalProps) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const { textStyles } = useStyles();  // Using textStyles directly from StyleService - font scale is already integrated
  const renderAbilityDetails = (ability: Ability) => {
    return (
      <Stack gap="md">
        <Group>
          <Badge color="blue" size="lg">{ability.abilityLevel}</Badge>
          <Badge color="teal" size="lg">{ability.abilityDiscipline}</Badge>
          <Badge color="violet" size="lg">{ability.abilityType}</Badge>
        </Group>

        <Grid>
          <Grid.Col span={6}>
            <Text fw={700} style={textStyles} c={isDark ? 'gray.3' : 'dark.9'}>CP Cost:</Text>
            <Text style={textStyles} c={isDark ? 'white' : 'dark.8'}>{ability.abilityCp}</Text>
          </Grid.Col>
        </Grid>

        <Stack gap="xs">
          <Text fw={700} c={isDark ? 'gray.3' : 'dark.9'}>Description:</Text>
          <Text style={{ whiteSpace: 'pre-wrap' }} c={isDark ? 'white' : 'dark.8'}>{ability.abilityDescription}</Text>
        </Stack>
      </Stack>
    );
  };
  return (
    <SafeModal
      data={ability}
      opened={opened}
      onClose={onClose}
      title={(ability) => <Text c={isDark ? 'white' : 'dark.9'} fw={700} size="xl">{ability.abilityName}</Text>}
      size="lg"
    >
      {renderAbilityDetails}
    </SafeModal>
  );
}

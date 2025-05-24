// filepath: x:\dev\saga-abilities\src\components\AbilityCard.tsx
import { Card, Text, Badge, Group, ActionIcon, Tooltip, Stack, Box, useMantineColorScheme } from '@mantine/core';
import { IconEye, IconBooks, IconX, IconTags } from '@tabler/icons-react';
import { Ability } from '../models/abilities.zod';
import { useTheme } from '../context/ThemeContext';
import { useAbilityTags, ProcessedAbilityTag } from '../hooks/useAbilityTags';
import { useMemo } from 'react';

interface AbilityCardProps {
    readonly ability: Ability;
    readonly onViewDetails: (ability: Ability) => void;
    readonly onAddToAbilityManual?: (ability: Ability) => void;
    readonly onRemoveFromAbilityManual?: (abilityName: string) => void;
    readonly showRemoveButton?: boolean;
}

export function AbilityCard({
    ability,
    onViewDetails,
    onAddToAbilityManual,
    onRemoveFromAbilityManual,
    showRemoveButton = false,
}: AbilityCardProps) {
    const { colors } = useTheme();
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === 'dark';
    const { data: abilityTagsData } = useAbilityTags();

    // Find all tags that include this ability
    const abilityTags = useMemo(() => {
        if (!abilityTagsData?.tags) return [];

        return abilityTagsData.tags
            .filter(tag => tag.abilities?.includes(ability.abilityName))
            .slice(0, 3); // Limit to first 3 tags to save space
    }, [ability.abilityName, abilityTagsData?.tags]);

    // Generate card styles based on theme
    const cardStyles = {
        borderRadius: `${colors.borderRadius}px`,
        fontSize: `${colors.fontScale}rem`,
        border: `1px solid ${isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-3)'}`,
    };

    return (
        <Card
            withBorder
            shadow="sm"
            padding="md"
            radius="md"
            style={cardStyles}
            bg={isDark ? 'dark.6' : 'white'}
        >
            <Card.Section withBorder inheritPadding py="xs" bg={isDark ? 'dark.7' : colors.primaryColor}>
                <Group justify="space-between">
                    <Text fw={700} c="white">{ability.abilityName}</Text>
                    <Group gap={5}>
                        <Tooltip label="View Details">
                            <ActionIcon
                                variant="subtle"
                                color={isDark ? 'blue.4' : 'blue.6'}
                                onClick={() => onViewDetails(ability)}
                            >
                                <IconEye size={16} />
                            </ActionIcon>
                        </Tooltip>

                        {onAddToAbilityManual && (
                            <Tooltip label="Add to Ability Manual">
                                <ActionIcon
                                    variant="subtle"
                                    color={isDark ? 'green.4' : 'green.6'}
                                    onClick={() => onAddToAbilityManual(ability)}
                                >
                                    <IconBooks size={16} />
                                </ActionIcon>
                            </Tooltip>
                        )}
                        {showRemoveButton && onRemoveFromAbilityManual && (
                            <Tooltip label="Remove from Ability Manual">
                                <ActionIcon
                                    variant="subtle"
                                    color={isDark ? 'red.4' : 'red.6'}
                                    onClick={() => onRemoveFromAbilityManual(ability.abilityName)}
                                >
                                    <IconX size={16} />
                                </ActionIcon>
                            </Tooltip>
                        )}
                    </Group>
                </Group>
            </Card.Section>
            <Stack mt="md" gap="xs">
                <Group gap="xs">
                    <Badge color={isDark ? 'blue.4' : 'blue.6'} size="sm">{ability.abilityLevel}</Badge>
                    <Badge color={isDark ? 'teal.4' : 'teal.6'} size="sm">{ability.abilityDiscipline}</Badge>
                </Group>

                <Box>
                    <Group gap="md">
                        <Text size="sm" fw={500} c={isDark ? 'gray.3' : 'dark.8'}>CP: {ability.abilityCp}</Text>
                        <Text size="sm" fw={500} c={isDark ? 'gray.3' : 'dark.8'}>Type: {ability.abilityType}</Text>
                    </Group>

                    {abilityTags.length > 0 && (
                        <Group gap="xs" mt="xs">
                            <IconTags size={14} color={isDark ? 'var(--mantine-color-gray-4)' : 'var(--mantine-color-gray-7)'} />
                            {abilityTags.map((tag: ProcessedAbilityTag) => (
                                <Badge
                                    key={tag.tag}
                                    color={isDark ? 'grape.4' : 'grape.6'}
                                    size="xs"
                                    variant="light"
                                >
                                    {tag.name}
                                </Badge>
                            ))}
                        </Group>
                    )}

                    <Box pt="0.5rem">
                        <Text size="sm" fw={500} lineClamp={8} c={isDark ? 'gray.1' : 'dark.9'}>
                            {ability.abilityDescription}
                        </Text>
                    </Box>
                </Box>
            </Stack>
        </Card>
    );
}

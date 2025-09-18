import { useState, useMemo } from 'react';
import {
    Paper,
    Text,
    Accordion,
    Badge,
    Group,
    Stack,
    Select,
    useMantineColorScheme,
    Divider
} from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { Ability } from '../models/abilities.zod';
import { useAbilityGrouping } from '../hooks/useAbilityGrouping';
import { AbilityCard } from './AbilityCard';
import { AbilitiesFilter } from './AbilitiesFilter';

export interface AbilityGroupViewProps {
    /** Array of abilities to display */
    abilities: Ability[];
    /** All abilities for filtering (if not provided, no filter will be shown) */
    allAbilities?: Ability[];
    /** Callback when filtered abilities change */
    onFilterChange?: (abilities: Ability[]) => void;
    /** Callback when an ability is selected for details */
    onViewDetails?: (ability: Ability) => void;
    /** Callback when an ability is added to a manual */
    onAddToAbilityManual?: (ability: Ability) => void;
    /** Callback when an ability is removed from a manual */
    onRemoveFromAbilityManual?: (abilityName: string) => void;
    /** Whether to show remove buttons instead of add buttons */
    showRemoveButton?: boolean;
}type GroupingType = 'discipline' | 'level' | 'type' | 'nested' | 'type-discipline';

/**
 * Component for displaying abilities grouped by different criteria
 */
export function AbilityGroupView({
    abilities,
    allAbilities,
    onFilterChange,
    onViewDetails,
    onAddToAbilityManual,
    onRemoveFromAbilityManual,
    showRemoveButton = false
}: AbilityGroupViewProps) {
    const [groupingType, setGroupingType] = useState<GroupingType>('discipline');

    // Memoize displayed abilities to prevent unnecessary re-renders
    const displayAbilities = useMemo(() => abilities, [abilities]);

    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === 'dark';

    // Handle filter changes
    const handleFilterChange = (filtered: Ability[]) => {
        if (onFilterChange) {
            onFilterChange(filtered);
        }
    };

    const {
        byDiscipline,
        byLevel,
        byType,
        byDisciplineLevelType,
        byTypeDiscipline,
        uniqueDisciplines,
        uniqueLevels,
        uniqueTypes
    } = useAbilityGrouping(displayAbilities);

    const groupingOptions = [
        { value: 'discipline', label: 'Discipline' },
        { value: 'level', label: 'Level' },
        { value: 'type', label: 'Type' },
        { value: 'type-discipline', label: 'Type + Discipline' },
        { value: 'nested', label: 'Discipline + Level + Type' }
    ];

    const renderAbilityList = (abilitiesList: Ability[], groupKey: string) => (
        <Stack gap="xs">
            {abilitiesList.map((ability, index) => (
                <AbilityCard
                    key={`${ability.abilityName}-${ability.abilityDiscipline}-${ability.abilityLevel}-${groupKey}-${index}`}
                    ability={ability}
                    onViewDetails={onViewDetails || (() => { })}
                    onAddToAbilityManual={onAddToAbilityManual}
                    onRemoveFromAbilityManual={onRemoveFromAbilityManual}
                    showRemoveButton={showRemoveButton}
                />
            ))}
        </Stack>
    );

    const renderSimpleGrouping = (groupedData: { [key: string]: Ability[] }, groupKeys: string[]) => (
        <Accordion
            multiple
            defaultValue={groupKeys.slice(0, 3)} // Open first 3 groups by default
            chevron={<IconChevronDown size={16} />}
        >
            {groupKeys.map((groupKey) => (
                <Accordion.Item key={groupKey} value={groupKey}>
                    <Accordion.Control>
                        <Group justify="space-between" pr="md">
                            <Text fw={500} c={isDark ? 'white' : 'dark.8'}>
                                {groupKey.replace(/_/g, ' ')}
                            </Text>
                            <Badge color={isDark ? 'blue.4' : 'blue.6'} size="sm">
                                {groupedData[groupKey]?.length || 0}
                            </Badge>
                        </Group>
                    </Accordion.Control>
                    <Accordion.Panel>
                        {groupedData[groupKey] && renderAbilityList(groupedData[groupKey], groupKey)}
                    </Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion>
    );

    const renderNestedGrouping = () => (
        <Accordion
            multiple
            defaultValue={uniqueDisciplines.slice(0, 2)} // Open first 2 disciplines by default
            chevron={<IconChevronDown size={16} />}
        >
            {uniqueDisciplines.map((discipline) => (
                <Accordion.Item key={discipline} value={discipline}>
                    <Accordion.Control>
                        <Group justify="space-between" pr="md">
                            <Text fw={500} c={isDark ? 'white' : 'dark.8'}>
                                {discipline.replace(/_/g, ' ')}
                            </Text>
                            <Badge color={isDark ? 'blue.4' : 'blue.6'} size="sm">
                                {Object.values(byDisciplineLevelType[discipline] || {})
                                    .flatMap(levelData => Object.values(levelData))
                                    .flatMap(abilities => abilities).length}
                            </Badge>
                        </Group>
                    </Accordion.Control>
                    <Accordion.Panel>
                        {byDisciplineLevelType[discipline] && (
                            <Stack gap="md">
                                {uniqueLevels.map((level) => {
                                    if (!byDisciplineLevelType[discipline][level]) return null;

                                    const levelData = byDisciplineLevelType[discipline][level];
                                    const levelAbilityCount = Object.values(levelData).flatMap(abilities => abilities).length;

                                    return (
                                        <div key={`${discipline}-${level}`}>
                                            <Group justify="space-between" mb="xs">
                                                <Text size="sm" fw={500} c={isDark ? 'gray.3' : 'gray.7'}>
                                                    {level}
                                                </Text>
                                                <Badge color={isDark ? 'gray.5' : 'gray.6'} size="xs">
                                                    {levelAbilityCount}
                                                </Badge>
                                            </Group>

                                            <Accordion
                                                multiple
                                                defaultValue={Object.keys(levelData)} // Open all types by default
                                                variant="contained"
                                                chevron={<IconChevronDown size={14} />}
                                            >
                                                {Object.entries(levelData).map(([type, abilities]) => (
                                                    <Accordion.Item key={`${discipline}-${level}-${type}`} value={type}>
                                                        <Accordion.Control py="xs">
                                                            <Group justify="space-between" pr="md">
                                                                <Text size="xs" c={isDark ? 'gray.4' : 'gray.6'}>
                                                                    {type}
                                                                </Text>
                                                                <Badge color={isDark ? 'gray.6' : 'gray.4'} size="xs">
                                                                    {abilities.length}
                                                                </Badge>
                                                            </Group>
                                                        </Accordion.Control>
                                                        <Accordion.Panel>
                                                            {renderAbilityList(abilities, `${discipline}-${level}-${type}`)}
                                                        </Accordion.Panel>
                                                    </Accordion.Item>
                                                ))}
                                            </Accordion>

                                            {level !== uniqueLevels[uniqueLevels.length - 1] && <Divider my="sm" />}
                                        </div>
                                    );
                                })}
                            </Stack>
                        )}
                    </Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion>
    );

    const renderTypeDisciplineGrouping = () => (
        <Accordion
            multiple
            defaultValue={uniqueTypes.slice(0, 3)} // Open first 3 types by default
            chevron={<IconChevronDown size={16} />}
        >
            {uniqueTypes.map((type) => (
                <Accordion.Item key={type} value={type}>
                    <Accordion.Control>
                        <Group justify="space-between" pr="md">
                            <Text fw={500} c={isDark ? 'white' : 'dark.8'}>
                                {type.replace(/_/g, ' ')}
                            </Text>
                            <Badge color={isDark ? 'blue.4' : 'blue.6'} size="sm">
                                {Object.values(byTypeDiscipline[type] || {})
                                    .flatMap(abilities => abilities).length}
                            </Badge>
                        </Group>
                    </Accordion.Control>
                    <Accordion.Panel>
                        {byTypeDiscipline[type] && (
                            <Stack gap="md">
                                {uniqueDisciplines.map((discipline) => {
                                    if (!byTypeDiscipline[type][discipline]) return null;

                                    const disciplineAbilities = byTypeDiscipline[type][discipline];

                                    return (
                                        <div key={`${type}-${discipline}`}>
                                            <Group justify="space-between" mb="xs">
                                                <Text size="sm" fw={500} c={isDark ? 'gray.3' : 'gray.7'}>
                                                    {discipline}
                                                </Text>
                                                <Badge color={isDark ? 'gray.5' : 'gray.6'} size="xs">
                                                    {disciplineAbilities.length}
                                                </Badge>
                                            </Group>
                                            {renderAbilityList(disciplineAbilities, `${type}-${discipline}`)}
                                            {discipline !== uniqueDisciplines[uniqueDisciplines.length - 1] && <Divider my="sm" />}
                                        </div>
                                    );
                                })}
                            </Stack>
                        )}
                    </Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion>
    );

    const renderGroupedAbilities = () => {
        switch (groupingType) {
            case 'discipline':
                return renderSimpleGrouping(byDiscipline, uniqueDisciplines);
            case 'level':
                return renderSimpleGrouping(byLevel, uniqueLevels);
            case 'type':
                return renderSimpleGrouping(byType, uniqueTypes);
            case 'type-discipline':
                return renderTypeDisciplineGrouping();
            case 'nested':
                return renderNestedGrouping();
            default:
                return null;
        }
    };

    return (
        <Stack gap="lg">
            {allAbilities && (
                <AbilitiesFilter
                    abilities={allAbilities}
                    onFilterChange={handleFilterChange}
                />
            )}

            <Paper p="md" withBorder radius="md" bg={isDark ? 'dark.6' : 'white'}>
                <Stack gap="md">
                    <Group justify="space-between" align="center">
                        <Text size="sm" c={isDark ? 'gray.3' : 'gray.6'}>
                            {displayAbilities.length} {displayAbilities.length === 1 ? 'ability' : 'abilities'} found
                        </Text>

                        <Group gap="xs" align="center">
                            <Text size="sm" c={isDark ? 'gray.4' : 'gray.6'} fw={500}>
                                Group by:
                            </Text>
                            <Select
                                data={groupingOptions}
                                value={groupingType}
                                onChange={(value) => setGroupingType(value as GroupingType)}
                                placeholder="Select grouping"
                                w={180}
                                size="sm"
                                variant="filled"
                            />
                        </Group>
                    </Group>
                    {renderGroupedAbilities()}
                </Stack>
            </Paper>
        </Stack>
    );
}

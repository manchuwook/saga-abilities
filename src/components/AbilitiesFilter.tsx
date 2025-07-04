// filepath: x:\dev\saga-abilities\src\components\AbilitiesFilter.tsx
import { useEffect, useState, useMemo } from 'react';
import {
  TextInput,
  MultiSelect,
  Group,
  Stack,
  Button,
  Accordion,
  Paper,
  useMantineColorScheme,
  Select
} from '@mantine/core';
import { IconSearch, IconFilter, IconX, IconTags, IconCoin, IconStairs } from '@tabler/icons-react';
import { Ability } from '../models/abilities.zod';
import { useTheme } from '../context/ThemeContext';
import { useAbilityTags } from '../hooks/useAbilityTags';

interface AbilitiesFilterProps {
  readonly abilities: Ability[];
  readonly onFilterChange: (filteredAbilities: Ability[]) => void;
}

export function AbilitiesFilter({ abilities, onFilterChange }: AbilitiesFilterProps) {
  const [searchText, setSearchText] = useState('');
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [complexityRange, setComplexityRange] = useState<[number, number]>([0, 10]);
  const [selectedCpCost, setSelectedCpCost] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const { colorScheme } = useMantineColorScheme();
  const { colors } = useTheme();
  const isDark = colorScheme === 'dark';
  const { data: AbilityTagsData, isLoading: isLoadingTags } = useAbilityTags();
  // Extract unique values for filter dropdowns and memoize to prevent infinite re-renders
  const disciplineData = useMemo(() => {
    const uniqueDisciplines = [...new Set(abilities.map(Ability => Ability.abilityDiscipline))].sort((a, b) =>
      a.localeCompare(b)
    );
    return uniqueDisciplines.map(c => ({ value: c, label: c }));
  }, [abilities]);

  // Flatten tags: no grouping, just a flat array for MultiSelect
  const tagCategories = useMemo(() => {
    if (!AbilityTagsData?.tags || AbilityTagsData.tags.length === 0) return [];
    return AbilityTagsData.tags
      .filter(tag => tag.abilities && tag.abilities.length > 0)
      .map(tag => ({
        value: tag.tag,
        label: `${tag.name} (${tag.abilities.length})`,
        description: tag.description
      }));
  }, [AbilityTagsData]);

  // Apply filters
  useEffect(() => {
    // Only run the filter if we have abilities
    if (abilities.length === 0) {
      onFilterChange([]);
      return;
    }

    const filtered = abilities.filter(Ability => {
      // Text search
      const textMatch = searchText === '' ||
        Ability.abilityName?.toLowerCase().includes(searchText.toLowerCase()) ||
        Ability.abilityDescription?.toLowerCase().includes(searchText.toLowerCase());

      // Discipline filter
      const disciplineMatch = selectedDisciplines.length === 0 ||
        selectedDisciplines.includes(Ability.abilityDiscipline);

      // Tag filter
      const tagMatch = selectedTags.length === 0 ||
        (AbilityTagsData?.tags.some(tag =>
          selectedTags.includes(tag.tag) &&
          tag.abilities?.includes(Ability.abilityName)
        ) ?? false);

      // CP Cost filter
      let cpMatch = true;
      if (selectedCpCost) {
        const [minCp, maxCp] = selectedCpCost.split('-');
        const min = parseInt(minCp, 10);
        const max = maxCp === '+' ? Infinity : parseInt(maxCp, 10);
        cpMatch = Ability.abilityCp >= min && Ability.abilityCp <= max;
      }

      // Ability Level filter
      const levelMatch = !selectedLevel || Ability.abilityLevel === selectedLevel;

      return textMatch && disciplineMatch && tagMatch && cpMatch && levelMatch;
    }); onFilterChange(filtered);
  }, [searchText, selectedDisciplines, complexityRange, selectedTags, selectedCpCost, selectedLevel, AbilityTagsData, abilities, onFilterChange]);
  const resetFilters = () => {
    setSearchText('');
    setSelectedDisciplines([]);
    setSelectedTags([]);
    setComplexityRange([0, 10]);
    setSelectedCpCost(null);
    setSelectedLevel(null);
  };

  return (
    <Paper p="md" radius={colors.borderRadius} bg={isDark ? 'dark.6' : 'white'} withBorder>
      <Stack gap="md">
        <TextInput
          placeholder="Search abilities by name or description"
          value={searchText}
          onChange={(e) => setSearchText(e.currentTarget.value)}
          leftSection={<IconSearch size={16} />}
          rightSection={
            searchText ? (
              <IconX
                size={16}
                style={{ cursor: 'pointer' }}
                onClick={() => setSearchText('')}
              />
            ) : null
          }
          styles={{
            input: {
              backgroundColor: isDark ? 'var(--mantine-color-dark-5)' : 'white',
              borderColor: isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-4)',
            }
          }}
        />

        <Accordion
          variant={isDark ? "filled" : "default"}
          styles={{
            item: {
              borderColor: isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-3)',
            },
            control: {
              backgroundColor: isDark ? 'var(--mantine-color-dark-5)' : 'white',
            },
            panel: {
              backgroundColor: isDark ? 'var(--mantine-color-dark-6)' : 'white',
            }
          }}
        >
          <Accordion.Item value="advanced-filters">
            <Accordion.Control icon={<IconFilter size={16} />}>
              Advanced Filters
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="md">
                <MultiSelect
                  label="Discipline"
                  placeholder="Filter by discipline"
                  data={disciplineData}
                  value={selectedDisciplines}
                  onChange={setSelectedDisciplines}
                  clearable
                  style={{ flex: 1 }}
                  styles={{
                    input: {
                      backgroundColor: isDark ? 'var(--mantine-color-dark-5)' : 'white',
                      borderColor: isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-4)',
                    }
                  }}
                />

                <MultiSelect
                  label="Tags"
                  placeholder="Filter by tags"
                  leftSection={<IconTags size={16} />}
                  data={tagCategories}
                  value={selectedTags}
                  onChange={setSelectedTags}
                  clearable
                  searchable
                  maxDropdownHeight={280}
                  disabled={isLoadingTags}
                  styles={{
                    input: {
                      backgroundColor: isDark ? 'var(--mantine-color-dark-5)' : 'white',
                      borderColor: isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-4)',
                    }
                  }}
                />                <Select
                  label="CP Cost"
                  placeholder="Filter by CP cost"
                  leftSection={<IconCoin size={16} />}
                  data={[
                    { value: '4-4', label: '4 CP' },
                    { value: '8-8', label: '8 CP' },
                    { value: '16-16', label: '16 CP' },
                    { value: '4-8', label: '4-8 CP' },
                    { value: '8-16', label: '8-16 CP' },
                    { value: '16-+', label: '16+ CP' },
                  ]}
                  value={selectedCpCost}
                  onChange={setSelectedCpCost}
                  clearable
                  styles={{
                    input: {
                      backgroundColor: isDark ? 'var(--mantine-color-dark-5)' : 'white',
                      borderColor: isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-4)',
                    }
                  }}
                />                <Select
                  label="Ability Level"
                  placeholder="Filter by ability level"
                  leftSection={<IconStairs size={16} />}
                  data={[
                    { value: 'Basic', label: 'Basic' },
                    { value: 'Intermediate', label: 'Intermediate' },
                    { value: 'Advanced', label: 'Advanced' },
                  ]}
                  value={selectedLevel}
                  onChange={setSelectedLevel}
                  clearable
                  styles={{
                    input: {
                      backgroundColor: isDark ? 'var(--mantine-color-dark-5)' : 'white',
                      borderColor: isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-4)',
                    }
                  }}
                />

                <Group justify="flex-end">
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    color={isDark ? 'blue.4' : 'blue.6'}
                  >
                    Reset Filters
                  </Button>
                </Group>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Stack>
    </Paper>
  );
}

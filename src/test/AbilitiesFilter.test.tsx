import { describe, it, vi, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AbilitiesFilter } from '../components/AbilitiesFilter';
import { Ability } from '../models/abilities.zod';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';

// Mock required components and hooks
vi.mock('../hooks/useAbilityTags', () => ({
  useAbilityTags: () => ({
    data: {
      tags: [
        { tag: 'offensive', name: 'Offensive', abilities: ['spell1'] },
        { tag: 'defensive', name: 'Defensive', abilities: ['spell2'] },
        { tag: 'fire', name: 'Fire', abilities: ['spell1'] },
        { tag: 'water', name: 'Water', abilities: ['spell3'] },
        { tag: 'healing', name: 'Healing', abilities: ['spell4'] }
      ]
    },
    isLoading: false
  })
}));

// Mock context
vi.mock('../context/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      accent: '#4c6ef5',
      background: '#ffffff',
      text: '#333333',
    }
  })
}));

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MantineProvider defaultColorScheme="light">
        {ui}
      </MantineProvider>
    </QueryClientProvider>
  );
};

describe('AbilitiesFilter', () => {
  const mockAbilities: Ability[] = [
    {
      abilityName: 'Fireball',
      abilityCp: 3,
      abilityDiscipline: 'Elementalism',
      abilityLevel: 'Intermediate',
      abilityType: 'Offensive',
      abilityDescription: 'A ball of fire that deals damage to enemies'
    },
    {
      abilityName: 'Healing Touch',
      abilityCp: 2,
      abilityDiscipline: 'Animism',
      abilityLevel: 'Basic',
      abilityType: 'Healing',
      abilityDescription: 'A healing ability that restores health'
    }
  ];

  const mockOnFilterChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderWithProviders(<AbilitiesFilter abilities={mockAbilities} onFilterChange={mockOnFilterChange} />);
    expect(screen.getByText('Advanced Filters')).toBeInTheDocument();
  });

  // Additional tests can be added here as needed
});
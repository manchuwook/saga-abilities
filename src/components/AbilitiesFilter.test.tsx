import { describe, it, vi, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AbilitiesFilter } from './AbilitiesFilter';
import { Spell } from '../models/abilities.zod';
import { MantineProvider } from '@mantine/core';
import '@testing-library/jest-dom';

// Mock required components and hooks
vi.mock('../hooks/useSpellTags', () => ({
  useSpellTags: () => ({
    data: {
      tags: [
        { tag: 'offensive', name: 'Offensive', matches: ['spell1'] },
        { tag: 'defensive', name: 'Defensive', matches: ['spell2'] },
        { tag: 'fire', name: 'Fire', matches: ['spell1'] },
        { tag: 'water', name: 'Water', matches: ['spell3'] },
        { tag: 'healing', name: 'Healing', matches: ['spell4'] }
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
  return render(
    <MantineProvider defaultColorScheme="light">
      {ui}
    </MantineProvider>
  );
};

describe('AbilitiesFilter', () => {
  const mockAbilities: Spell[] = [
    {
      spellName: 'Fireball',
      spellClass: 'Wizard',
      school: 'Evocation',
      complexity: 3,
      description: 'A ball of fire',
      keywords: 'offensive, fire, damage',
      range: '120 feet',
      duration: 'Instantaneous',
      action: '1 action',
      target: 'Area',
      check: 'None',
      flare: 2,
      focus: 'Arcane',
      skill: 'None',
      spellType: 'Offensive',
      altDescription: null
    },
    {
      spellName: 'Healing Word',
      spellClass: 'Cleric',
      school: 'Healing',
      complexity: 2,
      description: 'A healing spell',
      keywords: 'healing, restoration',
      range: '60 feet',
      duration: 'Instantaneous',
      action: '1 bonus action',
      target: 'Single creature',
      check: 'None',
      flare: 1,
      focus: 'Divine',
      skill: 'None',
      spellType: 'Healing',
      altDescription: null
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
import { useQuery } from '@tanstack/react-query';
import { validateAbilities, type Ability } from '../models/abilities.zod';

async function fetchAbilities(): Promise<Ability[]> {
  const response = await fetch('/abilities.json');
  if (!response.ok) {
    throw new Error('Failed to fetch abilities');
  }

  const data = await response.json();
  const validatedAbilities = validateAbilities(data);
  // Sort abilities alphabetically by name
  return validatedAbilities.sort((a, b) => a.abilityName.localeCompare(b.abilityName));
}

export function useAbilities() {
  return useQuery({
    queryKey: ['abilities'],
    queryFn: fetchAbilities,
  });
}

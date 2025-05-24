import { useContext } from 'react';
import { AbilityManualsContext } from '../context/AbilityManualsContext';

export function useAbilityManuals() {
  const context = useContext(AbilityManualsContext);
  
  if (context === undefined) {
    throw new Error('useAbilityManuals must be used within a AbilityManualsProvider');
  }
  
  return context;
}

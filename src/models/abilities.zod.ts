import { z } from 'zod';

/**
 * Schema for ability disciplines in the Saga system
 */
export const DisciplineSchema = z.enum([
  'Ambidexterity',
  'Animism',
  'Balanced_Sword',
  'Beast_Tamer',
  'Bearskin_Warrior',
  'Black_Powder_Weapons',
  'Bows',
  'Brute',
  'Challenger',
  'Crossbows',
  'Daunt',
  'Deception',
  'Eldritch',
  'Elementalism',
  'Field_Commander',
  'Flexible_Weapons',
  'Footwork',
  'Hekikaria',
  'Hurling',
  'Inner_Pillar',
  'Insight',
  'Leadership',
  'Lictor',
  'Light_Blades',
  'Magus',
  'Melee_Defense',
  'Melee_Form',
  'Mounted_Combat',
  'Opportunist',
  'Oratory',
  'Pugilism',
  'Sahari',
  'Selifren_Song',
  'Sentinel',
  'Shield_Use',
  'Sleuth',
  'Sneak',
  'Sorcery',
  'Spears',
  'Sprinting',
  'Staves',
  'Strategist',
  'Theurgy',
  'Trickery',
  'Tumbling',
  'Unbalanced_Sword',
  'Vale_Lord',
  'Weighted_Weapons',
  'Wrestling',
  'Wud',
]);

/**
 * Schema for ability levels
 */
export const AbilityLevelSchema = z.enum([
  'Basic',
  'Intermediate',
  'Advanced',
]);

/**
 * Schema for ability types
 */
export const AbilityTypeSchema = z.string();

/**
 * Schema for a single ability
 */
export const AbilitySchema = z.object({
  abilityName: z.string(),
  abilityCp: z.number().int().positive(),
  abilityDiscipline: DisciplineSchema,
  abilityLevel: AbilityLevelSchema,
  abilityType: AbilityTypeSchema,
  abilityDescription: z.string(),
  // Optional complexity reductions
  complexityAeromancy: z.number().optional(),
  complexityAlchemy: z.number().optional(),
  complexityCharms: z.number().optional(),
  complexityCircles: z.number().optional(),
  complexityConjuration: z.number().optional(),
  complexityCurses: z.number().optional(),
  complexityDemonology: z.number().optional(),
  complexityDreaming: z.number().optional(),
  complexityGeomancy: z.number().optional(),
  complexityGlamours: z.number().optional(),
  complexityHydromancy: z.number().optional(),
  complexityNecromancy: z.number().optional(),
  complexityPhytomancy: z.number().optional(),
  complexityPsychomancy: z.number().optional(),
  complexityPyromancy: z.number().optional(),
  complexitySeals: z.number().optional(),
  complexitySigils: z.number().optional(),
  complexityTelekinesis: z.number().optional(),
  complexityWards: z.number().optional(),
  complexityZoomancy: z.number().optional(),
});

/**
 * Schema for the entire abilities array
 */
export const AbilitiesSchema = z.array(AbilitySchema);

/**
 * Type definitions derived from the schemas
 */
export type Discipline = z.infer<typeof DisciplineSchema>;
export type AbilityLevel = z.infer<typeof AbilityLevelSchema>;
export type Ability = z.infer<typeof AbilitySchema>;
export type Abilities = z.infer<typeof AbilitiesSchema>;

/**
 * Function to validate abilities data
 * @param data The abilities data to validate
 * @returns Validated abilities data
 */
export function validateAbilities(data: unknown): Abilities {
  return AbilitiesSchema.parse(data);
}

/**
 * Function to validate a single ability
 * @param data The ability data to validate
 * @returns Validated ability data
 */
export function validateAbility(data: unknown): Ability {
  return AbilitySchema.parse(data);
}
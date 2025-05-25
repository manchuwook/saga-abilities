import { z } from 'zod';

/**
 * Zod schema for ability tags system
 * Validates the structure of ability categorization and tagging
 */

// Individual tag schema
const TagSchema = z.object({
  /** Unique identifier for the tag */
  tag: z.string().min(1, "Tag ID cannot be empty"),
  
  /** Display name for the tag */
  name: z.string().min(1, "Tag name cannot be empty"),
  
  /** Description of what this tag represents */
  description: z.string().min(1, "Tag description cannot be empty"),
  
  /** Array of ability names that belong to this tag */
  abilities: z.array(z.string()).default([])
});

// Root schema for the entire tags file
export const AbilityTagsSchema = z.object({
  /** Array of all available tags */
  tags: z.array(TagSchema).min(1, "At least one tag must be defined")
});

// Type exports for TypeScript usage
export type Tag = z.infer<typeof TagSchema>;
export type AbilityTags = z.infer<typeof AbilityTagsSchema>;

// Utility schemas for common operations
export const TagIdSchema = z.string().min(1);
export const AbilityNameSchema = z.string().min(1);

// Schema for creating/updating a tag
export const CreateTagSchema = TagSchema.omit({ abilities: true }).extend({
  abilities: z.array(z.string()).optional().default([])
});

export const UpdateTagSchema = TagSchema.partial().extend({
  tag: z.string().min(1) // Tag ID is required for updates
});

// Schema for tag filtering/querying
export const TagFilterSchema = z.object({
  tagIds: z.array(z.string()).optional(),
  abilityName: z.string().optional(),
  searchTerm: z.string().optional()
}).optional();

// Validation helpers
export const validateAbilityTags = (data: unknown): AbilityTags => {
  return AbilityTagsSchema.parse(data);
};

export const validateTag = (data: unknown): Tag => {
  return TagSchema.parse(data);
};

export default AbilityTagsSchema;
import { useQuery } from '@tanstack/react-query';

// Interfaces to match the hierarchical structure in abilities.tags.json
export interface AbilityTag {
  name: string;
  tag: string;
  description: string;
  abilities?: string[];
}

export interface CategoryTag {
  name: string;
  description: string;
  abilities?: string[];
  categories?: Record<string, CategoryTag>;
}

export interface TagData {
  tags: Record<string, CategoryTag>;
}

// Interface for the processed flat tag structure used in the UI
export interface ProcessedAbilityTag {
  tag: string;
  name: string;
  description: string;
  abilities: string[];
  parentCategory?: string;
}

export interface ProcessedTagData {
  tags: ProcessedAbilityTag[];
}

// Function to flatten the hierarchical tag structure
function flattenTagStructure(tagsData: TagData): ProcessedTagData {
  const flatTags: ProcessedAbilityTag[] = [];

  // Process each top-level category
  Object.entries(tagsData.tags).forEach(([tagKey, category]) => {
    // Add the main category as a tag
    flatTags.push({
      tag: tagKey,
      name: category.name,
      description: category.description,
      abilities: category.abilities || [],
    });

    // Process nested categories if they exist
    if (category.categories) {
      Object.entries(category.categories).forEach(([subTagKey, subCategory]) => {
        flatTags.push({
          tag: `${tagKey}_${subTagKey}`,
          name: subCategory.name,
          description: subCategory.description,
          abilities: subCategory.abilities || [],
          parentCategory: category.name
        });

        // Add deeper categories if needed (can extend this for more levels)
        if (subCategory.categories) {
          Object.entries(subCategory.categories).forEach(([subSubTagKey, subSubCategory]) => {
            flatTags.push({
              tag: `${tagKey}_${subTagKey}_${subSubTagKey}`,
              name: subSubCategory.name,
              description: subSubCategory.description,
              abilities: subSubCategory.abilities || [],
              parentCategory: subCategory.name
            });
          });
        }
      });
    }
  });

  // Sort tags alphabetically by name
  flatTags.sort((a, b) => a.name.localeCompare(b.name));

  return { tags: flatTags };
}

async function fetchAbilityTags(): Promise<ProcessedTagData> {
  const response = await fetch('/abilities.tags.json');
  if (!response.ok) {
    throw new Error('Failed to fetch ability tags');
  }

  const data = await response.json();

  // Process the hierarchical tag structure into a flat list for easier use in the UI
  return flattenTagStructure(data);
}

export function useAbilityTags() {
  return useQuery({
    queryKey: ['abilityTags'],
    queryFn: fetchAbilityTags,
  });
}

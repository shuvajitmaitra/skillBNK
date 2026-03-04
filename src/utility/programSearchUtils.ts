// programSearchUtils.ts

import {TContent} from '../types/program/programModuleType';

interface SearchResults {
  matchedItems: TContent[];
  matchedPaths: Record<string, boolean>;
  matchedChapters: Record<string, boolean>;
}

/**
 * Enhanced search that includes all children of matched chapters
 * @param query Search query string
 * @param chapterModules Module data from Redux
 * @param categoryId Current category ID
 * @returns Object with matched items and paths to those items
 */
export const searchProgramData = (
  query: string,
  chapterModules: Record<string, any>,
  categoryId: string,
): SearchResults => {
  if (!query.trim() || !chapterModules || !chapterModules[categoryId]) {
    return {
      matchedItems: [],
      matchedPaths: {},
      matchedChapters: {},
    };
  }

  const searchResults: SearchResults = {
    matchedItems: [],
    matchedPaths: {},
    matchedChapters: {},
  };

  // Get all parent items and child mapping
  const parentItems: TContent[] = chapterModules[categoryId]?.parent || [];
  const childMapping: Record<string, TContent[]> =
    chapterModules[categoryId]?.child || {};

  // Build a complete item map for easier reference
  const itemMap = new Map();

  // First pass - collect all items in a flat map
  const collectAllItems = (
    items: TContent[],
    parentId: string | null = null,
    parentPath: string[] = [],
  ): void => {
    items.forEach((item: TContent) => {
      const currentPath = [...parentPath];
      if (parentId) {
        currentPath.push(parentId);
      }

      itemMap.set(item._id, {
        ...item,
        parentId,
        parentPath: currentPath,
      });

      // Process children if this is a chapter
      if (item.type === 'chapter') {
        const children = childMapping[item._id] || [];
        collectAllItems(children, item._id, currentPath);
      }
    });
  };

  collectAllItems(parentItems);

  // Second pass - perform actual search
  itemMap.forEach((item: TContent) => {
    const isChapter = item.type === 'chapter';
    const itemName = isChapter ? item.chapter?.name : item.lesson?.title;

    // Check if item matches search query
    const matchesQuery = itemName?.toLowerCase().includes(query.toLowerCase());

    if (matchesQuery) {
      // Add to matched items
      searchResults.matchedItems.push(item);

      // Mark this item's path as matched
      searchResults.matchedPaths[item._id] = true;

      // Also mark all parent paths as matched
      item.parentPath?.forEach((parentId: string) => {
        // Fixed typo here: matchedPath -> matchedPaths
        searchResults.matchedPaths[parentId] = true;
      });

      // If this is a chapter that matches, mark it and include ALL its children
      if (isChapter) {
        searchResults.matchedChapters[item._id] = true;

        // Function to recursively mark all children of a chapter
        const markAllChildren = (chapterId: string): void => {
          const children = childMapping[chapterId] || [];
          children.forEach((childItem: TContent) => {
            // Mark all children in the paths (they'll be shown when chapter is expanded)
            searchResults.matchedPaths[childItem._id] = true;

            // If this child is also a chapter, mark its children too
            if (childItem.type === 'chapter') {
              markAllChildren(childItem._id);
            }
          });
        };

        // Mark all children of this matched chapter
        markAllChildren(item._id);
      }
    }
  });

  return searchResults;
};

/**
 * Find path to an item in the tree structure
 * @param itemId ID of the item to find
 * @param chapterModules Module data from Redux
 * @param categoryId Current category ID
 * @returns Array of IDs forming the path to the item
 */
export const findPathToItem = (
  itemId: string,
  chapterModules: Record<string, any>,
  categoryId: string,
): string[] => {
  const path: string[] = [];
  const parentItems: TContent[] = chapterModules[categoryId]?.parent || [];
  const childMapping: Record<string, TContent[]> =
    chapterModules[categoryId]?.child || {};

  // Build a parent map for quick lookup
  const parentMap = new Map<string, string>();

  const buildParentMap = (
    items: TContent[],
    parentId: string | null = null,
  ): void => {
    items.forEach(item => {
      if (parentId) {
        parentMap.set(item._id, parentId);
      }

      if (item.type === 'chapter') {
        const children = childMapping[item._id] || [];
        buildParentMap(children, item._id);
      }
    });
  };

  buildParentMap(parentItems);

  // Traverse up the tree to find the path
  let currentId = itemId;
  path.unshift(currentId);

  while (parentMap.has(currentId)) {
    currentId = parentMap.get(currentId)!;
    path.unshift(currentId);
  }

  return path;
};

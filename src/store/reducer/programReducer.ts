// programReducer.ts
import {programService} from './../../services/programService';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {TContent} from '../../types/program/programModuleType';

type TCategory = {isActive: boolean; _id: string; name: string; slug: string};
export interface LessonData {
  transcription?: string;
  summary?: string;
  behavioral?: string;
  interview?: string;
  implementation?: string;
  [key: string]: string | undefined; // Allow additional properties
}

export interface Lesson {
  title: string;
  type: 'video' | string;
  url: string;
  isFree: boolean;
  duration: number;
  data: LessonData;
  updatedAt: string;
}

export interface LessonItem {
  _id: string;
  type: 'lesson' | string;
  lesson: Lesson;
  activeTab?: string | null;
  lessonInfoModalVisible?: boolean | null;
  chapterAttachmentModalVisible?: boolean | null;
  quizModalVisible?: boolean | null;
}

interface FilterOptions {
  showPinned: boolean;
  showFocused: boolean;
  showCompleted: boolean;
  showIncomplete: boolean;
}

interface SearchResults {
  matchedItems: TContent[];
  matchedPaths: Record<string, boolean>;
  matchedChapters?: Record<string, boolean>;
}

interface ProgramState {
  programs: Record<string, any>;
  categories: TCategory[] | null;
  selectedCategory: TCategory | null;
  chapterModules: any;
  selectedVideo: any;
  searchResults: SearchResults | null;
  isSearching: boolean;
  filterOptions: FilterOptions;
  isFiltering: boolean;
  filteredItems: {
    parent: TContent[];
    childMapping: Record<string, TContent[]>;
  } | null;
  chapterData: any | null;
  selectedLesson: any | LessonItem | null;
  preFilterItem: 'completed' | 'incomplete' | null;
}

const initialState: ProgramState = {
  preFilterItem: null,
  programs: {},
  categories: null,
  selectedCategory: null,
  chapterModules: null,
  selectedVideo: null,
  searchResults: null,
  isSearching: false,
  filterOptions: {
    showPinned: false,
    showFocused: false,
    showCompleted: false,
    showIncomplete: false,
  },
  isFiltering: false,
  filteredItems: null,
  chapterData: null,
  selectedLesson: null,
};

// Helper function to update a content item's property in the nested chapterModules structure
const updateContentItemProperty = (
  state: ProgramState,
  contentId: string,
  property: 'isPinned' | 'isFocused' | 'isCompleted',
  value: boolean,
) => {
  if (!state.selectedCategory || !state.chapterModules) return;

  const categoryId = state.selectedCategory._id;
  const categoryData = state.chapterModules[categoryId];

  if (!categoryData) return;

  // Function to update an item in a list
  const updateItemInList = (items: TContent[]): boolean => {
    if (!items) return false;

    for (let i = 0; i < items.length; i++) {
      if (items[i]._id === contentId) {
        // Found the item, update it
        items[i] = {
          ...items[i],
          [property]: value,
        };
        return true;
      }
    }
    return false;
  };

  // First try to update in parent items
  const parentUpdated = updateItemInList(categoryData.parent);

  // If not found in parent items, search in child mappings
  if (!parentUpdated && categoryData.child) {
    Object.keys(categoryData.child).forEach(parentId => {
      updateItemInList(categoryData.child[parentId]);
    });
  }
};

// Helper function to apply filters and generate filtered items
const applyFilters = (state: ProgramState) => {
  if (!state.selectedCategory || !state.chapterModules) {
    state.isFiltering = false;
    state.filteredItems = null;
    return;
  }

  const categoryId = state.selectedCategory._id;
  const categoryData = state.chapterModules[categoryId];

  if (!categoryData) {
    state.isFiltering = false;
    state.filteredItems = null;
    return;
  }

  const {showPinned, showFocused, showCompleted, showIncomplete} =
    state.filterOptions;

  // Check if any filter is active
  const isAnyFilterActive =
    showPinned || showFocused || showCompleted || showIncomplete;

  if (!isAnyFilterActive) {
    state.isFiltering = false;
    state.filteredItems = null;
    return;
  }

  // Set up filtered items structure
  const filteredItems = {
    parent: [] as TContent[],
    childMapping: {} as Record<string, TContent[]>,
  };

  // Helper function to check if an item matches the filter criteria
  const matchesFilter = (item: TContent): boolean => {
    if (showPinned && item.isPinned) return true;
    if (showFocused && item.isFocused) return true;
    if (showCompleted && item.isCompleted) return true;
    if (showIncomplete && !item.isCompleted) return true;
    return false;
  };

  // Helper function to include a chapter and all its children
  const includeChapterWithChildren = (
    chapter: TContent,
    parentList: TContent[],
    childMap: Record<string, TContent[]>,
  ) => {
    // Add chapter to the parent list if not already there
    if (!parentList.some(item => item._id === chapter._id)) {
      parentList.push(chapter);
    }

    // Get the chapter's children
    const children = categoryData.child[chapter._id] || [];

    // Add all children to the child mapping
    if (children.length > 0) {
      childMap[chapter._id] = [...children];

      // For each child that is a chapter, recursively include its children
      children.forEach((child: TContent) => {
        if (child.type === 'chapter') {
          includeChapterWithChildren(child, [], childMap);
        }
      });
    }
  };

  // Helper function to include a lesson with its parent chapters
  const includeLessonWithParents = (
    lesson: TContent,
    parentList: TContent[],
    childMap: Record<string, TContent[]>,
  ) => {
    // Find all parent chapters in the path to this lesson
    let currentParentId = lesson.myCourse.parent;
    const parentChapters: TContent[] = [];

    while (currentParentId) {
      // Find the parent chapter
      let parentChapter: TContent | undefined;

      // Look in parent items
      parentChapter = categoryData.parent.find(
        (item: TContent) => item._id === currentParentId,
      );

      // If not found, look in child items
      if (!parentChapter) {
        for (const parentId in categoryData.child) {
          const children = categoryData.child[parentId];
          if (!children) continue;

          parentChapter = children.find(
            (item: TContent) => item._id === currentParentId,
          );
          if (parentChapter) break;
        }
      }

      if (parentChapter) {
        parentChapters.unshift(parentChapter); // Add to beginning of array
        currentParentId = parentChapter.myCourse.parent;
      } else {
        break;
      }
    }

    // Add all parent chapters to the parent list and set up child mappings
    for (let i = 0; i < parentChapters.length; i++) {
      const chapter = parentChapters[i];

      // Add chapter to parent list if it's a top-level chapter and not already there
      if (
        i === 0 &&
        !chapter.myCourse.parent &&
        !parentList.some(item => item._id === chapter._id)
      ) {
        parentList.push(chapter);
      }

      // Set up child mapping
      const parentId = i === 0 ? chapter._id : parentChapters[i - 1]._id;

      if (!childMap[parentId]) {
        childMap[parentId] = [];
      }

      // Add chapter to child mapping if not already there
      if (i > 0 && !childMap[parentId].some(item => item._id === chapter._id)) {
        childMap[parentId].push(chapter);
      }

      // If this is the last parent chapter, add the lesson to its children
      if (i === parentChapters.length - 1) {
        if (!childMap[chapter._id]) {
          childMap[chapter._id] = [];
        }

        if (!childMap[chapter._id].some(item => item._id === lesson._id)) {
          childMap[chapter._id].push(lesson);
        }
      }
    }

    // If lesson has no parent (top level), add directly to parent list
    if (
      !lesson.myCourse.parent &&
      !parentList.some(item => item._id === lesson._id)
    ) {
      parentList.push(lesson);
    }
  };

  // First, collect all items that match the filter criteria
  const matchedParentItems: TContent[] = [];
  const matchedChildItems: TContent[] = [];

  // Check parent items
  categoryData.parent.forEach((item: TContent) => {
    if (matchesFilter(item)) {
      matchedParentItems.push(item);
    }
  });

  // Check child items
  for (const parentId in categoryData.child) {
    const children = categoryData.child[parentId];
    if (!children) continue;

    children.forEach((item: TContent) => {
      if (matchesFilter(item)) {
        matchedChildItems.push(item);
      }
    });
  }

  // Process matched items to build the filtered structure
  matchedParentItems.forEach(item => {
    if (item.type === 'chapter') {
      // Include chapter with all its children
      includeChapterWithChildren(
        item,
        filteredItems.parent,
        filteredItems.childMapping,
      );
    } else {
      // For lessons, just add to parent list
      if (!filteredItems.parent.some(existing => existing._id === item._id)) {
        filteredItems.parent.push(item);
      }
    }
  });

  // Process matched child items
  matchedChildItems.forEach(item => {
    if (item.type === 'chapter') {
      // For chapters, include with all children and also add to parent's child mapping
      includeChapterWithChildren(item, [], filteredItems.childMapping);

      // If this chapter has a parent, make sure it's included in the parent's child list
      if (item.myCourse.parent) {
        if (!filteredItems.childMapping[item.myCourse.parent]) {
          filteredItems.childMapping[item.myCourse.parent] = [];
        }

        if (
          !filteredItems.childMapping[item.myCourse.parent].some(
            child => child._id === item._id,
          )
        ) {
          filteredItems.childMapping[item.myCourse.parent].push(item);
        }

        // Make sure parent chapters are included all the way up
        let currentParentId = item.myCourse.parent;
        while (currentParentId) {
          // Find the parent chapter
          let parentChapter: TContent | undefined;

          // Look in parent items
          parentChapter = categoryData.parent.find(
            (pItem: TContent) => pItem._id === currentParentId,
          );

          // If not found, look in child items
          if (!parentChapter) {
            for (const pId in categoryData.child) {
              const children = categoryData.child[pId];
              if (!children) continue;

              parentChapter = children.find(
                (cItem: TContent) => cItem._id === currentParentId,
              );
              if (parentChapter) break;
            }
          }

          if (parentChapter) {
            // If parent is top level, add to parent list
            if (!parentChapter.myCourse.parent) {
              if (
                !filteredItems.parent.some(
                  existing => existing._id === parentChapter!._id,
                )
              ) {
                filteredItems.parent.push(parentChapter);
              }
            } else {
              // Otherwise add to its parent's child mapping
              if (!filteredItems.childMapping[parentChapter.myCourse.parent]) {
                filteredItems.childMapping[parentChapter.myCourse.parent] = [];
              }

              if (
                !filteredItems.childMapping[parentChapter.myCourse.parent].some(
                  child => child._id === parentChapter!._id,
                )
              ) {
                filteredItems.childMapping[parentChapter.myCourse.parent].push(
                  parentChapter,
                );
              }
            }

            currentParentId = parentChapter.myCourse.parent;
          } else {
            break;
          }
        }
      }
    } else {
      // For lessons, include with all parent chapters
      includeLessonWithParents(
        item,
        filteredItems.parent,
        filteredItems.childMapping,
      );
    }
  });

  state.filteredItems = filteredItems;
  state.isFiltering = true;
};

const programSlice = createSlice({
  name: 'program',
  initialState,
  reducers: {
    updateSelectedLesson: (state, action: PayloadAction<LessonItem | null>) => {
      const pre = {...state.selectedLesson};
      state.selectedLesson = {...pre, ...action.payload};
    },
    setPreFilterItem: (
      state,
      action: PayloadAction<'completed' | 'incomplete' | null>,
    ) => {
      state.preFilterItem = action.payload;
    },
    setSelectedLesson: (state, action: PayloadAction<LessonItem | null>) => {
      state.selectedLesson = action.payload;
    },
    setChapterData: (state, action: PayloadAction<TContent[]>) => {
      const pre = {...state.chapterData};
      if (state.selectedCategory?._id) {
        state.chapterData = {
          ...pre,
          [state.selectedCategory._id]: action.payload,
        };
      }
    },
    setPrograms: (state, action: PayloadAction<Record<string, any>>) => {
      state.programs = action.payload;
    },
    setCategories: (state, action: PayloadAction<TCategory[]>) => {
      state.categories = action.payload;
      state.selectedCategory = action.payload[0];
      programService.loadProgramModules(
        state.programs.program.slug,
        action.payload[0]._id,
      );
    },
    setCategories2: (state, action: PayloadAction<TCategory[] | null>) => {
      state.categories = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<TCategory>) => {
      state.selectedCategory = action.payload;
      state.searchResults = null;
      state.isSearching = false;
      state.isFiltering = false;
      state.filteredItems = null;
      programService.loadProgramModules(
        state.programs.program.slug,
        action.payload._id,
      );
    },
    setChapterModules: (state, action: PayloadAction<any>) => {
      const pre = {...state.chapterModules};
      state.chapterModules = {...pre, ...action.payload};

      // If filters were active, reapply them with the new data
      if (state.isFiltering) {
        applyFilters(state);
      }
    },
    setSelectedVideo: (state, action: PayloadAction<any>) => {
      state.selectedVideo = action.payload;
    },
    // Search-related reducers
    setSearchResults: (state, action: PayloadAction<SearchResults>) => {
      // Only set as searching if we have actual results
      if (action.payload.matchedItems.length > 0) {
        state.searchResults = action.payload;
        state.isSearching = true;
      } else {
        // If no matches found, we're still technically searching
        state.searchResults = {
          matchedItems: [],
          matchedPaths: {},
        };
        state.isSearching = true;
      }

      // Clear filter state when searching
      state.isFiltering = false;
      state.filteredItems = null;
    },
    clearSearchResults: state => {
      state.searchResults = null;
      state.isSearching = false;
    },
    // New actions for pin, focus, and complete
    togglePinContent: (state, action: PayloadAction<string>) => {
      if (!state.selectedCategory || !state.chapterModules) return;

      const contentId = action.payload;
      const categoryId = state.selectedCategory._id;
      const categoryData = state.chapterModules[categoryId];

      // Find the content item to toggle
      let contentItem: TContent | null = null;

      // Check in parent items
      if (categoryData.parent) {
        contentItem = categoryData.parent.find(
          (item: TContent) => item._id === contentId,
        );
      }
      contentItem &&
        programService.handleProgramItemAction(
          contentItem.myCourse.course,
          contentItem.isPinned ? 'unpin' : 'pin',
          contentItem._id,
        );

      // If not found, check in child items
      if (!contentItem && categoryData.child) {
        for (const parentId in categoryData.child) {
          const children = categoryData.child[parentId];
          if (children) {
            contentItem = children.find(
              (item: TContent) => item._id === contentId,
            );
            if (contentItem) break;
          }
        }
      }

      if (contentItem) {
        // Toggle the pin state
        const newPinState = !contentItem.isPinned;
        updateContentItemProperty(state, contentId, 'isPinned', newPinState);

        // If filtering is active, reapply filters
        if (state.isFiltering) {
          applyFilters(state);
        }
      }
    },

    toggleFocusContent: (state, action: PayloadAction<string>) => {
      if (!state.selectedCategory || !state.chapterModules) return;

      const contentId = action.payload;
      const categoryId = state.selectedCategory._id;
      const categoryData = state.chapterModules[categoryId];

      // Find the content item to toggle
      let contentItem: TContent | null = null;

      // Check in parent items
      if (categoryData.parent) {
        contentItem = categoryData.parent.find(
          (item: TContent) => item._id === contentId,
        );
      }

      // If not found, check in child items
      if (!contentItem && categoryData.child) {
        for (const parentId in categoryData.child) {
          const children = categoryData.child[parentId];
          if (children) {
            contentItem = children.find(
              (item: TContent) => item._id === contentId,
            );
            if (contentItem) break;
          }
        }
      }

      if (contentItem) {
        contentItem &&
          programService.handleProgramItemAction(
            contentItem.myCourse.course,
            contentItem.isFocused ? 'unfocus' : 'focus',
            contentItem._id,
          );
        // Toggle the focus state
        const newFocusState = !contentItem.isFocused;
        updateContentItemProperty(state, contentId, 'isFocused', newFocusState);

        // If filtering is active, reapply filters
        if (state.isFiltering) {
          applyFilters(state);
        }
      }
    },

    toggleCompleteContent: (state, action: PayloadAction<string>) => {
      if (!state.selectedCategory || !state.chapterModules) return;

      const contentId = action.payload;
      const categoryId = state.selectedCategory._id;
      const categoryData = state.chapterModules[categoryId];

      // Find the content item to toggle
      let contentItem: TContent | null = null;

      // Check in parent items
      if (categoryData.parent) {
        contentItem = categoryData.parent.find(
          (item: TContent) => item._id === contentId,
        );
      }

      // If not found, check in child items
      if (!contentItem && categoryData.child) {
        for (const parentId in categoryData.child) {
          const children = categoryData.child[parentId];
          if (children) {
            contentItem = children.find(
              (item: TContent) => item._id === contentId,
            );
            if (contentItem) break;
          }
        }
      }

      if (contentItem) {
        contentItem &&
          programService.handleProgramItemAction(
            contentItem.myCourse.course,
            contentItem.isCompleted ? 'incomplete' : 'complete',
            contentItem._id,
          );
        // Toggle the complete state
        const newCompleteState = !contentItem.isCompleted;
        updateContentItemProperty(
          state,
          contentId,
          'isCompleted',
          newCompleteState,
        );

        // If filtering is active, reapply filters
        if (state.isFiltering) {
          applyFilters(state);
        }
      }
    },

    // New filter-related actions
    setFilterOptions: (state, action: PayloadAction<FilterOptions>) => {
      state.filterOptions = action.payload;

      // Apply the filters
      applyFilters(state);
    },

    clearFilters: state => {
      state.filterOptions = {
        showPinned: false,
        showFocused: false,
        showCompleted: false,
        showIncomplete: false,
      };
      state.isFiltering = false;
      state.filteredItems = null;
    },
  },
});

export const {
  setPreFilterItem,
  updateSelectedLesson,
  setSelectedLesson,
  setChapterData,
  setSelectedVideo,
  setPrograms,
  setCategories,
  setCategories2,
  setSelectedCategory,
  setChapterModules,
  setSearchResults,
  clearSearchResults,
  togglePinContent,
  toggleFocusContent,
  toggleCompleteContent,
  setFilterOptions,
  clearFilters,
} = programSlice.actions;

export default programSlice.reducer;

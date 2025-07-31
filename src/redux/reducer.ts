import type { GridState, GridAction } from "./types";
import * as types from "./actionTypes";

const initialState: GridState = {
  data: [],
  groupedItems: [],
  sectionRows: {},
  loading: false,
  error: null,
  displayedSections: [],
};

export default function gridReducer(
  state = initialState,
  action: GridAction
): GridState {
  switch (action.type) {
    case types.FETCH_GRID_DATA_REQUEST:
      return { ...state, loading: true, error: null };

    case types.FETCH_GRID_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload.items,
        groupedItems: action.payload.groupedItems,
      };

    case types.FETCH_GRID_DATA_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case types.ADD_SECTION_SUCCESS:
      return {
        ...state,
        groupedItems: [action.payload, ...state.groupedItems],
        displayedSections: [action.payload, ...state.displayedSections],
      };

    case types.UPDATE_SECTION_SUCCESS:
      return {
        ...state,
        groupedItems: state.groupedItems.map((sec) =>
          sec.section_id === action.payload.sectionId
            ? { ...sec, ...action.payload.updates }
            : sec
        ),
      };

    case types.DELETE_SECTION_SUCCESS:
      return {
        ...state,
        groupedItems: state.groupedItems.filter(
          (sec) => sec.section_id !== action.payload
        ),
      };

    case types.COPY_SECTION_SUCCESS:
      const { newSection, insertAfterId } = action.payload;
      const idx = state.groupedItems.findIndex(
        (s) => s.section_id === insertAfterId
      );
      const arr = [...state.groupedItems];
      arr.splice(idx + 1, 0, newSection);
      return { ...state, groupedItems: arr };

    case types.ADD_ITEM_SUCCESS:
      return {
        ...state,
        groupedItems: state.groupedItems.map((sec) =>
          sec.section_id === action.payload.sectionId
            ? { ...sec, items: [...sec.items, action.payload.newItem] }
            : sec
        ),
      };

    case types.DELETE_ITEM_SUCCESS:
      return {
        ...state,
        groupedItems: state.groupedItems.map((sec) =>
          sec.section_id === action.payload.sectionId
            ? {
                ...sec,
                items: sec.items.filter(
                  (i) => i.item_id !== action.payload.itemId
                ),
              }
            : sec
        ),
      };

    case types.MOVE_SECTION_SUCCESS:
      return {
        ...state,
        groupedItems: action.payload,
      };
    case types.UPDATE_SECTION_ROWS_SUCCESS:
      return {
        ...state,
        sectionRows: action.payload,
      };
    case types.UPDATE_GROUPED_ITEMS_DND:
      return {
        ...state,
        groupedItems: action.payload,
      };
    case types.UPDATE_ITEM_IN_SECTION: {
      const { sectionName, updatedItem } = action.payload;
      return {
        ...state,
        groupedItems: state.groupedItems.map((section) =>
          section.section_name === sectionName
            ? {
                ...section,
                items: section.items.map((item) =>
                  item.item_id === updatedItem.item_id
                    ? { ...item, ...updatedItem }
                    : item
                ),
              }
            : section
        ),
      };
    }

    default:
      return state;
  }
}

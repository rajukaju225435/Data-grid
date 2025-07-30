import { call, put, takeLatest, all, select } from "redux-saga/effects";
import * as types from "./actionTypes";
import * as actions from "./actions";
import type { Item, Section, GridState } from "./types";

function fetchGridDataApi(): Promise<{ items: Item[]; sections: Section[] }> {
  return (
    fetch("/data-small.json")
      // return fetch("/data.json")
      .then((res) => res.json())
      .then((data) => {
        const items: Item[] = data.data.EstimateItem || [];
        const map = new Map<number, string>();
        items.forEach((i) => map.set(i.section_id, i.section_name));

        const sections: Section[] = Array.from(map, ([id, name]) => ({
          section_id: id,
          section_name: name,
          items: [],
        }));

        return { items, sections };
      })
  );
}
function groupItems(items: Item[], sections: Section[]): Section[] {
  const byId: Record<number, Item[]> = {};
  items.forEach((i) => {
    byId[i.section_id] ||= [];
    byId[i.section_id].push(i);
  });
  return sections.map((s) => ({
    ...s,
    items: byId[s.section_id] || [],
  }));
}

// function* fetchGridDataSaga() {
//   try {
//     const { items, sections } = yield call(fetchGridDataApi);
//     const grouped: Section[] = yield call(groupItems, items, sections);
//     yield put(actions.fetchGridDataSuccess({ items, groupedItems: grouped }));
//   } catch (err: any) {
//     yield put(actions.fetchGridDataFailure(err.message));
//   }
// }
function* fetchGridDataSaga() {
  try {
    const groupedItems: Section[] = yield select(
      (state: { grid: GridState }) => state.grid.groupedItems
    );

    if (groupedItems && groupedItems.length > 0) {
      yield put({
        type: types.FETCH_GRID_DATA_SUCCESS,
        payload: {
          items: [],
          groupedItems,
        },
      });
      0;
      console.log("Skipping fetch");
      return;
    }

    const { items, sections } = yield call(fetchGridDataApi);
    const grouped: Section[] = yield call(groupItems, items, sections);
    yield put(actions.fetchGridDataSuccess({ items, groupedItems: grouped }));
  } catch (err: any) {
    yield put(actions.fetchGridDataFailure(err.message));
  }
}

function* handleAddSection({
  payload,
}: ReturnType<typeof actions.addSectionRequest>) {
  const { name, description, isOptional } = payload;
  const newSection: Section = {
    section_id: Date.now(),
    section_name: name,
    description,
    isOptional,
    items: [],
  };
  yield put(actions.addSectionSuccess(newSection));
}

function* handleUpdateSection({
  payload,
}: ReturnType<typeof actions.updateSectionRequest>) {
  yield put(actions.updateSectionSuccess(payload.sectionId, payload.updates));
}

function* handleDeleteSection({
  payload,
}: ReturnType<typeof actions.deleteSectionRequest>) {
  yield put(actions.deleteSectionSuccess(payload));
}

function* handleCopySection({
  payload,
}: ReturnType<typeof actions.copySectionRequest>) {
  const srcId: number = payload;
  const sections: Section[] = yield select(
    (s: { grid: GridState }) => s.grid.groupedItems
  );
  const idx = sections.findIndex((s) => s.section_id === srcId);
  if (idx === -1) return;
  const src = sections[idx];
  const newId = Date.now();
  const cloned: Section = {
    ...src,
    section_id: newId,
    section_name: `${src.section_name} (Copy)`,
    items: src.items.map((i) => ({
      ...i,
      item_id: Date.now() + Math.random(),
      section_id: newId,
    })),
  };
  yield put(actions.copySectionSuccess(cloned, srcId));
}

function* handleAddItem({
  payload,
}: ReturnType<typeof actions.addItemRequest>) {
  const { sectionId, item } = payload;
  const section: Section = yield select(
    (s: { grid: GridState }) =>
      s.grid.groupedItems.find((sec) => sec.section_id === sectionId)!
  );
  const newItem: Item = {
    ...item,
    item_id: Date.now(),
    section_id: sectionId,
    section_name: section.section_name,
    date_added: new Date().toISOString(),
  } as Item;
  yield put(actions.addItemSuccess(sectionId, newItem));
}

function* handleDeleteItem({
  payload,
}: ReturnType<typeof actions.deleteItemRequest>) {
  yield put(actions.deleteItemSuccess(payload.sectionId, payload.itemId));
}

  function* handleMoveSection({
    payload,
  }: ReturnType<typeof actions.moveSectionRequest>): Generator<any, void, any> {
    const { fromIndex, toIndex } = payload;
    const state: any = yield select((s) => s.grid.groupedItems);
    const updated = [...state];
    const [movedItem] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, movedItem);
    yield put(actions.moveSectionSuccess(updated));
  }
function* handleMoveRowBetweenSections(
  action: ReturnType<typeof actions.moveRowBetweenSections>
): Generator<any, void, any> {
  const { fromSectionId, toSectionId, movedData, overIndex } = action.payload;

  const groupedItems: Section[] = yield select(
    (state) => state.grid.groupedItems
  );

  const fromSection = groupedItems.find((s) => s.section_id === fromSectionId);
  const toSection = groupedItems.find((s) => s.section_id === toSectionId);

  if (!fromSection || !toSection) return;

  // Remove from old section
  const filteredFromItems = fromSection.items.filter(
    (item) => !movedData.some((m) => m.item_id === item.item_id)
  );

  // Update section_id for moved items
  const updatedMovedItems = movedData.map((item) => ({
    ...item,
    section_id: toSectionId,
    section_name: toSection.section_name,
  }));

  // Insert into new section at overIndex
  let updatedToItems = toSection.items.filter(
    (item) => !movedData.some((m) => m.item_id === item.item_id)
  );

  if (overIndex >= 0) {
    updatedToItems = [
      ...updatedToItems.slice(0, overIndex),
      ...updatedMovedItems,
      ...updatedToItems.slice(overIndex),
    ];
  } else {
    updatedToItems = [...updatedToItems, ...updatedMovedItems];
  }

  const updatedGrouped = groupedItems.map((section) => {
    if (section.section_id === fromSectionId) {
      return { ...section, items: filteredFromItems };
    } else if (section.section_id === toSectionId) {
      return { ...section, items: updatedToItems };
    }
    return section;
  });

  yield put(actions.updateGroupedItemsForDnD(updatedGrouped));
}

export default function* rootSaga() {
  yield all([
    takeLatest(types.FETCH_GRID_DATA_REQUEST, fetchGridDataSaga),

    takeLatest(types.ADD_SECTION_REQUEST, handleAddSection),
    takeLatest(types.UPDATE_SECTION_REQUEST, handleUpdateSection),
    takeLatest(types.DELETE_SECTION_REQUEST, handleDeleteSection),
    takeLatest(types.COPY_SECTION_REQUEST, handleCopySection),

    takeLatest(types.ADD_ITEM_REQUEST, handleAddItem),
    takeLatest(types.DELETE_ITEM_REQUEST, handleDeleteItem),
    takeLatest(types.MOVE_SECTION_REQUEST, handleMoveSection),
    takeLatest(types.MOVE_ROW_BETWEEN_SECTIONS, handleMoveRowBetweenSections),
  ]);
}

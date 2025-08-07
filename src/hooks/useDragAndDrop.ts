import type { GridApi } from "ag-grid-community";
import { useDispatch } from "react-redux";
import { useCallback, useEffect, useRef } from "react";
import * as actions from "../redux/actions";

export function useDragAndDrop(
  gridApiRefs: React.MutableRefObject<{ [key: number]: GridApi | null }>
) {
  const dispatch = useDispatch();
  const dropZoneRefs = useRef<{ [key: string]: any }>({});
  
  const cleanupDropZones = useCallback(() => {
    Object.entries(gridApiRefs.current).forEach(([id, api]) => {
      if (api && !api.isDestroyed?.()) {
        try {
          Object.entries(dropZoneRefs.current).forEach(
            ([key, dropZoneParams]) => {
              try {
                api.removeRowDropZone(dropZoneParams);
              } catch (e) {
              }
            }
          );
        } catch (e) {
        }
      }
    });
    dropZoneRefs.current = {};
  }, [gridApiRefs]);

  const rebindDropZones = useCallback(() => {
    cleanupDropZones();
    requestAnimationFrame(() => {
      const apis = gridApiRefs.current;

      Object.entries(apis).forEach(([fromId, fromApi]) => {
        Object.entries(apis).forEach(([toId, toApi]) => {
          const fromSectionId = Number(fromId);
          const toSectionId = Number(toId);

          if (
            fromApi &&
            toApi &&
            fromSectionId !== toSectionId &&
            !fromApi.isDestroyed?.() &&
            !toApi.isDestroyed?.()
          ) {
            try {
              addDropZone(fromApi, toApi, fromSectionId, toSectionId);
            } catch (e) {
              console.warn("Error adding drop zone:", e);
            }
          }
        });
      });
    });
  }, [gridApiRefs, cleanupDropZones]);
  useEffect(() => {
    return () => {
      if (cleanupDropZones) {
        cleanupDropZones();
      }
    };
  }, [cleanupDropZones]);

  const addDropZone = useCallback(
    (
      fromApi: GridApi,
      toApi: GridApi,
      fromSectionId: number,
      toSectionId: number
    ) => {
      const dropZoneKey = `${fromSectionId}-${toSectionId}`;
      if (dropZoneRefs.current[dropZoneKey]) {
        return;
      }

      const dropZoneParams = toApi.getRowDropZoneParams({
        onDragStop: (params) => {
          const movedData = params.nodes.map((node) => node.data);
          const overIndex = params.overIndex ?? -1;

          dispatch(
            actions.moveRowBetweenSections({
              fromSectionId,
              toSectionId,
              movedData,
              overIndex,
            })
          );
          setTimeout(() => {
            rebindDropZones();
          }, 100);
        },
      });

      if (dropZoneParams) {
        fromApi.addRowDropZone(dropZoneParams);
        dropZoneRefs.current[dropZoneKey] = dropZoneParams;
      }
    },
    [dispatch, rebindDropZones]
  );

  return {
    rebindDropZones,
    cleanupDropZones,
  };
}

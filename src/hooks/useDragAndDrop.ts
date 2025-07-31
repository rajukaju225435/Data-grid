// import type { GridApi } from "ag-grid-community";
// import { useDispatch } from "react-redux";
// import * as actions from "../redux/actions";

// export function useDragAndDrop(
//   gridApiRefs: React.MutableRefObject<{ [key: number]: GridApi | null }>
// ) {
//   const dispatch = useDispatch();

//   const rebindDropZones = () => {
//     const apis = gridApiRefs.current;
//     Object.entries(apis).forEach(([fromId, fromApi]) => {
//       Object.entries(apis).forEach(([toId, toApi]) => {
//         const fromSectionId = Number(fromId);
//         const toSectionId = Number(toId);
//         if (
//           fromApi &&
//           toApi &&
//           fromSectionId !== toSectionId &&
//           !fromApi.isDestroyed?.() &&
//           !toApi.isDestroyed?.()
//         ) {
//           addDropZone(fromApi, toApi, fromSectionId, toSectionId);
//         }
//       });
//     });
//   };
//   const addDropZone = (
//     fromApi: GridApi,
//     toApi: GridApi,
//     fromSectionId: number,
//     toSectionId: number
//   ) => {
//     const dropZoneParams = toApi.getRowDropZoneParams({
//       onDragStop: (params) => {
//         const movedData = params.nodes.map((node) => node.data);
//         const overIndex = params.overIndex ?? -1;
//         dispatch(
//           actions.moveRowBetweenSections({
//             fromSectionId,
//             toSectionId,
//             movedData,
//             overIndex,
//           })
//         );
//       },
//     });

//     if (dropZoneParams) {
//       fromApi.addRowDropZone(dropZoneParams);
//     }
//   };

//   return { rebindDropZones };
// }

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
    // Clean up all existing drop zones
    Object.entries(gridApiRefs.current).forEach(([id, api]) => {
      if (api && !api.isDestroyed?.()) {
        try {
          // Clear all drop zones by removing each one individually
          Object.entries(dropZoneRefs.current).forEach(
            ([key, dropZoneParams]) => {
              try {
                api.removeRowDropZone(dropZoneParams);
              } catch (e) {
                // Ignore errors during cleanup
              }
            }
          );
        } catch (e) {
          // Ignore errors during cleanup
        }
      }
    });
    // Clear drop zone references
    dropZoneRefs.current = {};
  }, [gridApiRefs]);

  const rebindDropZones = useCallback(() => {
    // First clean up existing drop zones
    cleanupDropZones();

    // Wait for next tick to ensure DOM is ready
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
  // Add cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up drop zones when component unmounts
      if (cleanupDropZones) {
        cleanupDropZones();
      }
    };
  }, [cleanupDropZones]);
  // Add row drag handlers

  const addDropZone = useCallback(
    (
      fromApi: GridApi,
      toApi: GridApi,
      fromSectionId: number,
      toSectionId: number
    ) => {
      const dropZoneKey = `${fromSectionId}-${toSectionId}`;

      // Check if drop zone already exists
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

          // Rebind drop zones after successful drop
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

import React, { lazy, Suspense } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  AllCommunityModule,
  type ColDef,
} from "ag-grid-community";
import { FaEye, FaTrash, FaEyeSlash } from "react-icons/fa6";

import * as actions from "../redux/actions";
import { useGridData } from "../hooks/useGridData";
import { useSectionManagement } from "../hooks/useSectionManagement";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { useSidebar } from "../hooks/useSidebar";
import { useGridApi } from "../hooks/useGridApis";
import { useFilters } from "../hooks/useFilters";

import SectionBlock from "./SectionBlock";
import MarkupToggle from "./MarkupToggle";
import ZeroItemsFilter from "./ZeroItemsFilter";
import ScrollToTop from "./ScrollToTop";
import CustomTooltip from "./CustomTooltip";
import NoRecords from "./NoRecords";
import { useDragAndDrop } from "../hooks/useDragAndDrop";
// import { Tooltip } from "antd";

const AddItemDropdown = lazy(() => import("./AddItemDropdown"));
const Sidebar = lazy(() => import("./Sidebar"));

ModuleRegistry.registerModules([AllCommunityModule]);

interface Props {
  filterBySectionName?: string;
  isEditing?: boolean;
}

const DataGrid: React.FC<Props> = ({ filterBySectionName, isEditing }) => {
  const { groupedItems, loading, error, dispatch } = useGridData();

  const {
    sectionRows,
    displayedSections,
    setDisplayedSections,
    expandedKeys,
    setExpandedKeys,
  } = useSectionManagement(groupedItems);

  const { isLoadingMore, loadingDivRef } = useInfiniteScroll(
    displayedSections,
    groupedItems,
    setDisplayedSections
  );

  const {
    sidebarOpen,
    setSidebarOpen,
    sidebarMode,
    setSidebarMode,
    currentSectionId,
    setCurrentSectionId,
    selectedSection,
    selectedItem,
    openSidebar,
  } = useSidebar();

  const {
    selectedZeroFilter,
    setSelectedZeroFilter,
    showMarkup,
    setShowMarkup,
    showAllCheckboxes,
    setShowAllCheckboxes,
    flagInput,
    handleInputChange,
  } = useFilters();
  const { gridApiRefs } = useGridApi(groupedItems);
  const { rebindDropZones } = useDragAndDrop(gridApiRefs);

  const CurrencyCellRenderer = (params: any) =>
    params.value ? `₹${Number(params.value).toLocaleString()}` : "";

  const ViewButtonRenderer = (params: any) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        openSidebar("itemDetails", params.data);
      }}
      className="text-[#e94f37] hover:text-blue-700 transition-colors duration-200"
    >
      <FaEye className="text-lg text-black" />
    </button>
  );

  const DeleteButtonRenderer = (params: any) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this section?")) {
          dispatch(
            actions.deleteItemRequest(
              params.data.section_id,
              params.data.item_id
            )
          );
        }
      }}
      className="text-red-500 hover:text-red-700 transition-colors duration-200"
    >
      <FaTrash className="text-lg" />
    </button>
  );

  const rawColumnDefs: ColDef[] = [
    {
      headerName: "",
      rowDrag: true,
      colId: "rowDragCol",
      width: 30,
      pinned: "left",
      sortable: false,
      resizable: false,
      filter: false,
      editable: false,
      cellClass: "hover-drag",
    },
    {
      headerName: "",
      checkboxSelection: true,
      headerCheckboxSelection: true,
      colId: "checkboxCol",
      width: 40,
      pinned: "left",
      sortable: false,
      resizable: false,
      filter: false,
      editable: false,
      cellClass: () =>
        showAllCheckboxes ? "always-show-checkbox" : "hover-checkbox",
    },
    { headerName: "Item ID", field: "item_id", flex: 2 },
    { headerName: "Subject", field: "subject", flex: 2, editable: true },
    { headerName: "Quantity", field: "quantity", flex: 2 },
    { headerName: "Unit", field: "unit", flex: 2 },
    {
      headerName: "Unit Cost",
      field: "unit_cost",
      cellRenderer: CurrencyCellRenderer,
      flex: 2,
    },
    {
      headerName: "Markup",
      field: "markup",
      flex: 2,
      cellRenderer: (params: any) =>
        showMarkup ? (
          params.value
        ) : (
          <FaEyeSlash className="text-lg text-gray-500" />
        ),
    },
    {
      headerName: "Total",
      field: "total",
      cellRenderer: CurrencyCellRenderer,
      flex: 2,
    },
    { headerName: "Item Type", field: "item_type_display_name", flex: 2 },
    { headerName: "Section Name", field: "section_name", flex: 2 },
    {
      headerName: "Date Added",
      field: "date_added",
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleString() : "",
      flex: 2,
    },
    {
      headerName: "",
      field: "view",
      cellRenderer: ViewButtonRenderer,
      width: 35,
    },
    {
      headerName: "",
      field: "delete",
      cellRenderer: DeleteButtonRenderer,
      width: 35,
    },
  ];

  const columnDefs: ColDef[] = rawColumnDefs.map((col) => {
    const skipTooltipFields = ["view", "delete", "markup"];
    const isTooltipAllowed =
      col.field && !skipTooltipFields.includes(col.field);
    return isTooltipAllowed ? { ...col, cellRenderer: CustomTooltip } : col;
  });
  //tooltipValueGetter: (params) => params.value

  const moveSection = (fromIndex: number, toIndex: number) => {
    dispatch(actions.moveSectionRequest(fromIndex, toIndex));
  };

  console.log(moveSection,"moveddddddddddd")
  // const onGridReady = (sectionId: number) => (params: any) => {
  //   gridApiRefs.current[sectionId] = params.api;
  //   rebindDropZones();
  // };

  const onGridReady = (sectionId: number) => (params: any) => {
    gridApiRefs.current[sectionId] = params.api;

    params.api.addEventListener("gridPreDestroy", () => {
      delete gridApiRefs.current[sectionId];
    });

    setTimeout(() => {
      rebindDropZones();
    }, 0);
  };
  const onCellValueChanged = (params: any) => {
    if (!params.data?.id) return;

    dispatch(
      actions.updateItemInSection(filterBySectionName || "", params.data)
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2 justify-between w-full">
          <div className="flex items-center">
            <MarkupToggle
              showMarkup={showMarkup}
              setShowMarkup={setShowMarkup}
            />
            <label className="mr-2 pl-2 font-medium">Flag :</label>
            <input
              type="text"
              value={flagInput}
              onChange={handleInputChange}
              maxLength={1}
              placeholder="0 or 1"
              className="border px-2 py-1 rounded w-24"
            />
          </div>
          <div className="flex items-center gap-2">
            <ZeroItemsFilter
              selectedFilter={selectedZeroFilter}
              setSelectedFilter={setSelectedZeroFilter}
            />
            <Suspense
              fallback={<div className="text-sm text-gray-400">Loading...</div>}
            >
              <AddItemDropdown
                onAddSection={() => {
                  setSidebarMode("addSection");
                  setSidebarOpen(true);
                }}
              />
            </Suspense>
          </div>
        </div>
      </div>

      <div
        className={`overflow-x-hidden h-screen overflow-scroll transition-opacity duration-100 ${
          sidebarOpen ? "backdrop-blur-sm" : ""
        }`}
      >
        {(filterBySectionName
          ? groupedItems.filter((s) => s.section_name === filterBySectionName)
          : displayedSections
        ).map((section, index) => {
          const allSectionRows = sectionRows[section.section_id] || [];
          const visibleRows =
            selectedZeroFilter === "yes"
              ? allSectionRows.filter(
                  (row) =>
                    (Number(row.unit_cost?.replace("₹", "")) || 0) === 0 &&
                    (Number(row.total?.replace("₹", "")) || 0) === 0
                )
              : allSectionRows;

          return (
            <div key={section.section_id} className="section-block-wrapper">
              <SectionBlock
                section={section}
                index={index}
                moveSection={moveSection}
                displayedSections={displayedSections}
                expandedKeys={expandedKeys}
                setExpandedKeys={setExpandedKeys}
                onViewSection={(data) => openSidebar("sectionDetails", data)}
                onAddItem={(id) => {
                  setCurrentSectionId(id);
                  setSidebarMode("addItem");
                  setSidebarOpen(true);
                }}
                copysection={(id) => dispatch(actions.copySectionRequest(id))}
                deletesection={(id) =>
                  dispatch(actions.deleteSectionRequest(id))
                }
              >
                <div className="w-[140%] ag-theme-balham">
                  <AgGridReact
                    rowData={visibleRows}
                    rowModelType="clientSide"
                    rowBuffer={10}
                    columnDefs={columnDefs}
                    onCellValueChanged={onCellValueChanged}
                    defaultColDef={{
                      sortable: true,
                      resizable: true,
                      editable: isEditing,
                    }}
                    domLayout="autoHeight"
                    rowSelection="multiple"
                    // tooltipShowDelay={100}
                    // tooltipHideDelay={300}
                    rowDragManaged
                    rowDragMultiRow
                    animateRows
                    suppressRowClickSelection
                    getRowId={(params) => params.data.item_id}
                    onGridReady={onGridReady(section.section_id)}
                    key={`${section.section_id}-${section.items.length}`}
                    enableBrowserTooltips
                    onSelectionChanged={(e) => {
                      setShowAllCheckboxes(e.api.getSelectedRows().length > 0);
                    }}
                    noRowsOverlayComponent={() => (
                      <NoRecords image="/image.png" />
                    )}
                  />
                </div>
              </SectionBlock>
            </div>
          );
        })}

        {displayedSections.length < groupedItems.length && (
          <div
            ref={loadingDivRef}
            className={`text-center py-4 ${
              isLoadingMore ? "visible" : "invisible"
            }`}
          >
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-black border-t-transparent" />
          </div>
        )}
      </div>

      <Suspense
        fallback={
          <div className="text-sm text-gray-400">Loading sidebar...</div>
        }
      >
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          mode={sidebarMode}
          onAddSection={(data) => dispatch(actions.addSectionRequest(data))}
          onUpdateSection={(id, payload) =>
            dispatch(actions.updateSectionRequest(id, payload))
          }
          onAddItem={(id, item) => dispatch(actions.addItemRequest(id, item))}
          currentSectionId={currentSectionId}
          sectionData={selectedSection}
          itemData={selectedItem}
        />
      </Suspense>
      <ScrollToTop />
    </div>
  );
};

export default DataGrid;

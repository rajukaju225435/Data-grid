// import { useState, useEffect } from "react";

// export const useSectionManagement = (groupedItems: any[]) => {
//   const [sectionRows, setSectionRows] = useState<{
//     [sectionId: number]: any[];
//   }>({});
//   const [displayedSections, setDisplayedSections] = useState<any[]>([]);
//   const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

//   useEffect(() => {
//     setExpandedKeys(groupedItems.map((s) => s.section_id.toString()));
//   }, [groupedItems]);

//   useEffect(() => {
//     if (!groupedItems.length) return;
//     const initialSectionRows: { [sectionId: number]: any[] } = {};
//     groupedItems.forEach((section) => {
//       initialSectionRows[section.section_id] = section.items;
//     });
//     setSectionRows(initialSectionRows);
//     setDisplayedSections(groupedItems.slice(0, 1));
//   }, [groupedItems]);

//   return {
//     sectionRows,
//     setSectionRows,
//     displayedSections,
//     setDisplayedSections,
//     expandedKeys,
//     setExpandedKeys,
//   };
// };
import { useState, useEffect, useRef } from "react";

export const useSectionManagement = (groupedItems: any[]) => {
  const [sectionRows, setSectionRows] = useState<{ [sectionId: number]: any[] }>({});
  const [displayedSections, setDisplayedSections] = useState<any[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const prevGroupedLengthRef = useRef(0);

  useEffect(() => {
    setExpandedKeys(groupedItems.map((s) => s.section_id.toString()));
  }, [groupedItems]);

 useEffect(() => {
  if (!groupedItems.length) return;

  const initialSectionRows: { [sectionId: number]: any[] } = {};
  groupedItems.forEach((section) => {
    initialSectionRows[section.section_id] = section.items;
  });
  setSectionRows(initialSectionRows);

  // Always update displayedSections with reordered list,
  // but preserve number of currently visible sections
  if (displayedSections.length === 0) {
    setDisplayedSections(groupedItems.slice(0, 1)); // first time load
  } else {
    const currentCount = displayedSections.length;
    setDisplayedSections(groupedItems.slice(0, currentCount));
  }

  prevGroupedLengthRef.current = groupedItems.length;
}, [groupedItems]);

  return {
    sectionRows,
    setSectionRows,
    displayedSections,
    setDisplayedSections,
    expandedKeys,
    setExpandedKeys,
  };
};

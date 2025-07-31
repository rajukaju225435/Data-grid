import React, { useEffect, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Collapse } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import { MdDragIndicator } from "react-icons/md";
import { FaEye, FaPlus } from "react-icons/fa6";
import type { SectionBlockProps } from "../actions/types";

const SectionBlock: React.FC<SectionBlockProps> = ({
  section,
  index,
  moveSection,
  displayedSections,
  children,
  onViewSection,
  onAddItem,
  copysection,
  deletesection,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag, preview] = useDrag({
    type: "SECTION",
    item: { id: section.section_id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "SECTION",
    hover(item: { id: number; index: number }) {
      if (!ref.current) return;
      const dragIndex = displayedSections.findIndex(
        (s) => s.section_id === item.id
      );
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveSection(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(dragHandleRef);
  drop(ref);
  preview(ref);

  useEffect(() => {
    const updateExpanded = () => {
      const flag = localStorage.getItem("Flag");
      if (flag === "1") {
        setExpandedKeys([section.section_id.toString()]);
      } else {
        setExpandedKeys([]);
      }
    };
    updateExpanded();
    window.addEventListener("storage", updateExpanded);
    return () => window.removeEventListener("storage", updateExpanded);
  }, [section.section_id]);

  const handleCollapseChange = (keys: string[] | string) => {
    setExpandedKeys(Array.isArray(keys) ? keys : [keys]);
  };

  const toggleExpand = () => {
    const key = section.section_id.toString();
    if (expandedKeys.includes(key)) {
      setExpandedKeys([]);
    } else {
      setExpandedKeys([key]);
    }
  };

  return (
    <div
      ref={ref}
      className={`mb-6 border rounded shadow bg-white ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <Collapse 
        activeKey={expandedKeys}
        onChange={handleCollapseChange}
        expandIconPosition="start"
        expandIcon={() => null}
          collapsible="icon"
        items={[
          {
            key: section.section_id.toString(),
            label: (
              <div
                className="flex items-center justify-between w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2">
                  <div
                    ref={dragHandleRef}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <MdDragIndicator className="rotate-90" />
                  </div>

                  <div
                    className="flex items-center justify-center w-5 h-5 cursor-pointer hover:bg-gray-200 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand();
                    }}
                  >
                    <CaretRightOutlined
                      rotate={
                        expandedKeys.includes(section.section_id.toString())
                          ? 90
                          : 0
                      }
                    style={{ fontSize: "14px", transition: "transform 0.2s" }}
                  
                    />
                  </div>

                  <span className="font-semibold text-lg select-none" >
                    {section.section_name}
                  </span>
                </div>

                <div className="flex items-center gap-2 relative z-10">
                  <button
                    className="p-2 rounded hover:bg-gray-200 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewSection(section);
                    }}
                  >
                    <FaEye className="text-lg" />
                  </button>

                  <div className="relative">
                    <button
                      className="p-2 rounded hover:bg-gray-200 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDropdownOpen((prev) => !prev);
                      }}
                    >
                      <FaPlus className="text-lg" />
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow ">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddItem(section.section_id);
                            setDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                        >
                          Add New Item
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copysection(section.section_id);
                            setDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                        >
                          Copy Section
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (
                              window.confirm(
                                "Are you sure you want to delete this section?"
                              )
                            ) {
                              deletesection(section.section_id);
                              setDropdownOpen(false);
                            }
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Delete Section
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ),
            children: <div>{children}</div>,
          },
        ]}
      />
    </div>
  );
};

export default React.memo(SectionBlock);

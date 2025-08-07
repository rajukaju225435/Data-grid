import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaEdit, FaSave } from "react-icons/fa";

interface UnifiedSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "addSection" | "itemDetails" | "sectionDetails" | "addItem";
  onAddSection: (data: {
    name: string;
    description: string;
    isOptional: boolean;
  }) => void;
  onUpdateSection?: (sectionId: number, updates: any) => void;
  sectionData?: any;
  itemData?: any;
  onAddItem?: (sectionId: number, itemData: any) => void;
  currentSectionId?: number;
}

const ITEM_FIELDS = [
  { label: "Item ID", key: "item_id" },
  { label: "Estimate ID", key: "estimate_id" },
  { label: "Directory ID", key: "directory_id" },
  { label: "Company ID", key: "company_id" },
  { label: "Subject", key: "subject" },
  { label: "Quantity", key: "quantity" },
  { label: "Unit", key: "unit" },
  { label: "Unit Cost", key: "unit_cost" },
];

const Sidebar: React.FC<UnifiedSidebarProps> = ({
  isOpen,
  onClose,
  mode,
  onAddSection,
  onUpdateSection,
  sectionData,
  itemData,
  onAddItem,
  currentSectionId,
}) => {
  const [sectionName, setSectionName] = useState("");
  const [description, setDescription] = useState("");
  const [isOptional, setIsOptional] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedSectionName, setEditedSectionName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedOptional, setEditedOptional] = useState(false);
  const [newItemData, setNewItemData] = useState({
    subject: "",
    quantity: "",
    unit: "",
    unit_cost: "",
    item_type_display_name: "",
  });
  useEffect(() => {
    if (!isOpen) {
      setSectionName("");
      setDescription("");
      setIsOptional(false);
      setError("");
      setIsEditing(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (sectionData) {
      setEditedSectionName(sectionData.section_name || "");
      setEditedDescription(sectionData.description || "");
      setEditedOptional(sectionData.isOptional || false);
    }
  }, [sectionData]);

  const handleAddSection = () => {
    if (!sectionName.trim()) {
      setError("Section name is required");
      return;
    }
    onAddSection({
      name: sectionName.trim(),
      description: description.trim(),
      isOptional,
    });

    setSectionName("");
    setDescription("");
    setIsOptional(false);
    setError("");
    onClose();
  };

  const handleUpdateSection = () => {
    if (!editedSectionName.trim()) {
      setError("Section name is required");
      return;
    }
    if (onUpdateSection && sectionData) {
      onUpdateSection(sectionData.section_id, {
        section_name: editedSectionName.trim(),
        description: editedDescription.trim(),
        isOptional: editedOptional,
      });
    }
    setIsEditing(false);
  };

  const handleAddItem = () => {
    if (!newItemData.subject) {
      setError("Subject is required");
      return;
    }

    if (onAddItem && currentSectionId) {
      onAddItem(currentSectionId, {
        ...newItemData,
        item_id: Date.now(),
        date_added: new Date().toISOString(),
      });
    }

    setNewItemData({
      subject: "",
      quantity: "",
      unit: "",
      unit_cost: "",
      item_type_display_name: "",
    });
    onClose();
  };

  const renderContent = () => {
    switch (mode) {
      case "addSection":
        return (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm text-gray-600">
                Section Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={sectionName}
                onChange={(e) => {
                  setSectionName(e.target.value);
                  setError("");
                }}
                className={`w-full px-3 py-2 border bg-white/50 rounded-md focus:outline-none focus:ring-1 focus:ring-black ${
                  error ? "border-red-500" : "border-gray-200"
                } text-black`}
                placeholder="Enter section name"
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-600">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 bg-white/50 rounded-md focus:outline-none focus:ring-1 focus:ring-black h-32 text-black"
                placeholder="Enter description"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="optional"
                checked={isOptional}
                onChange={(e) => setIsOptional(e.target.checked)}
                className="mr-2 rounded border-gray-300 text-black focus:ring-black"
              />
              <label htmlFor="optional" className="text-sm text-gray-600">
                Make This Section Optional
              </label>
            </div>

            <button
              onClick={handleAddSection}
              className="w-full mt-6 py-2 rounded-md text-white bg-black hover:bg-gray-800 transition-colors duration-200"
            >
              Add Section
            </button>
          </div>
        );

      case "sectionDetails":
        return (
          sectionData && (
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm text-gray-600">
                  Section Name
                </label>
                <input
                  type="text"
                  value={
                    isEditing ? editedSectionName : sectionData.section_name
                  }
                  onChange={(e) => setEditedSectionName(e.target.value)}
                  className="w-full px-3 py-2 border bg-white/50 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                  readOnly={!isEditing}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-600">
                  Description
                </label>
                <textarea
                  value={
                    isEditing
                      ? editedDescription
                      : sectionData.description || ""
                  }
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="w-full px-3 py-2 border bg-white/50 rounded-md focus:outline-none focus:ring-1 focus:ring-black h-32"
                  readOnly={!isEditing}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sectionOptional"
                  checked={isEditing ? editedOptional : sectionData.isOptional}
                  onChange={(e) => setEditedOptional(e.target.checked)}
                  className="mr-2 rounded border-gray-300 text-black focus:ring-black"
                  disabled={!isEditing}
                />
                <label
                  htmlFor="sectionOptional"
                  className="text-sm text-gray-600"
                >
                  Optional Section
                </label>
              </div>

              {isEditing && (
                <button
                  onClick={handleUpdateSection}
                  className="w-full mt-4 py-2 rounded-md text-white bg-black hover:bg-gray-800 flex items-center justify-center gap-2"
                >
                  <FaSave /> Save Changes
                </button>
              )}
            </div>
          )
        );

      case "itemDetails":
        return (
          itemData && (
            <div className="space-y-4">
              {ITEM_FIELDS.map(({ label, key }) => (
                <div key={key} className="border-b border-gray-100 pb-3">
                  <div className="text-xs text-gray-500 mb-1">{label}</div>
                  <div className="w-full px-3 py-2 bg-gray-50 rounded text-sm">
                    {key === "date_added" && itemData[key]
                      ? new Date(itemData[key]).toLocaleString()
                      : key === "unit_cost" || key === "total"
                      ? itemData[key]
                        ? `₹${Number(itemData[key]).toLocaleString()}`
                        : ""
                      : itemData[key] ?? ""}
                  </div>
                </div>
              ))}
            </div>
          )
        );

      case "addItem":
        return (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm text-gray-600">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newItemData.subject}
                onChange={(e) =>
                  setNewItemData({ ...newItemData, subject: e.target.value })
                }
                className="w-full px-3 py-2 border bg-white/50 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-600">
                Quantity
              </label>
              <input
                type="number"
                value={newItemData.quantity || ""}
                onChange={(e) =>
                  setNewItemData({ ...newItemData, quantity: e.target.value })
                }
                className="w-full px-3 py-2 border bg-white/50 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-600">Unit</label>
              <input
                type="text"
                value={newItemData.unit}
                onChange={(e) =>
                  setNewItemData({ ...newItemData, unit: e.target.value })
                }
                className="w-full px-3 py-2 border bg-white/50 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-600">
                Unit Cost
              </label>
              <input
                type="number"
                value={newItemData.unit_cost}
                onChange={(e) =>
                  setNewItemData({ ...newItemData, unit_cost: e.target.value })
                }
                className="w-full px-3 py-2 border bg-white/50 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-600">
                Item Type
              </label>
              <input
                type="text"
                value={newItemData.item_type_display_name}
                onChange={(e) =>
                  setNewItemData({
                    ...newItemData,
                    item_type_display_name: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border bg-white/50 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <button
              onClick={handleAddItem}
              className="w-full mt-6 py-2 rounded-md text-white bg-black hover:bg-gray-800 transition-colors duration-200"
            >
              Add Item
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`fixed right-0 top-0 h-full w-[420px] bg-white/90 backdrop-blur-sm shadow-lg transition-transform duration-300 ease-in-out border-l border-gray-200 overflow-y-auto
      ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      style={{ zIndex: 1001 }}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {mode === "addSection"
              ? "Add Section"
              : mode === "sectionDetails"
              ? "Section Details"
              : mode === "addItem"
              ? "Add Item"
              : "Item Details"}
          </h2>
          <div className="flex items-center gap-2">
            {mode === "sectionDetails" && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-full hover:bg-gray-100/50"
              >
                <FaEdit className="text-xl" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100/50"
            >
              <IoMdClose className="text-2xl" />
            </button>
          </div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default React.memo(Sidebar);

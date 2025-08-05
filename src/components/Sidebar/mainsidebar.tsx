import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { FaTimes, FaTable, FaChartPie } from "react-icons/fa";
import { MdListAlt, MdOutlineAddToPhotos } from "react-icons/md";
import { FaClock } from "react-icons/fa6";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (title: string) => void;
}

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  onSelect: (label: string) => void;
}

const SidebarLink = ({ to, icon, label, onSelect }: SidebarLinkProps) => (
  <Link
    to={to}
    onClick={() => onSelect(label)}
    className="flex items-center gap-2 hover:text-[#e94f37] transition-colors"
  >
    {icon} {label}
  </Link>
);

const Sidebar = ({ isOpen, onClose, onSelect }: SidebarProps) => {
  const handleSelect = useCallback(
    (title: string) => {
      onSelect(title);
      onClose();
    },
    [onSelect, onClose]
  );

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-opacity-30 z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className="fixed top-0 left-0 h-full w-64 bg-[#393e41] text-white transition-transform duration-300 z-[99999] shadow-lg"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold">Menu</h2>
          <button
            onClick={onClose}
            className="text-white text-xl hover:text-[#e94f37] transition-colors"
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
        </div>
        <nav className="flex flex-col p-4 space-y-4">
          <SidebarLink
            to="/"
            icon={<FaTable />}
            label="DataGrid"
            onSelect={handleSelect}
          />
          <SidebarLink
            to="/dashboard"
            icon={<FaChartPie />}
            label="Dashboard - Chart"
            onSelect={handleSelect}
          />
          <SidebarLink
            to="/additem"
            icon={<MdOutlineAddToPhotos />}
            label="Add Items"
            onSelect={handleSelect}
          />
          <SidebarLink
            to="/term-conditions"
            icon={<MdListAlt />}
            label="Terms and conditions"
            onSelect={handleSelect}
          />
          <SidebarLink
            to="/files"
            icon={<MdListAlt />}
            label="Files"
            onSelect={handleSelect}
          />
          <SidebarLink
            to="/time-cards"
            icon={<FaClock />}
            label="Time Cards"
            onSelect={handleSelect}
          />
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

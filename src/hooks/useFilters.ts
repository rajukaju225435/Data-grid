import { useState } from "react";

export const useFilters = () => {
  const [selectedZeroFilter, setSelectedZeroFilter] = useState<"yes" | "no">(
    "no"
  );
  const [showMarkup, setShowMarkup] = useState(true);
  const [showAllCheckboxes, setShowAllCheckboxes] = useState(false);
  const [flagInput, setFlagInput] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFlagInput(value);
    if (value === "0" || value === "1") {
      localStorage.setItem("Flag", value);
      window.location.reload();
    }
  };

  return {
    selectedZeroFilter,
    setSelectedZeroFilter,
    showMarkup,
    setShowMarkup,
    showAllCheckboxes,
    setShowAllCheckboxes,
    flagInput,
    handleInputChange,
  };
};
``
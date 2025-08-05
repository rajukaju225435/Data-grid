import { useState } from "react";
import { useSelector } from "react-redux";
import PieChart from "./piechart";
import DataGrid from "../dataGrid";
import type { RootState } from "../../redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchGridDataRequest } from "../../redux/actions";

const Dashboard = () => {
  const [selectedTable, setSelectedTable] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();
  const { groupedItems } = useSelector((state: RootState) => state.grid);
  const tableNames = groupedItems.map((section) => section.section_name);
  console.log(groupedItems);

  useEffect(() => {
    if (groupedItems.length === 0) {
      dispatch(fetchGridDataRequest());
    }
  }, []);
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
  };

  if (groupedItems.length === 0) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="relative">
      <div className="m-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <label className="mr-2 font-semibold">Select Table:</label>
          <select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            className="border rounded px-3 py-1 hover:bg-[#000000] hover:text-white transition-colors duration-200"
          >
            <option value="">-- Select Table --</option>
            {tableNames.map((name, idx) => (
              <option key={idx} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        {selectedTable && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleEditClick}
              className="bg-[#393e41] text-white px-4 py-1 rounded hover:bg-[#e94f37] transition-colors"
            >
              Edit
            </button>
            <button
              onClick={handleSaveClick}
              className="bg-[#e94f37] text-white px-4 py-1 rounded hover:bg-[#393e41] transition-colors"
            >
              Save
            </button>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto p-4 boarder-black bg-white shadow-md shadow-gray-800 rounded-lg">
        <PieChart selectedTable={selectedTable} />
      </div>

      {selectedTable && (
        <div className="mt-8">
          <DataGrid filterBySectionName={selectedTable} isEditing={isEditing} showOnlyTable={true} hideActions={true}/>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

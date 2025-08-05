import Calendar from "react-calendar";
import { ChevronLeft } from "lucide-react";
import "react-calendar/dist/Calendar.css";
import type { HistoryEntry } from "./TimecardApp";

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  formatDateForDisplay: (dateStr: string) => string;
  currentHistory: HistoryEntry[];
  resetAllStates: () => void;
};

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  selectedDate,
  setSelectedDate,
  formatDateForDisplay,
  currentHistory,
  resetAllStates,
}: SidebarProps) => {
  return (
    <div
      className={`bg-white shadow-lg transition-all duration-300 ${
        sidebarOpen ? "w-80" : "w-0"
      } overflow-hidden`}
    >
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Calendar</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
        <div className="mb-4">
          <Calendar
            onChange={(date: any) => {
              const selected = new Date(date as Date);
              const newDateString = selected.toLocaleDateString("en-CA");
              setSelectedDate(newDateString);
              resetAllStates();
            }}
            value={new Date(selectedDate)}
            tileClassName={({ date }: { date: Date }) => {
              const dateStr = date.toLocaleDateString("en-CA");
              const isSelected = dateStr === selectedDate;
              const isToday =
                dateStr === new Date().toLocaleDateString("en-CA");
              if (isSelected) return "bg-[#e94f37] text-white rounded";
              if (isToday) return "text-white rounded ";
              return "";
            }}
          />
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">History</h3>
        </div>
        <div className="mb-2">
          <span className="text-sm bg-[#e94f37] text-white px-2 py-1 rounded">
            {formatDateForDisplay(selectedDate)}
          </span>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {currentHistory.map((entry, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                  {entry.time}
                </span>
              </div>
              <div className="flex-1">
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    entry.type === "timecard"
                      ? "bg-[#9900ff]"
                      : entry.type === "crewcard"
                      ? "bg-black"
                      : "bg-[#e94f37]"
                  }`}
                ></div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {entry.action}
                </p>
              </div>
            </div>
          ))}
          {currentHistory.length === 0 && (
            <p className="text-sm text-gray-500 italic">
              No history for this date
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

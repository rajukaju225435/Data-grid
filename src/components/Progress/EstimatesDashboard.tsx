import React, { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import type { Estimate } from "../../actions/types";
import { EstimateTable } from "./EstimateTable";
import { EstimateSidebar } from "./EstimateSidebar";
import { ProgressBar } from "./ProgressBar";
import { ProgressReport } from "./ProgressReport";
import { useLocalStorage } from "./useLocalStorageDetails";

const EstimatesDashboard: React.FC = () => {
  const [estimates, setEstimates] = useLocalStorage<Estimate[]>(
    "estimates",
    []
  );
  const [currentView, setCurrentView] = useState<
    "dashboard" | "progress-report"
  >("dashboard");
  const [selectedEstimate, setSelectedEstimate] = useState<Estimate | null>(
    null
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingEstimate, setEditingEstimate] = useState<Estimate | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const addEstimate = (estimate: Omit<Estimate, "id" | "createdAt">) => {
    const newEstimate: Estimate = {
      ...estimate,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setEstimates((prev) => [...prev, newEstimate]);
  };

  const updateEstimate = (id: string, updates: Partial<Estimate>) => {
    setEstimates((prev) =>
      prev.map((est) => (est.id === id ? { ...est, ...updates } : est))
    );
    if (selectedEstimate && selectedEstimate.id === id) {
      setSelectedEstimate((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const deleteEstimate = (id: string) => {
    if (window.confirm("Are you sure you want to delete this estimate?")) {
      setEstimates((prev) => prev.filter((est) => est.id !== id));
      if (selectedEstimate && selectedEstimate.id === id) {
        setCurrentView("dashboard");
        setSelectedEstimate(null);
      }
    }
  };

  const filteredEstimates = estimates.filter(
    (estimate) =>
      estimate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estimate.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estimate.estimateNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStats = () => {
    const mainStatuses = [
      "Completed",
      "Approved",
      "On Hold",
      "Estimating",
      "Pending Approval",
    ];
    const stats = estimates.reduce((acc, estimate) => {
      if (mainStatuses.includes(estimate.status)) {
        acc[estimate.status] = (acc[estimate.status] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const total =
      estimates.filter((est) => mainStatuses.includes(est.status)).length || 1;
    return mainStatuses.map((status) => ({
      status,
      count: stats[status] || 0,
      percentage: (((stats[status] || 0) / total) * 100).toFixed(1),
    }));
  };

  useEffect(() => {
    if (editingEstimate) {
      setSidebarOpen(true);
    }
  }, [editingEstimate]);

  if (currentView === "progress-report" && selectedEstimate) {
    return (
      <ProgressReport
        estimate={selectedEstimate}
        onBack={() => {
          setCurrentView("dashboard");
          setSelectedEstimate(null);
        }}
        onUpdate={updateEstimate}
        onDelete={deleteEstimate}
        onEdit={(estimate) => {
          setEditingEstimate(estimate);
          setCurrentView("dashboard");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7ef]">
      <div className="bg-white border-b shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Estimates Dashboard
            </h1>
          </div>
          <button
            onClick={() => {
              setEditingEstimate(null);
              setSidebarOpen(true);
            }}
            className="inline-flex items-center gap-2 bg-[#e94f37] text-white px-4 py-2 rounded-md hover:bg-[#d8432f] shadow-md transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>Add Estimate</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <ProgressBar stats={getStatusStats()} />
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              All Estimates
            </h2>
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search estimates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e94f37] shadow-sm"
              />
            </div>
          </div>

          <EstimateTable
            estimates={filteredEstimates}
            onView={(estimate) => {
              setSelectedEstimate(estimate);
              setCurrentView("progress-report");
            }}
            onEdit={(estimate) => {
              setEditingEstimate(estimate);
              setSidebarOpen(true);
            }}
            onDelete={deleteEstimate}
          />
        </div>
      </div>

      <EstimateSidebar
        isOpen={sidebarOpen}
        onClose={() => {
          setSidebarOpen(false);
          setEditingEstimate(null);
        }}
        estimate={editingEstimate}
        onSave={(data) => {
          if (editingEstimate) {
            updateEstimate(editingEstimate.id, data);
          } else {
            addEstimate(data as Omit<Estimate, "id" | "createdAt">);
          }
          setSidebarOpen(false);
          setEditingEstimate(null); 
        }}
      />
    </div>
  );
};

export default EstimatesDashboard;

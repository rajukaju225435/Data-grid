import React from "react";
import Chart from "react-apexcharts";
import { useSelector } from "react-redux";
import type { ApexOptions } from "apexcharts";
import type { RootState } from "../../redux/store";

interface DonutChartProps {
  selectedTable: any;
}

const PieChart: React.FC<DonutChartProps> = ({ selectedTable }) => {
  const { groupedItems } = useSelector((state: RootState) => state.grid);
  const section = groupedItems.find((s) => s.section_name === selectedTable);
  const items = section?.items || [];

  const totalQuantity = items.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );
  const totalUnitCost = items.reduce(
    (sum, item) => sum + Number(item.unit_cost || 0),
    0
  );
  const totalValue = items.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0
  );

  const series = [totalQuantity, totalUnitCost, totalValue];
  const labels = ["Quantity", "Unit Cost", "Total"];

  const options: ApexOptions = {
    chart: {
      type: "donut",
    },
    labels,
    colors: ["#f6f7ef", "#e94f37", "#393e41"],
    legend: {
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "16px",
              fontWeight: 600,
              color: "#1F2937",
            },
            value: {
              show: true,
              fontSize: "24px",
              fontWeight: 700,
              color: "#111827",
              formatter: (val: string) => {
                return parseInt(val).toLocaleString();
              },
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: 250 },
          legend: { position: "bottom" },
        },
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg p-6 max-w-6xl mx-auto">
      {selectedTable ? (
        <>
          <h2 className="text-xl font-semibold mb-6 text-center">
            {selectedTable} - Overview
          </h2>

          <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
            <div className="w-full md:w-2/3">
              <Chart
                options={options}
                series={series}
                type="donut"
                height={350}
              />
            </div>

            <div className="w-full md:w-1/3 mt-6 md:mt-0 space-y-4 mr-14">
              <div className="bg-[#f6f7ef] mt-6 p-4 rounded-lg shadow-sm text-center">
                <div className="text-xl font-bold text-black">
                  {totalQuantity.toLocaleString()}
                </div>
                <div className="text-sm text-gray-700">Total Quantity</div>
              </div>

              <div className="bg-[#e94f37] p-4 rounded-lg shadow-sm text-center">
                <div className="text-xl font-bold text-white">
                  ${totalUnitCost.toLocaleString()}
                </div>
                <div className="text-sm text-white">Total Unit Cost</div>
              </div>

              <div className="bg-[#393e41] p-4 rounded-lg shadow-sm text-center">
                <div className="text-xl font-bold text-white">
                  ${totalValue.toLocaleString()}
                </div>
                <div className="text-sm text-white">Total Value</div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 text-lg font-medium">
          Please select a table to view data
        </p>
      )}
    </div>
  );
};

export default PieChart;

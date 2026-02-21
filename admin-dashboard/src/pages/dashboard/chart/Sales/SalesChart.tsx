import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { getSalesMetricsData } from "../../../../api/dashboard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type SalesChartProps = {};

export function SalesChart(props: SalesChartProps) {
  const [liveData, setLiveData] = useState<any>();
  const [currentDatasetIndex, setCurrentDatasetIndex] = useState(0);

  const getDatasets = () => {
    const datasets = [
      {
        label: "Sales",
        data: liveData?.sales,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Orders",
        data: liveData?.counts,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ];
    return [datasets[currentDatasetIndex]];
  };

  const options: ChartOptions = {
    normalized: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "Chart.js Bar Chart",
      },
    },
  };

  const getData = async () => {
    try {
      const data = await getSalesMetricsData();
      setLiveData(data);
    } catch {}
  };

  useEffect(() => {
    getData();
  }, []);

  const data = {
    labels: liveData?.labels || [],
    datasets: getDatasets(),
  };

  const toggleDataset = () => {
    setCurrentDatasetIndex((prevIndex) => (prevIndex === 0 ? 1 : 0));
  };

  return (
    <div>
      <div className="bg-white shadow-md rounded-lg p-6 mt-10">
        <div className="flex justify-between">
          <h2 className="text-lg font-medium mb-4">Sales Analysis</h2>
          <button
            onClick={toggleDataset}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          >
            {currentDatasetIndex === 0
              ? "Show Orders Growth"
              : "Show Sales Growth"}
          </button>
        </div>
        <div className="flex justify-between">
          <Bar options={options} data={data} />
        </div>
      </div>
    </div>
  );
}

export default SalesChart;

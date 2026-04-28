import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title,
  Legend,
} from "chart.js";
import { Box } from "@chakra-ui/react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Title, Legend);

const FALLBACK_LABELS = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
const FALLBACK_DATASETS = [
  {
    label: "Steps",
    data: [1000, 10, 20, 40, 9000],
  },
];

const BAR_COLORS = [
  {
    border: "rgba(41, 128, 78, 1)",
    background: "rgba(41, 128, 78, 0.82)",
  },
  {
    border: "rgba(31, 58, 95, 1)",
    background: "rgba(31, 58, 95, 0.82)",
  },
  {
    border: "rgba(55, 189, 115, 1)",
    background: "rgba(55, 189, 115, 0.82)",
  },
  {
    border: "rgba(37, 99, 235, 1)",
    background: "rgba(37, 99, 235, 0.82)",
  },
];

const buildBarData = ({ labels = FALLBACK_LABELS, datasets = FALLBACK_DATASETS }) => ({
  labels,
  datasets: datasets.map((dataset, index) => {
    const palette = BAR_COLORS[index % BAR_COLORS.length];

    return {
      borderColor: dataset.borderColor || palette.border,
      backgroundColor:
        dataset.backgroundColor ||
        palette.background ||
        "rgba(41, 128, 78, 0.82)",
      borderWidth: dataset.borderWidth ?? 1,
      borderRadius: dataset.borderRadius ?? 12,
      barPercentage: dataset.barPercentage ?? 0.7,
      categoryPercentage: dataset.categoryPercentage ?? 0.72,
      ...dataset,
    };
  }),
});

const BarGraph = ({
  labels,
  datasets,
  height = 280,
  showLegend = true,
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "rectRounded",
          boxWidth: 12,
          color: "#475569",
          font: {
            family: "inherit",
            weight: "600",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.92)",
        titleColor: "#ffffff",
        bodyColor: "#e2e8f0",
        padding: 12,
        borderColor: "rgba(255,255,255,0.08)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#64748b",
          font: {
            family: "inherit",
            weight: "600",
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(148, 163, 184, 0.14)",
        },
        ticks: {
          color: "#64748b",
          font: {
            family: "inherit",
            weight: "600",
          },
        },
      },
    },
  };

  return (
    <Box h={`${height}px`} w="full">
      <Bar options={options} data={buildBarData({ labels, datasets })} />
    </Box>
  );
};

export default BarGraph;
